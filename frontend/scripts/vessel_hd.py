#!/usr/bin/env python3
"""
CleanTrack 3D vessels — high-detail build. Blender 5.2 LTS.

    blender --background scripts/blend/base.blend --python scripts/vessel_hd.py

Two ships, modelled to real proportions (L/B ~ 6, not the 1:3 barge a
schematic gets away with):

    bulk carrier     open cargo trough with topside and hopper tanks, so the
                     hold interior is visible and a cargo level can rise in it
    product tanker   flush deck, midship manifold, centreline catwalk

Architecture: the hull loads once and caches; the app clones ONE compartment
module per hold/tank and places it from `vessel-layout.json`. Any compartment
count works, not just 4-10, and a detailed hull ships once per type instead of
seven times.

    +X bow, -X stern, +Y port, -Y starboard, +Z up. Compartment No. 1 is
    forwardmost. Authored Z-up; the exporter converts to Y-up.
"""

from __future__ import annotations

import json
import math
import os
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector, Matrix

# --------------------------------------------------------------------------
# Principal dimensions. Handymax bulker: 190 x 32 x 18 m, scaled to L = 10.
# --------------------------------------------------------------------------

LOA = 10.0
BEAM = 1.70
HB = BEAM / 2.0            # half beam
DEPTH = 0.95               # keel to main deck at midships
DRAFT = 0.62               # summer waterline, for the boot-top stripe

# Cargo zone is FIXED whatever the compartment count — only its subdivision
# changes — so one hull serves every count.
CARGO_AFT = -2.90
CARGO_FWD = 3.40
CARGO_GAP = 0.10           # steel between adjacent hatch coamings

# Bulk carrier midship section: side deck, topside wing tank, hold side,
# hopper tank, tank top. These proportions are what make a bulker read as a
# bulker the moment you look into an open hold.
# The hold is an octagon in section: narrow at the hatch, widening under the
# topside tanks, narrowing again into the hopper. Getting this wrong is what
# makes a "bulk carrier" look like a barge with a slot in it.
W_HATCH = 0.59 * HB        # half width of the deck slot and the hatch
W_HOLD = 0.85 * HB         # widest point of the hold, under the topsides
W_TANKTOP = 0.59 * HB      # inner bottom half width
Z_TOPSIDE = 0.74 * DEPTH   # topside tank slope meets the hold side
Z_HOPPER = 0.38 * DEPTH    # hopper slope meets the hold side
Z_TANKTOP = 0.17 * DEPTH   # inner bottom

# Deckhouse and forecastle.
SUPER_AFT = -4.72
SUPER_FWD = -3.42
FORECASTLE_X = 3.85

BRAND_NAVY = "#0a2e52"

STATUS_COLOURS = {
    "not-started": {"fill": "#e8edf2", "edge": "#b9c5cf"},
    "in-progress": {"fill": "#fdefd0", "edge": "#c9880d"},
    "complete": {"fill": "#d9f2e4", "edge": "#1e9e63"},
    "not-applicable": {"fill": "#7f7f7f", "edge": "#5f5f5f"},
}


# --------------------------------------------------------------------------
# Small helpers
# --------------------------------------------------------------------------

def srgb_to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hexcol(value: str, alpha: float = 1.0):
    h = value.lstrip("#")
    rgb = [int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return (*(srgb_to_linear(c) for c in rgb), alpha)


def lerp(a, b, t):
    return a + (b - a) * t


def table_lookup(table, x, index):
    """Piecewise-linear read of a station table keyed by x."""
    if x <= table[0][0]:
        return table[0][index]
    if x >= table[-1][0]:
        return table[-1][index]
    for (x0, *v0), (x1, *v1) in zip(table, table[1:]):
        if x <= x1:
            t = (x - x0) / (x1 - x0)
            return lerp(v0[index - 1], v1[index - 1], t)
    return table[-1][index]


def smoothstep(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)


# --------------------------------------------------------------------------
# Hull form
# --------------------------------------------------------------------------

# x, half-beam fraction, flat-of-bottom fraction, bilge fraction,
# keel rise (x DEPTH), sheer above DEPTH (x DEPTH)
STATIONS = [
    (-5.000, 0.60, 0.00, 0.10, 0.315, 0.058),   # transom
    (-4.820, 0.76, 0.06, 0.16, 0.230, 0.050),
    (-4.600, 0.88, 0.20, 0.28, 0.135, 0.043),
    (-4.300, 0.95, 0.42, 0.42, 0.062, 0.035),
    (-3.900, 0.985, 0.66, 0.54, 0.020, 0.026),
    (-3.400, 1.000, 0.80, 0.60, 0.004, 0.018),
    (-2.600, 1.000, 0.88, 0.62, 0.000, 0.009),
    (-1.400, 1.000, 0.90, 0.62, 0.000, 0.002),
    ( 0.000, 1.000, 0.90, 0.62, 0.000, 0.000),
    ( 1.400, 1.000, 0.90, 0.62, 0.000, 0.002),
    ( 2.400, 0.998, 0.87, 0.62, 0.000, 0.008),
    ( 3.100, 0.985, 0.78, 0.58, 0.000, 0.018),
    ( 3.700, 0.945, 0.60, 0.50, 0.003, 0.031),
    ( 4.150, 0.870, 0.40, 0.40, 0.012, 0.044),
    ( 4.420, 0.750, 0.22, 0.28, 0.030, 0.056),
    ( 4.600, 0.560, 0.10, 0.17, 0.058, 0.067),
    ( 4.710, 0.320, 0.03, 0.09, 0.098, 0.075),
    ( 4.780, 0.040, 0.00, 0.03, 0.150, 0.080),   # stem
]

BOW_X = 4.78


def stem_shift(x, z):
    """
    Forward rake. The station table gives the plan shape; this leans the stem
    over so the deck reaches further forward than the forefoot, which is what
    stops the bow reading as the flat end of a barge.
    """
    if x <= 4.15:
        return 0.0
    t = (x - 4.15) / (BOW_X - 4.15)
    return (t * t) * 0.40 * (z / DEPTH - 0.42)


def hx(x, z):
    return x + stem_shift(x, z)

BILGE_SEG = 5      # segments around the bilge radius
SIDE_SEG = 3       # segments up the topside


def station_params(x):
    hb = table_lookup(STATIONS, x, 1) * HB
    flat = table_lookup(STATIONS, x, 2) * hb
    bilge = table_lookup(STATIONS, x, 3) * HB * 0.62
    keel = table_lookup(STATIONS, x, 4) * DEPTH
    deck = DEPTH + table_lookup(STATIONS, x, 5) * DEPTH
    bilge = min(bilge, max(hb - flat, 1e-4), max(deck - keel, 1e-4) * 0.8)
    return hb, flat, bilge, keel, deck


def hull_section(x):
    """
    Half section from the keel centreline round the bilge to the deck edge,
    as (y, z). Constant point count so consecutive stations loft cleanly.
    """
    hb, flat, bilge, keel, deck = station_params(x)
    pts = [(0.0, keel)]
    if flat > 1e-5:
        pts.append((flat, keel))
    else:
        pts.append((flat + 1e-4, keel))

    cy, cz = flat, keel + bilge          # bilge arc centre
    for k in range(1, BILGE_SEG + 1):
        a = math.radians(90.0 * k / BILGE_SEG)
        pts.append((cy + bilge * math.sin(a), cz - bilge * math.cos(a)))

    side_top = flat + bilge
    z0 = keel + bilge
    for k in range(1, SIDE_SEG + 1):
        t = k / SIDE_SEG
        # A touch of tumblehome-free flare: the topside leans out slightly as
        # it rises, more so towards the ends where hb < HB.
        y = lerp(side_top, hb, smoothstep(t) ** 0.7)
        pts.append((y, lerp(z0, deck, t)))
    return pts


def deck_half_beam(x):
    return station_params(x)[0]


def deck_z_at(x):
    return station_params(x)[4]


# --------------------------------------------------------------------------
# bmesh construction
# --------------------------------------------------------------------------

def bridge_loops(bm, a, b):
    for i in range(len(a) - 1):
        bm.faces.new((a[i], a[i + 1], b[i + 1], b[i]))


def ring(bm, pts, z):
    return [bm.verts.new((x, y, z)) for x, y in pts]


def prism(bm, pts, z0, z1, cap_bottom=True, cap_top=True):
    lo = [bm.verts.new((x, y, z0)) for x, y in pts]
    hi = [bm.verts.new((x, y, z1)) for x, y in pts]
    n = len(pts)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((lo[i], lo[j], hi[j], hi[i]))
    if cap_bottom:
        bm.faces.new(list(reversed(lo)))
    if cap_top:
        bm.faces.new(hi)
    return lo, hi


def cube(bm, x0, x1, y0, y1, z0, z1):
    return prism(bm, [(x0, y0), (x1, y0), (x1, y1), (x0, y1)], z0, z1)


def cylinder(bm, cx, cy, r, z0, z1, seg=16, cap_bottom=True, cap_top=True):
    pts = [
        (cx + r * math.cos(2 * math.pi * k / seg), cy + r * math.sin(2 * math.pi * k / seg))
        for k in range(seg)
    ]
    return prism(bm, pts, z0, z1, cap_bottom, cap_top)


def cylinder_x(bm, x0, x1, cy, cz, r, seg=14):
    """Pipe running along X."""
    rim = [
        (cy + r * math.cos(2 * math.pi * k / seg), cz + r * math.sin(2 * math.pi * k / seg))
        for k in range(seg)
    ]
    lo = [bm.verts.new((x0, y, z)) for y, z in rim]
    hi = [bm.verts.new((x1, y, z)) for y, z in rim]
    for i in range(seg):
        j = (i + 1) % seg
        bm.faces.new((lo[i], lo[j], hi[j], hi[i]))
    bm.faces.new(list(reversed(lo)))
    bm.faces.new(hi)


def rounded_rect(length, width, radius, seg=4):
    hx, hy = length / 2.0, width / 2.0
    r = max(0.004, min(radius, hx * 0.45, hy * 0.45))
    out = []
    for ox, oy, a0 in ((hx - r, -hy + r, -90.0), (hx - r, hy - r, 0.0),
                       (-hx + r, hy - r, 90.0), (-hx + r, -hy + r, 180.0)):
        for k in range(seg + 1):
            a = math.radians(a0 + 90.0 * k / seg)
            out.append((ox + r * math.cos(a), oy + r * math.sin(a)))
    return out


# --------------------------------------------------------------------------
# Scene / object plumbing
# --------------------------------------------------------------------------

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"


def new_object(name, bm, material=None, smooth_angle=None, collection=None):
    """
    Shading is resolved in bmesh with sharp-edge flags rather than a modifier:
    Blender 5 moved "Smooth by Angle" to a geometry-nodes asset, and sharp
    edges are what the glTF exporter reads anyway.
    """
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    if smooth_angle is None:
        for f in bm.faces:
            f.smooth = False
    else:
        threshold = math.radians(smooth_angle)
        for f in bm.faces:
            f.smooth = True
        for e in bm.edges:
            e.smooth = (len(e.link_faces) == 2
                        and e.calc_face_angle(math.pi) <= threshold)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    (collection or bpy.context.collection).objects.link(obj)
    if material is not None:
        mesh.materials.append(material)
    return obj


def join_objects(name, objs):
    """Merge into one object, keeping every material slot."""
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    joined = bpy.context.view_layer.objects.active
    joined.name = name
    joined.data.name = name
    return joined


# --------------------------------------------------------------------------
# Materials
#
# Everything is procedural here and baked to image maps later, so the look is
# authored once and the .glb carries flat textures a browser can read.
# --------------------------------------------------------------------------

def _nodes(mat):
    return mat.node_tree.nodes, mat.node_tree.links


def base_material(name, colour, roughness=0.55, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes, _ = _nodes(mat)
    bsdf = next(n for n in nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = hexcol(colour)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    mat.diffuse_color = hexcol(colour)
    return mat


def _add(nodes, kind, loc):
    n = nodes.new(kind)
    n.location = loc
    return n


def weathered_steel(name, colour, roughness=0.5, rust=0.5, streak_scale=(3.0, 3.0, 0.40),
                    grime="#3d3227", wear="#8d9196"):
    """
    Painted steel that has been at sea. Rust and salt bloom stretched
    vertically so it reads as streaking, plus broad patchy fade so large flat
    plates are never one dead colour.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes, links = _nodes(mat)
    bsdf = next(n for n in nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.location = (600, 0)

    tex = _add(nodes, "ShaderNodeTexCoord", (-1400, 0))
    mapping = _add(nodes, "ShaderNodeMapping", (-1200, 0))
    mapping.inputs["Scale"].default_value = streak_scale
    links.new(tex.outputs["Object"], mapping.inputs["Vector"])

    streaks = _add(nodes, "ShaderNodeTexNoise", (-1000, 120))
    streaks.inputs["Scale"].default_value = 4.0
    streaks.inputs["Detail"].default_value = 9.0
    streaks.inputs["Roughness"].default_value = 0.62
    links.new(mapping.outputs["Vector"], streaks.inputs["Vector"])

    streak_ramp = _add(nodes, "ShaderNodeValToRGB", (-800, 120))
    streak_ramp.color_ramp.elements[0].position = 0.60
    streak_ramp.color_ramp.elements[1].position = 0.86
    links.new(streaks.outputs["Fac"], streak_ramp.inputs["Fac"])

    patch = _add(nodes, "ShaderNodeTexNoise", (-1000, -180))
    patch.inputs["Scale"].default_value = 1.1
    patch.inputs["Detail"].default_value = 4.0
    links.new(tex.outputs["Object"], patch.inputs["Vector"])

    patch_ramp = _add(nodes, "ShaderNodeValToRGB", (-800, -180))
    patch_ramp.color_ramp.elements[0].position = 0.35
    patch_ramp.color_ramp.elements[1].position = 0.72
    links.new(patch.outputs["Fac"], patch_ramp.inputs["Fac"])

    faded = _add(nodes, "ShaderNodeMix", (-560, -120))
    faded.data_type = "RGBA"
    faded.inputs[6].default_value = hexcol(colour)
    faded.inputs[7].default_value = hexcol(wear)
    # Scale the patch mask right down: wired straight in it drives the mix from
    # 0 to 1 and the paint reads as camouflage rather than as fade.
    fade_amt = _add(nodes, "ShaderNodeMath", (-700, -40))
    fade_amt.operation = "MULTIPLY"
    fade_amt.inputs[1].default_value = 0.16
    links.new(patch_ramp.outputs["Color"], fade_amt.inputs[0])
    links.new(fade_amt.outputs[0], faded.inputs["Factor"])

    rusted = _add(nodes, "ShaderNodeMix", (-320, 0))
    rusted.data_type = "RGBA"
    rusted.inputs[7].default_value = hexcol(grime)
    links.new(faded.outputs[2], rusted.inputs[6])

    rust_amt = _add(nodes, "ShaderNodeMath", (-560, 220))
    rust_amt.operation = "MULTIPLY"
    rust_amt.inputs[1].default_value = rust
    links.new(streak_ramp.outputs["Color"], rust_amt.inputs[0])
    links.new(rust_amt.outputs[0], rusted.inputs["Factor"])
    links.new(rusted.outputs[2], bsdf.inputs["Base Color"])

    rough = _add(nodes, "ShaderNodeMapRange", (-320, -320))
    rough.inputs["To Min"].default_value = max(0.05, roughness - 0.07)
    rough.inputs["To Max"].default_value = min(1.0, roughness + 0.12)
    links.new(patch_ramp.outputs["Color"], rough.inputs["Value"])
    links.new(rough.outputs["Result"], bsdf.inputs["Roughness"])

    bump = _add(nodes, "ShaderNodeBump", (300, -320))
    bump.inputs["Strength"].default_value = 0.035
    bump.inputs["Distance"].default_value = 0.01
    links.new(streaks.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    mat.diffuse_color = hexcol(colour)
    return mat


def hull_material(name="mat_hull"):
    """
    One material for the whole hull: antifouling red, black boot-top and navy
    topside chosen by world Z, with rust streaking over the lot. Banding by
    height rather than by separate meshes means no seam to line up.
    """
    mat = weathered_steel(name, BRAND_NAVY, roughness=0.52, rust=0.26,
                          streak_scale=(3.4, 3.4, 0.42))
    nodes, links = _nodes(mat)
    bsdf = next(n for n in nodes if n.type == "BSDF_PRINCIPLED")
    rusted = next(n for n in nodes if n.type == "MIX" and n.location.x == -320)

    geo = _add(nodes, "ShaderNodeNewGeometry", (-1400, -560))
    sep = _add(nodes, "ShaderNodeSeparateXYZ", (-1200, -560))
    links.new(geo.outputs["Position"], sep.inputs["Vector"])

    band = _add(nodes, "ShaderNodeValToRGB", (-1000, -560))
    ramp = band.color_ramp
    ramp.interpolation = "CONSTANT"
    ramp.elements[0].position = 0.0
    ramp.elements[0].color = hexcol("#7d2b22")            # antifouling
    ramp.elements[1].position = DRAFT / (DEPTH * 1.35)
    ramp.elements[1].color = hexcol("#141a1f")            # boot-top
    top = ramp.elements.new((DRAFT + 0.055) / (DEPTH * 1.35))
    top.color = hexcol(BRAND_NAVY)

    div = _add(nodes, "ShaderNodeMath", (-1100, -700))
    div.operation = "DIVIDE"
    div.inputs[1].default_value = DEPTH * 1.35
    links.new(sep.outputs["Z"], div.inputs[0])
    links.new(div.outputs[0], band.inputs["Fac"])

    # Band colour replaces the flat paint colour feeding the rust mix.
    faded = next(n for n in nodes if n.type == "MIX" and n.location.x == -560
                 and n.location.y == -120)
    links.new(band.outputs["Color"], faded.inputs[6])

    # Rust runs down from the deck edge, so scale it by height.
    rust_amt = next(n for n in nodes if n.type == "MATH" and n.location.x == -560)
    height_bias = _add(nodes, "ShaderNodeMapRange", (-760, 380))
    height_bias.inputs["From Min"].default_value = 0.15
    height_bias.inputs["From Max"].default_value = 1.0
    height_bias.inputs["To Min"].default_value = 0.25
    height_bias.inputs["To Max"].default_value = 1.0
    links.new(div.outputs[0], height_bias.inputs["Value"])
    biased = _add(nodes, "ShaderNodeMath", (-560, 380))
    biased.operation = "MULTIPLY"
    links.new(rust_amt.outputs[0], biased.inputs[0])
    links.new(height_bias.outputs["Result"], biased.inputs[1])
    links.new(biased.outputs[0], rusted.inputs["Factor"])
    return mat


def status_material(name):
    """
    The surface the app recolours. Neutral grey steel with grime baked in, so
    multiplying by a status colour at runtime gives tinted steel rather than a
    flat plastic swatch.
    """
    return weathered_steel(name, "#c8ced4", roughness=0.55, rust=0.30,
                           streak_scale=(5.0, 5.0, 1.0), grime="#6a6257",
                           wear="#aeb4ba")


# --------------------------------------------------------------------------
# Hull shell
# --------------------------------------------------------------------------

def station_positions():
    """Dense near the ends where the form changes fast, coarse amidships."""
    xs = []
    x = -5.0
    while x < BOW_X - 1e-6:
        if x < -4.2 or x > 3.4:
            step = 0.050
        elif x < -3.2 or x > 2.6:
            step = 0.11
        else:
            step = 0.30
        xs.append(round(x, 4))
        x += step
    xs.append(BOW_X)
    return xs


def full_section(x):
    half = hull_section(x)
    return [(-y, z) for y, z in reversed(half[1:])] + half


def build_hull_shell(bm):
    xs = station_positions()
    loops = []
    for x in xs:
        loops.append([bm.verts.new((hx(x, z), y, z)) for y, z in full_section(x)])
    for a, b in zip(loops, loops[1:]):
        bridge_loops(bm, a, b)

    # Transom: the flat plate across the stern, closed off by the deck line.
    first = loops[0]
    deck_edge_z = deck_z_at(xs[0])
    bm.faces.new(list(reversed(first)))
    # Stem: the bow section is a sliver, cap it.
    bm.faces.new(loops[-1])
    return loops, xs


def ellipsoid(bm, c, r, seg_u=20, seg_v=10):
    cx, cy, cz = c
    rx, ry, rz = r
    grid = []
    for i in range(seg_v + 1):
        v = math.pi * i / seg_v
        row = []
        for j in range(seg_u):
            u = 2 * math.pi * j / seg_u
            row.append(bm.verts.new((
                cx + rx * math.cos(v),
                cy + ry * math.sin(v) * math.cos(u),
                cz + rz * math.sin(v) * math.sin(u),
            )))
        grid.append(row)
    for i in range(seg_v):
        for j in range(seg_u):
            k = (j + 1) % seg_u
            a, b, c2, d = grid[i][j], grid[i][k], grid[i + 1][k], grid[i + 1][j]
            verts = [v for v in (a, b, c2, d)]
            if len({v.co.to_tuple(5) for v in verts}) < 3:
                continue
            try:
                bm.faces.new(verts)
            except ValueError:
                pass


def build_hull_object(open_trough=True):
    """Outer shell, bulbous bow, weather deck, and — on the bulker — the open
    cargo slot with its hold structure. A tanker's cargo tanks are closed, so
    it gets a flush deck instead."""
    bm = bmesh.new()
    build_hull_shell(bm)
    ellipsoid(bm, (4.66, 0.0, 0.245), (0.44, 0.130, 0.150), seg_u=18, seg_v=9)

    if not open_trough:
        prev = None
        for i in range(70):
            x = lerp(-5.0, BOW_X, i / 69)
            hb, z = deck_half_beam(x), deck_z_at(x)
            xr = hx(x, z)
            cur = (bm.verts.new((xr, hb, z)), bm.verts.new((xr, -hb, z)))
            if prev:
                bm.faces.new((prev[0], cur[0], cur[1], prev[1]))
            prev = cur
        return bm

    slot_aft = CARGO_AFT + CARGO_GAP     # aft cross deck closes the slot here
    steps = 26
    xs_cargo = [slot_aft + (CARGO_FWD - slot_aft) * i / steps for i in range(steps + 1)]

    def strip(xs, pt_a, pt_b):
        for sign in (1.0, -1.0):
            prev = None
            for x in xs:
                ya, za = pt_a(x)
                yb, zb = pt_b(x)
                cur = (bm.verts.new((x, sign * ya, za)), bm.verts.new((x, sign * yb, zb)))
                if prev:
                    quad = (prev[0], cur[0], cur[1], prev[1])
                    bm.faces.new(quad if sign > 0 else tuple(reversed(quad)))
                prev = cur

    # Weather deck: full width, from the ship's side inboard to the hatch slot.
    strip(xs_cargo, lambda x: (deck_half_beam(x), deck_z_at(x)),
          lambda x: (W_HATCH, deck_z_at(x)))
    # Topside wing tank: slopes down and OUTBOARD, so the hold opens out below
    # the hatch. This is the line that reads as "bulk carrier".
    strip(xs_cargo, lambda x: (W_HATCH, deck_z_at(x)), lambda x: (W_HOLD, Z_TOPSIDE))
    strip(xs_cargo, lambda x: (W_HOLD, Z_TOPSIDE), lambda x: (W_HOLD, Z_HOPPER))
    strip(xs_cargo, lambda x: (W_HOLD, Z_HOPPER), lambda x: (W_TANKTOP, Z_TANKTOP))
    strip(xs_cargo, lambda x: (W_TANKTOP, Z_TANKTOP), lambda x: (0.0, Z_TANKTOP))

    def deck_panel(x0, x1, steps_):
        prev = None
        for i in range(steps_ + 1):
            x = lerp(x0, x1, i / steps_)
            hb = deck_half_beam(x)
            z = deck_z_at(x)
            xr = hx(x, z)
            cur = (bm.verts.new((xr, hb, z)), bm.verts.new((xr, -hb, z)))
            if prev:
                bm.faces.new((prev[0], cur[0], cur[1], prev[1]))
            prev = cur

    deck_panel(-5.0, slot_aft, 16)      # includes the aft cross deck
    deck_panel(CARGO_FWD, BOW_X, 18)

    # Aft end bulkhead. The forward one and every bulkhead between holds comes
    # from the compartment modules, so the count can vary without touching
    # this mesh.
    x = slot_aft
    pts = [(W_HATCH, deck_z_at(x)), (W_HOLD, Z_TOPSIDE), (W_HOLD, Z_HOPPER),
           (W_TANKTOP, Z_TANKTOP)]
    pts = [(-y, z) for y, z in reversed(pts)] + pts
    verts = [bm.verts.new((x, y, z)) for y, z in pts]
    bm.faces.new(list(reversed(verts)))
    return bm


# --------------------------------------------------------------------------
# Deckhouse, forecastle, deck furniture
# --------------------------------------------------------------------------

HOUSE_AFT, HOUSE_FWD = -4.62, -3.45
TIER_H = 0.135


def build_superstructure():
    """Four accommodation decks nearly the full beam, bridge with wings,
    wheelhouse, funnel. Wide and low, the way a handymax actually looks."""
    base = deck_z_at((HOUSE_AFT + HOUSE_FWD) / 2)
    bm = bmesh.new()
    z = base
    for i in range(4):
        inset = 0.015 * i
        cube(bm, HOUSE_AFT + inset, HOUSE_FWD - inset,
             -(0.745 - inset), 0.745 - inset, z, z + TIER_H)
        z += TIER_H
    cube(bm, HOUSE_AFT + 0.30, HOUSE_FWD - 0.14, -0.845, 0.845, z, z + 0.024)
    cube(bm, HOUSE_AFT + 0.09, HOUSE_FWD - 0.05, -0.70, 0.70, z + 0.024, z + TIER_H)
    z += TIER_H + 0.024
    cube(bm, HOUSE_AFT + 0.24, HOUSE_FWD - 0.09, -0.62, 0.62, z, z + 0.105)
    z += 0.105
    cube(bm, HOUSE_AFT + 0.28, HOUSE_FWD - 0.13, -0.58, 0.58, z, z + 0.012)
    house = new_object("superstructure", bm,
                       base_material("mat_superstructure", "#e6e9ec", 0.5))
    top_z = z + 0.012

    wbm = bmesh.new()
    wz = base
    for i in range(4):
        inset = 0.015 * i
        for k in range(7):                      # square lights, not office bands
            cy = -0.60 + 0.20 * k
            cube(wbm, HOUSE_FWD - inset - 0.010, HOUSE_FWD - inset + 0.004,
                 cy - 0.045, cy + 0.045, wz + 0.058, wz + 0.098)
        for sign in (1, -1):
            for k in range(5):
                cx = HOUSE_AFT + 0.16 + 0.21 * k
                cube(wbm, cx - 0.048, cx + 0.048,
                     sign * (0.745 - inset) - 0.004, sign * (0.745 - inset) + 0.010,
                     wz + 0.058, wz + 0.098)
        wz += TIER_H
    cube(wbm, HOUSE_FWD - 0.062, HOUSE_FWD - 0.046, -0.66, 0.66,
         top_z - 0.100, top_z - 0.028)
    glass = new_object("detail_windows", wbm,
                       base_material("mat_glass", "#101a24", 0.12, 0.35))

    fbm = bmesh.new()
    prism(fbm, [(-4.56, -0.21), (-4.20, -0.21), (-4.22, 0.21), (-4.54, 0.21)],
          base + 0.55, base + 0.72)
    prism(fbm, [(-4.54, -0.19), (-4.22, -0.19), (-4.25, 0.19), (-4.51, 0.19)],
          base + 0.72, base + 1.05)
    funnel = new_object("detail_funnel", fbm,
                        weathered_steel("mat_funnel", BRAND_NAVY, 0.4, 0.35))
    bandbm = bmesh.new()
    prism(bandbm, [(-4.548, -0.198), (-4.222, -0.198), (-4.252, 0.198), (-4.518, 0.198)],
          base + 0.80, base + 0.93)
    band = new_object("detail_funnel_band", bandbm,
                      base_material("mat_funnel_band", "#d8dde2", 0.45))

    mbm = bmesh.new()                            # radar mast on the wheelhouse
    cylinder(mbm, -4.10, 0.0, 0.014, top_z, top_z + 0.30, seg=8)
    cube(mbm, -4.19, -4.01, -0.11, 0.11, top_z + 0.20, top_z + 0.215)
    mast = new_object("detail_mast_aft", mbm,
                      weathered_steel("mat_mast", "#c3c7ca", 0.5, 0.35))
    return [house, glass, funnel, band, mast], top_z


def build_forecastle():
    """Raised bow deck with bulwark, windlass and mooring winches."""
    bm = bmesh.new()
    rise = 0.20
    xs = [FORECASTLE_X + (BOW_X - FORECASTLE_X) * i / 14 for i in range(15)]
    prev = None
    for x in xs:
        hb = deck_half_beam(x) - 0.012
        z = deck_z_at(x) + rise
        xr = hx(x, z)
        cur = (bm.verts.new((xr, hb, z)), bm.verts.new((xr, -hb, z)))
        if prev:
            bm.faces.new((prev[0], cur[0], cur[1], prev[1]))
        prev = cur
    hb0 = deck_half_beam(FORECASTLE_X) - 0.012
    z0 = deck_z_at(FORECASTLE_X)
    cube(bm, FORECASTLE_X - 0.02, FORECASTLE_X + 0.02, -hb0, hb0, z0, z0 + rise)
    for sign in (1, -1):
        prev = None
        for x in xs:
            hb = deck_half_beam(x) - 0.012
            z = deck_z_at(x)
            cur = (bm.verts.new((hx(x, z), sign * hb, z)),
                   bm.verts.new((hx(x, z + rise), sign * hb, z + rise + 0.085)))
            if prev:
                quad = (prev[0], cur[0], cur[1], prev[1])
                bm.faces.new(quad if sign > 0 else tuple(reversed(quad)))
            prev = cur
    fo = new_object("detail_forecastle", bm,
                    weathered_steel("mat_forecastle", "#2b4c33", 0.62, 0.55))

    gbm = bmesh.new()
    base = deck_z_at(4.3) + rise
    cylinder(gbm, 4.30, 0.0, 0.085, base, base + 0.10, seg=14)
    cube(gbm, 4.16, 4.44, -0.20, -0.10, base, base + 0.075)
    cube(gbm, 4.16, 4.44, 0.10, 0.20, base, base + 0.075)
    for x in (3.98, 4.62):
        cube(gbm, x - 0.09, x + 0.09, -0.30, -0.14, base, base + 0.085)
        cube(gbm, x - 0.09, x + 0.09, 0.14, 0.30, base, base + 0.085)
    gear = new_object("detail_mooring", gbm,
                      weathered_steel("mat_deckgear", "#6f7681", 0.6, 0.5))

    fmb = bmesh.new()                            # foremast just aft of the break
    fz = deck_z_at(3.62)
    cylinder(fmb, 3.62, 0.0, 0.016, fz, fz + 0.52, seg=8)
    cube(fmb, 3.55, 3.69, -0.15, 0.15, fz + 0.40, fz + 0.415)
    fmast = new_object("detail_mast_fwd", fmb,
                       weathered_steel("mat_mast_fwd", "#c3c7ca", 0.5, 0.35))
    return [fo, gear, fmast]


def build_railings(x0, x1, y_at, z_at, name, post_step=0.16, height=0.085):
    """Posts and three rails - cheap geometry, large payoff in silhouette."""
    bm = bmesh.new()
    n = max(2, int((x1 - x0) / post_step))
    for sign in (1, -1):
        for i in range(n + 1):
            x = lerp(x0, x1, i / n)
            y = sign * y_at(x)
            z = z_at(x)
            cube(bm, x - 0.006, x + 0.006, y - 0.006, y + 0.006, z, z + height)
        for k in (0.34, 0.67, 1.0):
            prev = None
            for i in range(n + 1):
                x = lerp(x0, x1, i / n)
                y = sign * y_at(x)
                z = z_at(x) + height * k
                cur = (bm.verts.new((x, y - 0.005, z - 0.005)),
                       bm.verts.new((x, y + 0.005, z - 0.005)),
                       bm.verts.new((x, y + 0.005, z + 0.005)),
                       bm.verts.new((x, y - 0.005, z + 0.005)))
                if prev:
                    for a in range(4):
                        b = (a + 1) % 4
                        bm.faces.new((prev[a], prev[b], cur[b], cur[a]))
                prev = cur
    return new_object(name, bm, weathered_steel(f"mat_{name}", "#c3c7ca", 0.55, 0.4))


def build_stern_gear():
    """Skeg, rudder, propeller."""
    bm = bmesh.new()
    prism(bm, [(-4.95, -0.05), (-4.35, -0.05), (-4.35, 0.05), (-4.95, 0.05)], 0.02, 0.30)
    rudder = bmesh.new()
    prism(rudder, [(-5.02, -0.022), (-4.78, -0.030), (-4.74, 0.030), (-4.98, 0.022)],
          0.03, 0.36)
    hub = bmesh.new()
    cylinder_x(hub, -4.44, -4.30, 0.0, 0.20, 0.036, seg=12)
    for k in range(4):
        a = 2 * math.pi * k / 4 + 0.4
        blade = [
            (0.02 * math.cos(a), 0.20 + 0.02 * math.sin(a)),
            (0.14 * math.cos(a) - 0.03 * math.sin(a),
             0.20 + 0.14 * math.sin(a) + 0.03 * math.cos(a)),
            (0.15 * math.cos(a) + 0.03 * math.sin(a),
             0.20 + 0.15 * math.sin(a) - 0.03 * math.cos(a)),
        ]
        v0 = [hub.verts.new((-4.40, y, z)) for y, z in blade]
        v1 = [hub.verts.new((-4.34, y, z)) for y, z in blade]
        for i in range(3):
            j = (i + 1) % 3
            hub.faces.new((v0[i], v0[j], v1[j], v1[i]))
        hub.faces.new(list(reversed(v0)))
        hub.faces.new(v1)
    return [
        new_object("detail_skeg", bm, weathered_steel("mat_skeg", "#7d2b22", 0.6, 0.5)),
        new_object("detail_rudder", rudder,
                   weathered_steel("mat_rudder", "#7d2b22", 0.6, 0.5)),
        new_object("detail_propeller", hub,
                   base_material("mat_propeller", "#a08a5a", 0.28, 0.85)),
    ]


def assign_hull_regions(obj):
    """
    One hull mesh, three paint schemes. Splitting by face position rather than
    by separate objects means the deck edge and the hopper knuckle have no
    seam to line up, and the app still sees a single `hull` node.
    """
    mesh = obj.data
    deck = weathered_steel("mat_deck", "#2b4c33", roughness=0.68, rust=0.55,
                           streak_scale=(6.0, 6.0, 6.0), grime="#4a3a26")
    hold = weathered_steel("mat_hold_interior", "#79817f", roughness=0.78, rust=0.42,
                           streak_scale=(4.0, 4.0, 0.6), grime="#4c4136",
                           wear="#7f868b")
    mesh.materials.append(deck)      # slot 1
    mesh.materials.append(hold)      # slot 2

    for poly in mesh.polygons:
        c = poly.center
        inside_cargo = CARGO_AFT <= c.x <= CARGO_FWD + 0.03
        if (inside_cargo and abs(c.y) <= W_HOLD + 0.02
                and Z_TANKTOP - 0.01 <= c.z <= deck_z_at(c.x) - 0.008):
            poly.material_index = 2
        elif poly.normal.z > 0.80 and c.z > DEPTH * 0.90:
            poly.material_index = 1
    return obj


# --------------------------------------------------------------------------
# Preview rendering (never exported)
# --------------------------------------------------------------------------

def setup_render(samples=64, res=(1400, 800), sea=True):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    try:
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for d in prefs.devices:
            d.use = d.type != "CPU"
        scene.cycles.device = "GPU"
    except Exception as exc:
        print(f"  GPU unavailable ({exc}); falling back to CPU")
        scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.render.resolution_x, scene.render.resolution_y = res
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.image_settings.compression = 90
    try:
        scene.view_settings.view_transform = "AgX"
        scene.view_settings.look = "AgX - Medium Contrast"
    except TypeError:
        pass

    world = bpy.data.worlds.new("sky")
    world.use_nodes = True
    nodes, links = world.node_tree.nodes, world.node_tree.links
    bg = nodes["Background"]
    try:
        sky = nodes.new("ShaderNodeTexSky")
        sky.sky_type = "NISHITA"
        sky.sun_elevation = math.radians(24)
        sky.sun_rotation = math.radians(150)
        sky.altitude = 20
        links.new(sky.outputs["Color"], bg.inputs["Color"])
    except (TypeError, RuntimeError):
        bg.inputs["Color"].default_value = hexcol("#9fb8cc")
    bg.inputs["Strength"].default_value = 1.15
    scene.world = world

    sun_data = bpy.data.lights.new("key", type="SUN")
    sun_data.energy = 3.4
    sun_data.angle = math.radians(2.5)
    sun = bpy.data.objects.new("key", sun_data)
    sun.rotation_euler = (math.radians(52), 0.0, math.radians(214))
    bpy.context.collection.objects.link(sun)

    # Broad soft fill from above, so an open hold is dark but not a black hole.
    fill_data = bpy.data.lights.new("fill", type="AREA")
    fill_data.energy = 1500
    fill_data.size = 14.0
    fill = bpy.data.objects.new("fill", fill_data)
    fill.location = Vector((1.0, -3.0, 7.5))
    d = Vector((0.0, 0.0, 0.5)) - fill.location
    fill.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    bpy.context.collection.objects.link(fill)

    if sea:
        bm = bmesh.new()
        # A plane with the hull cut out of it. A solid slab would fill every
        # open hold with seawater, which is exactly the view this model exists
        # to give.
        xs = station_positions()
        far = 26.0
        prev = None
        for x in xs:
            wl = waterline_half(x)
            cur = (bm.verts.new((x, wl, DRAFT)), bm.verts.new((x, far, DRAFT)),
                   bm.verts.new((x, -wl, DRAFT)), bm.verts.new((x, -far, DRAFT)))
            if prev:
                bm.faces.new((prev[0], cur[0], cur[1], prev[1]))
                bm.faces.new((prev[3], cur[3], cur[2], prev[2]))
            prev = cur
        for x0, x1 in ((-far, -5.0), (BOW_X, far)):
            v = [bm.verts.new((x, y, DRAFT)) for x, y in
                 ((x0, -far), (x1, -far), (x1, far), (x0, far))]
            bm.faces.new(v)
        water = bpy.data.materials.new("mat_sea")
        water.use_nodes = True
        n, l = water.node_tree.nodes, water.node_tree.links
        b = next(x for x in n if x.type == "BSDF_PRINCIPLED")
        b.inputs["Base Color"].default_value = hexcol("#123246")
        b.inputs["Roughness"].default_value = 0.09
        wave = n.new("ShaderNodeTexNoise")
        wave.inputs["Scale"].default_value = 60.0
        wave.inputs["Detail"].default_value = 8.0
        bump = n.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = 0.22
        bump.inputs["Distance"].default_value = 0.02
        l.new(wave.outputs["Fac"], bump.inputs["Height"])
        l.new(bump.outputs["Normal"], b.inputs["Normal"])
        new_object("preview_sea", bm, water)


def waterline_half(x):
    """Half breadth of the hull where it meets the summer waterline."""
    pts = hull_section(x)
    for (y0, z0), (y1, z1) in zip(pts, pts[1:]):
        if (z0 - DRAFT) * (z1 - DRAFT) <= 0 and abs(z1 - z0) > 1e-9:
            t = (DRAFT - z0) / (z1 - z0)
            return max(0.0, y0 + t * (y1 - y0))
    return pts[-1][0]


def add_camera(location, target, lens=68):
    data = bpy.data.cameras.new("cam")
    data.lens = lens
    cam = bpy.data.objects.new("cam", data)
    cam.location = Vector(location)
    d = Vector(target) - cam.location
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    return cam


def render_to(path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.context.scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    return path


# --------------------------------------------------------------------------
# Bulk carrier assembly
# --------------------------------------------------------------------------

def build_bulker_hull():
    hull = new_object("hull", build_hull_object(), hull_material("mat_hull"), smooth_angle=32)
    assign_hull_regions(hull)
    parts = [hull]
    house, _ = build_superstructure()
    parts += house
    parts += build_forecastle()
    parts += build_stern_gear()
    parts.append(build_railings(
        CARGO_AFT, CARGO_FWD,
        lambda x: deck_half_beam(x) - 0.02,
        lambda x: deck_z_at(x),
        "detail_rail_maindeck"))
    parts.append(build_railings(
        HOUSE_AFT + 0.32, HOUSE_FWD - 0.16,
        lambda x: 0.835, lambda x: deck_z_at(x) + 4 * TIER_H,
        "detail_rail_bridge", post_step=0.13, height=0.07))
    return parts


# --------------------------------------------------------------------------
# Compartment modules
#
# One module is exported and cloned by the app. `compartment` is authored with
# a hatch length of 1.0 and scaled in X to fit; `crossdeck` is never scaled, so
# the steel between hatches keeps its true width at any compartment count.
# --------------------------------------------------------------------------

SLOT_AFT = CARGO_AFT + CARGO_GAP
COAMING_H = 0.088
COVER_Z0, COVER_Z1 = 0.088, 0.121
HOLD_DEPTH = DEPTH - Z_TANKTOP


def compartment_slots(count):
    """Forward first. Returns (centre_x, length, crossdeck_x) per compartment."""
    span = CARGO_FWD - SLOT_AFT
    length = (span - count * CARGO_GAP) / count
    out = []
    for i in range(count):
        fwd_edge = CARGO_FWD - CARGO_GAP - i * (length + CARGO_GAP)
        out.append((fwd_edge - length / 2.0, length, fwd_edge + CARGO_GAP / 2.0))
    return out


def build_compartment_module(status_fill):
    """
    Coaming, hatch cover (closed and stowed), the runtime progress overlay and
    the cargo level. Authored around a hatch of length 1.0 centred on the
    origin, with local z = 0 at the weather deck.
    """
    objs = []
    hy_out = W_HATCH + 0.040
    hy_in = W_HATCH - 0.004

    bm = bmesh.new()
    outer = [(-0.5, -hy_out), (0.5, -hy_out), (0.5, hy_out), (-0.5, hy_out)]
    inner = [(-0.47, -hy_in), (0.47, -hy_in), (0.47, hy_in), (-0.47, hy_in)]
    lo_o = [bm.verts.new((x, y, -0.05)) for x, y in outer]
    hi_o = [bm.verts.new((x, y, COAMING_H)) for x, y in outer]
    hi_i = [bm.verts.new((x, y, COAMING_H)) for x, y in inner]
    lo_i = [bm.verts.new((x, y, -0.05)) for x, y in inner]
    for k in range(4):
        j = (k + 1) % 4
        bm.faces.new((lo_o[k], lo_o[j], hi_o[j], hi_o[k]))          # outside
        bm.faces.new((hi_o[k], hi_o[j], hi_i[j], hi_i[k]))          # top flange
        bm.faces.new((hi_i[k], hi_i[j], lo_i[j], lo_i[k]))          # inside
    objs.append(new_object("coaming", bm, status_material("mat_compartment")))

    # Cleats round the coaming: the detail that says "hatch" at a glance.
    bm = bmesh.new()
    for k in range(9):
        x = -0.44 + 0.11 * k
        for sign in (1, -1):
            cube(bm, x - 0.016, x + 0.016, sign * hy_out, sign * (hy_out + 0.016),
                 COAMING_H - 0.048, COAMING_H - 0.012)
    for k in range(5):
        y = -0.40 + 0.20 * k
        for sign in (1, -1):
            cube(bm, sign * 0.5, sign * 0.516, y - 0.016, y + 0.016,
                 COAMING_H - 0.048, COAMING_H - 0.012)
    objs.append(new_object("cleats", bm,
                           weathered_steel("mat_cleats", "#8b9096", 0.55, 0.45)))

    def cover(z0, z1):
        b = bmesh.new()
        cube(b, -0.492, 0.492, -(hy_out - 0.004), hy_out - 0.004, z0, z1)
        for k in range(9):                       # ribs run fore-and-aft, so
            y = -hy_out + 0.10 + 0.105 * k       # scaling in X never changes
            if abs(y) > hy_out - 0.06:           # their spacing
                continue
            cube(b, -0.478, 0.478, y - 0.012, y + 0.012, z1, z1 + 0.011)
        cube(b, -0.010, 0.010, -(hy_out - 0.01), hy_out - 0.01, z1, z1 + 0.008)
        return b

    objs.append(new_object("hatch_cover", cover(COVER_Z0, COVER_Z1),
                           status_material("mat_hatch_cover")))

    b = bmesh.new()
    for k in range(2):
        z0 = COVER_Z0 + k * 0.040
        cube(b, -0.50, -0.28, -(hy_out - 0.004), hy_out - 0.004, z0, z0 + 0.034)
    stowed = new_object("hatch_cover_stowed", b, status_material("mat_hatch_stowed"))
    stowed.hide_render = True
    objs.append(stowed)

    b = bmesh.new()
    cube(b, 0.0, 1.0, -(hy_out - 0.085), hy_out - 0.085, 0.0, 0.005)
    prog = new_object("compartment_progress", b,
                      base_material("mat_compartment_progress",
                                    STATUS_COLOURS["in-progress"]["edge"], 0.45))
    prog.location = (-0.492, 0.0, COVER_Z1 + 0.019)
    prog.scale = (0.0001, 1.0, 1.0)      # runtime sets this to the ratio
    objs.append(prog)

    b = bmesh.new()
    cube(b, -0.49, 0.49, -W_TANKTOP * 0.96, W_TANKTOP * 0.96, 0.0, HOLD_DEPTH)
    cargo = new_object("cargo_fill", b,
                       weathered_steel("mat_cargo", "#6b5c46", 0.92, 0.25,
                                       streak_scale=(7.0, 7.0, 7.0),
                                       grime="#4a3c2c", wear="#7d6d55"))
    cargo.location = (0.0, 0.0, Z_TANKTOP - DEPTH)
    cargo.scale = (1.0, 1.0, 0.0001)     # runtime sets this to the ratio
    cargo.hide_render = True
    objs.append(cargo)

    return objs


def build_crossdeck_module():
    """The steel between two hatches: deck plate plus the bulkhead under it."""
    bm = bmesh.new()
    g = CARGO_GAP / 2.0
    cube(bm, -g, g, -W_HATCH, W_HATCH, -0.014, 0.0)
    deck = new_object("plate", bm,
                      weathered_steel("mat_crossdeck", "#2b4c33", 0.68, 0.5,
                                      streak_scale=(6.0, 6.0, 6.0),
                                      grime="#4a3a26"))
    pts = [(W_HATCH, 0.0), (W_HOLD, Z_TOPSIDE - DEPTH), (W_HOLD, Z_HOPPER - DEPTH),
           (W_TANKTOP, Z_TANKTOP - DEPTH)]
    pts = [(-y, z) for y, z in reversed(pts)] + pts
    bm = bmesh.new()
    for sign in (-1, 1):
        verts = [bm.verts.new((sign * 0.012, y, z)) for y, z in pts]
        bm.faces.new(verts if sign > 0 else list(reversed(verts)))
    bulkhead = new_object("bulkhead", bm,
                          weathered_steel("mat_bulkhead", "#79817f", 0.78, 0.42,
                                          grime="#4c4136", wear="#6a716f"))
    return [deck, bulkhead]


def module_prototypes():
    """Build the two prototypes the app clones, parented to an empty root."""
    root = bpy.data.objects.new("compartment", None)
    root.empty_display_size = 0.2
    bpy.context.collection.objects.link(root)
    for part in build_compartment_module(STATUS_COLOURS["not-started"]["fill"]):
        part.parent = root
        part.name = f"compartment__{part.name}"

    xroot = bpy.data.objects.new("crossdeck", None)
    xroot.empty_display_size = 0.15
    bpy.context.collection.objects.link(xroot)
    for part in build_crossdeck_module():
        part.parent = xroot
        part.name = f"crossdeck__{part.name.replace('crossdeck_bulkhead', 'bulkhead').replace('crossdeck', 'plate')}"
    return root, xroot


def clone_tree(root, name, location, scale=(1.0, 1.0, 1.0)):
    copies = {}
    new_root = root.copy()
    new_root.name = name
    new_root.location = location
    new_root.scale = scale
    bpy.context.collection.objects.link(new_root)
    for child in root.children:
        c = child.copy()
        c.name = f"{name}__{child.name.split('__', 1)[-1]}"
        c.parent = new_root
        c.matrix_parent_inverse = child.matrix_parent_inverse.copy()
        bpy.context.collection.objects.link(c)
        copies[child.name.split("__", 1)[-1]] = c
    return new_root, copies


def build_demo_ship(count=7, statuses=None):
    parts = build_bulker_hull()
    proto, xproto = module_prototypes()
    proto.hide_render = True
    xproto.hide_render = True
    for c in list(proto.children) + list(xproto.children):
        c.hide_render = True

    made = []
    for i, (cx, length, xdeck) in enumerate(compartment_slots(count), start=1):
        name = f"hold_{i:02d}"
        root, kids = clone_tree(proto, name, (cx, 0.0, deck_z_at(cx)), (length, 1.0, 1.0))
        state = (statuses or {}).get(i, "not-started")
        fill = STATUS_COLOURS[state]["fill"]
        for key in ("coaming", "hatch_cover", "hatch_cover_stowed"):
            if key in kids:
                kids[key].data = kids[key].data.copy()
                kids[key].data.materials[0] = tint_status(
                    kids[key].data.materials[0].copy(), fill)
        for key in ("hatch_cover", "hatch_cover_stowed", "cargo_fill"):
            if key in kids:
                kids[key].hide_render = not (
                    (key == "hatch_cover" and state != "in-progress")
                    or (key in ("hatch_cover_stowed", "cargo_fill") and state == "in-progress"))
        if "compartment_progress" in kids:
            ratio = {"not-started": 0.0, "in-progress": 0.55, "complete": 1.0}[state]
            po = kids["compartment_progress"]
            po.scale = (max(ratio, 1e-4), 1.0, 1.0)
            po.hide_render = ratio <= 0.0
            po.data = po.data.copy()
            po.data.materials[0] = tint_status(po.data.materials[0].copy(),
                                               STATUS_COLOURS[state]["edge"])
        if "cargo_fill" in kids:
            kids["cargo_fill"].scale = (1.0, 1.0, 0.62 if state == "in-progress" else 1.0)
        made.append(root)
        clone_tree(xproto, f"crossdeck_{i:02d}", (xdeck, 0.0, deck_z_at(xdeck)))
    return parts, made


def tint_status(mat, fill):
    """Recolour the way the runtime will: the paint colour changes, the grime
    baked over it does not."""
    done = False
    for node in mat.node_tree.nodes:
        if node.type == "MIX" and not node.inputs[6].is_linked:
            node.inputs[6].default_value = hexcol(fill)
            done = True
            break
    if not done:
        bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
        if not bsdf.inputs["Base Color"].is_linked:
            bsdf.inputs["Base Color"].default_value = hexcol(fill)
    mat.diffuse_color = hexcol(fill)
    return mat




# --------------------------------------------------------------------------
# Texture baking
#
# glTF cannot carry a procedural node graph. Everything above is authored as
# nodes and baked here into flat image maps, which is the only way the paint,
# grime and streaking survive into a browser.
# --------------------------------------------------------------------------

def _activate(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def unwrap(obj, margin=0.004):
    _activate(obj)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=margin)
    bpy.ops.object.mode_set(mode="OBJECT")


def _bake_pass(obj, image, bake_type, samples):
    scene = bpy.context.scene
    scene.cycles.samples = samples
    nodes_added = []
    for mat in obj.data.materials:
        if mat is None:
            continue
        node = mat.node_tree.nodes.new("ShaderNodeTexImage")
        node.image = image
        node.select = True
        mat.node_tree.nodes.active = node
        nodes_added.append((mat, node))
    scene.render.bake.margin = 12
    if bake_type == "DIFFUSE":
        scene.render.bake.use_pass_direct = False
        scene.render.bake.use_pass_indirect = False
        scene.render.bake.use_pass_color = True
    _activate(obj)
    bpy.ops.object.bake(type=bake_type)
    for mat, node in nodes_added:
        mat.node_tree.nodes.remove(node)


def bake_object(obj, size=2048, samples=32, ao=True):
    """
    Albedo (with ambient occlusion multiplied in) plus a packed ORM map.

    The ORM is composed here rather than left to the exporter. Handed a plain
    roughness image the glTF exporter tries to synthesise an occlusion /
    roughness / metallic texture and writes a blank one, which lands in the
    browser as a mirror-finish ship. Packing it ourselves — occlusion in R,
    roughness in G, metallic in B — hits the exporter's pass-through path.
    """
    if not obj.data.polygons:
        return None
    import numpy as np

    unwrap(obj)
    albedo = bpy.data.images.new(f"{obj.name}_albedo", size, size)
    rough = bpy.data.images.new(f"{obj.name}_rough", size, size, is_data=True)
    _bake_pass(obj, albedo, "DIFFUSE", samples)
    _bake_pass(obj, rough, "ROUGHNESS", max(8, samples // 3))

    n = size * size * 4
    r_buf = np.empty(n, dtype=np.float32)
    rough.pixels.foreach_get(r_buf)

    o_buf = None
    if ao:
        occ = bpy.data.images.new(f"{obj.name}_ao", size, size, is_data=True)
        _bake_pass(obj, occ, "AO", samples)
        o_buf = np.empty(n, dtype=np.float32)
        occ.pixels.foreach_get(o_buf)
        a_buf = np.empty(n, dtype=np.float32)
        albedo.pixels.foreach_get(a_buf)
        k = 0.40 + 0.60 * o_buf            # gentle; full AO just reads dirty
        k[3::4] = 1.0
        albedo.pixels.foreach_set(np.clip(a_buf * k, 0.0, 1.0))
        bpy.data.images.remove(occ)

    orm = bpy.data.images.new(f"{obj.name}_orm", size, size, is_data=True)
    packed = np.empty(n, dtype=np.float32)
    packed[0::4] = o_buf[0::4] if o_buf is not None else 1.0   # occlusion
    packed[1::4] = r_buf[1::4]                                  # roughness
    packed[2::4] = 0.0                                          # metallic
    packed[3::4] = 1.0
    orm.pixels.foreach_set(packed)
    bpy.data.images.remove(rough)

    baked = bpy.data.materials.new(f"mat_{obj.name}_baked")
    baked.use_nodes = True
    nodes, links = baked.node_tree.nodes, baked.node_tree.links
    bsdf = next(x for x in nodes if x.type == "BSDF_PRINCIPLED")
    tex_a = nodes.new("ShaderNodeTexImage")
    tex_a.image = albedo
    tex_a.location = (-600, 220)
    links.new(tex_a.outputs["Color"], bsdf.inputs["Base Color"])

    tex_o = nodes.new("ShaderNodeTexImage")
    tex_o.image = orm
    tex_o.location = (-700, -180)
    sep = nodes.new("ShaderNodeSeparateColor")
    sep.location = (-420, -180)
    links.new(tex_o.outputs["Color"], sep.inputs["Color"])
    links.new(sep.outputs["Green"], bsdf.inputs["Roughness"])
    links.new(sep.outputs["Blue"], bsdf.inputs["Metallic"])

    obj.data.materials.clear()
    obj.data.materials.append(baked)
    for poly in obj.data.polygons:
        poly.material_index = 0
    return baked


# --------------------------------------------------------------------------
# Export
# --------------------------------------------------------------------------

def export_glb(objs, path, quality=88):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
        o.hide_render = False
    bpy.context.view_layer.objects.active = objs[0]
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(path), export_format="GLB", use_selection=True,
        export_apply=True, export_yup=True, export_cameras=False,
        export_lights=False, export_animations=False, export_extras=False,
        export_normals=True, export_texcoords=True, export_materials="EXPORT",
        export_image_format="JPEG", export_jpeg_quality=quality,
    )
    return path.stat().st_size


# --------------------------------------------------------------------------
# Product tanker
# --------------------------------------------------------------------------

TANK_Y = 0.45              # centre of a port tank; starboard is -TANK_Y
TANK_HALF_W = 0.325
CATWALK_HALF_W = 0.075
CATWALK_Z = 0.30           # above the weather deck


def build_tanker_deck():
    """Centreline catwalk, midship manifold and the cargo lines. This is what
    tells a tanker apart from a bulker at a glance: a flush deck with a raised
    walkway down the middle and pipework, instead of hatch covers."""
    parts = []

    bm = bmesh.new()
    x0, x1 = HOUSE_FWD, FORECASTLE_X
    steps = 46
    prev = None
    for i in range(steps + 1):
        x = lerp(x0, x1, i / steps)
        z = deck_z_at(x) + CATWALK_Z
        cur = (bm.verts.new((x, CATWALK_HALF_W, z)),
               bm.verts.new((x, -CATWALK_HALF_W, z)),
               bm.verts.new((x, -CATWALK_HALF_W, z - 0.022)),
               bm.verts.new((x, CATWALK_HALF_W, z - 0.022)))
        if prev:
            for a in range(4):
                b = (a + 1) % 4
                bm.faces.new((prev[a], prev[b], cur[b], cur[a]))
        prev = cur
    for i in range(15):                                   # support stools
        x = lerp(x0 + 0.15, x1 - 0.15, i / 14)
        z = deck_z_at(x)
        cube(bm, x - 0.014, x + 0.014, -0.05, 0.05, z, z + CATWALK_Z - 0.022)
    parts.append(new_object("detail_catwalk", bm,
                            weathered_steel("mat_catwalk", "#8d949a", 0.6, 0.45)))
    parts.append(build_railings(
        x0 + 0.05, x1 - 0.05, lambda x: CATWALK_HALF_W,
        lambda x: deck_z_at(x) + CATWALK_Z, "detail_rail_catwalk",
        post_step=0.20, height=0.075))

    bm = bmesh.new()
    for sign in (1, -1):                                  # cargo and stripping lines
        for x0_, x1_ in ((HOUSE_FWD + 0.05, FORECASTLE_X - 0.05),):
            cylinder_x(bm, x0_, x1_, sign * 0.165, deck_z_at(0.0) + 0.055, 0.030, seg=10)
        cylinder_x(bm, HOUSE_FWD + 0.05, FORECASTLE_X - 0.05,
                   sign * 0.235, deck_z_at(0.0) + 0.048, 0.019, seg=8)
    parts.append(new_object("detail_deck_lines", bm,
                            weathered_steel("mat_deck_lines", "#b6942f", 0.55, 0.5)))

    bm = bmesh.new()                                      # midship manifold
    z = deck_z_at(0.0)
    for sign in (1, -1):
        cylinder_x(bm, -0.04, 0.04, sign * 0.30, z + 0.14, 0.030, seg=10)
        for k in range(4):
            y = sign * (0.40 + 0.11 * k)
            cylinder(bm, 0.0, y, 0.028, z + 0.055, z + 0.30, seg=10)
            cube(bm, -0.055, 0.055, y - 0.055, y + 0.055, z + 0.30, z + 0.325)
        cube(bm, -0.30, 0.30, sign * 0.34, sign * 0.80, z, z + 0.018)   # drip tray
    parts.append(new_object("detail_manifold", bm,
                            weathered_steel("mat_manifold", "#8d949a", 0.5, 0.45)))
    return parts


def build_tanker_hull():
    hull = new_object("hull", build_hull_object(open_trough=False),
                      hull_material("mat_hull"), smooth_angle=32)
    for poly in hull.data.polygons:
        pass
    # Slate, not the bulker's green: a tanker's status colour sits directly on
    # the deck with no raised coaming to separate it, and green-on-green is
    # unreadable at a glance.
    deck = weathered_steel("mat_deck", "#39424a", roughness=0.68, rust=0.45,
                           streak_scale=(6.0, 6.0, 6.0), grime="#4a3a26")
    hull.data.materials.append(deck)
    for poly in hull.data.polygons:
        if poly.normal.z > 0.80 and poly.center.z > DEPTH * 0.90:
            poly.material_index = 1
    parts = [hull]
    house, _ = build_superstructure()
    parts += house
    parts += build_forecastle()
    parts += build_stern_gear()
    parts += build_tanker_deck()
    parts.append(build_railings(
        CARGO_AFT, CARGO_FWD, lambda x: deck_half_beam(x) - 0.02,
        lambda x: deck_z_at(x), "detail_rail_maindeck"))
    parts.append(build_railings(
        HOUSE_AFT + 0.32, HOUSE_FWD - 0.16, lambda x: 0.835,
        lambda x: deck_z_at(x) + 4 * TIER_H, "detail_rail_bridge",
        post_step=0.13, height=0.07))
    return parts


def build_tank_module():
    """
    One cargo tank as seen from the deck: the painted tank outline the app
    recolours, a tank hatch, a P/V riser and Butterworth plates. Authored at
    unit length, centred on its own tank.
    """
    objs = []
    hw = TANK_HALF_W

    bm = bmesh.new()                                   # painted tank panel
    cube(bm, -0.5, 0.5, -hw, hw, 0.0, 0.005)
    objs.append(new_object("coaming", bm, status_material("mat_compartment")))

    bm = bmesh.new()                                   # tank hatch and coaming
    cylinder(bm, 0.0, 0.0, 0.075, 0.005, 0.055, seg=16)
    cylinder(bm, 0.0, 0.0, 0.082, 0.055, 0.070, seg=16)
    cylinder(bm, 0.24, 0.0, 0.020, 0.005, 0.30, seg=10)        # P/V riser
    cylinder(bm, 0.24, 0.0, 0.042, 0.30, 0.345, seg=10)
    for k in range(3):                                          # Butterworth plates
        cube(bm, -0.34 + 0.10 * k, -0.30 + 0.10 * k, -0.035, 0.035, 0.005, 0.014)
    objs.append(new_object("tank_fittings", bm,
                           weathered_steel("mat_tank_fittings", "#9aa0a6", 0.55, 0.45)))

    bm = bmesh.new()
    cube(bm, 0.0, 1.0, -(hw - 0.055), hw - 0.055, 0.0, 0.005)
    prog = new_object("compartment_progress", bm,
                      base_material("mat_compartment_progress",
                                    STATUS_COLOURS["in-progress"]["edge"], 0.45))
    prog.location = (-0.5, 0.0, 0.011)
    prog.scale = (0.0001, 1.0, 1.0)      # runtime sets this to the ratio
    objs.append(prog)

    bm = bmesh.new()                                   # only seen in a cutaway
    cube(bm, -0.49, 0.49, -hw * 0.95, hw * 0.95, 0.0, DEPTH - Z_TANKTOP)
    cargo = new_object("cargo_fill", bm,
                       base_material("mat_cargo", "#2f4f63", 0.18))
    cargo.location = (0.0, 0.0, Z_TANKTOP - DEPTH)
    cargo.scale = (1.0, 1.0, 0.0001)     # runtime sets this to the ratio
    cargo.hide_render = True
    objs.append(cargo)

    return objs


def build_tank_crossdeck():
    bm = bmesh.new()
    g = CARGO_GAP / 2.0
    cube(bm, -g, g, -TANK_HALF_W, TANK_HALF_W, 0.0, 0.004)
    return [new_object("plate", bm,
                       weathered_steel("mat_crossdeck", "#2e363d", 0.7, 0.45,
                                       streak_scale=(6.0, 6.0, 6.0),
                                       grime="#4a3a26"))]


# --------------------------------------------------------------------------
# Layout manifest — where the app puts each cloned module
# --------------------------------------------------------------------------

def layout_manifest(counts=range(4, 11)):
    data = {
        "version": 2,
        "note": "Positions are Blender-authored (Z up, +X bow). glTF is Y up, "
                "so in three.js use position (x, z, -y) and scale (sx, sz, sy).",
        "hull": {"loa": round(BOW_X + 5.0, 3), "beam": BEAM, "depth": DEPTH,
                 "draft": DRAFT, "deckZMidships": round(deck_z_at(0.0), 4)},
        "status": STATUS_COLOURS,
        "labelOffsetZ": 0.42,
        "types": {},
    }
    for kind, hull_file, module_file in (
        ("hold", "hull-bulker.glb", "module-hold.glb"),
        ("tank", "hull-tanker.glb", "module-tank.glb"),
    ):
        entry = {"hull": hull_file, "module": module_file,
                 "maxCompartments": 10, "counts": {}}
        for count in counts:
            if kind == "hold":
                slots = compartment_slots(count)
                comps, crosses = [], []
                for i, (cx, length, xdeck) in enumerate(slots, start=1):
                    comps.append({"name": f"hold_{i:02d}", "position": i,
                                  "x": round(cx, 4), "y": 0.0,
                                  "z": round(deck_z_at(cx), 4),
                                  "scaleX": round(length, 4),
                                  "cargoBaseZ": round(Z_TANKTOP, 4),
                                  "cargoHeight": round(DEPTH - Z_TANKTOP, 4)})
                    crosses.append({"x": round(xdeck, 4),
                                    "z": round(deck_z_at(xdeck), 4)})
                entry["counts"][str(count)] = {"compartments": comps,
                                               "crossdecks": crosses}
            else:
                pairs = math.ceil(count / 2)
                slots = compartment_slots(pairs)
                comps, crosses = [], []
                placed = 0
                for pair_no, (cx, length, xdeck) in enumerate(slots, start=1):
                    for side, sign in (("p", 1.0), ("s", -1.0)):
                        if placed >= count:
                            break
                        comps.append({"name": f"tank_{pair_no:02d}{side}",
                                      "position": pair_no, "side": side,
                                      "x": round(cx, 4),
                                      "y": round(sign * TANK_Y, 4),
                                      "z": round(deck_z_at(cx), 4),
                                      "scaleX": round(length, 4),
                                      "cargoBaseZ": round(Z_TANKTOP, 4),
                                      "cargoHeight": round(DEPTH - Z_TANKTOP, 4)})
                        placed += 1
                    for sign in (1.0, -1.0):
                        crosses.append({"x": round(xdeck, 4),
                                        "y": round(sign * TANK_Y, 4),
                                        "z": round(deck_z_at(xdeck), 4)})
                entry["counts"][str(count)] = {"compartments": comps,
                                               "crossdecks": crosses}
        data["types"][kind] = entry
    return data


# --------------------------------------------------------------------------
# Build modes
# --------------------------------------------------------------------------

def module_prototypes_for(kind):
    root = bpy.data.objects.new("compartment", None)
    root.empty_display_size = 0.2
    bpy.context.collection.objects.link(root)
    builder = build_compartment_module if kind == "hold" else (
        lambda _fill: build_tank_module())
    for part in builder(STATUS_COLOURS["not-started"]["fill"]):
        part.parent = root
        part.name = f"compartment__{part.name}"
    xroot = bpy.data.objects.new("crossdeck", None)
    xroot.empty_display_size = 0.15
    bpy.context.collection.objects.link(xroot)
    for part in (build_crossdeck_module() if kind == "hold" else build_tank_crossdeck()):
        part.parent = xroot
        part.name = f"crossdeck__{part.name}"
    return root, xroot


def export_hull(kind, out, texture=2048, samples=28):
    reset_scene()
    setup_render(samples=samples, res=(64, 64), sea=False)
    parts = build_bulker_hull() if kind == "hold" else build_tanker_hull()
    structural = [o for o in parts if o.name != "superstructure"
                  and not o.name.startswith("detail_win")]
    house = [o for o in parts if o not in structural]
    hull = join_objects("hull", structural)
    top = join_objects("superstructure", house)
    bake_object(hull, texture, samples)
    bake_object(top, max(1024, texture // 2), samples)
    name = "hull-bulker.glb" if kind == "hold" else "hull-tanker.glb"
    size = export_glb([hull, top], out / "public/models" / name)
    tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in (hull, top))
    return name, size, tris


def export_module(kind, out, texture=1024, samples=24):
    reset_scene()
    setup_render(samples=samples, res=(64, 64), sea=False)
    root, xroot = module_prototypes_for(kind)
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    for obj in meshes:
        obj.hide_render = False
        bake_object(obj, texture, samples, ao=False)
    name = f"module-{kind}.glb"
    size = export_glb([root, xroot] + meshes, out / "public/models" / name)
    tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in meshes)
    return name, size, tris


def render_previews(kind, out, samples=48):
    reset_scene()
    statuses = {1: "complete", 2: "complete", 3: "in-progress"}
    if kind == "hold":
        parts = build_bulker_hull()
    else:
        parts = build_tanker_hull()
    proto, xproto = module_prototypes_for(kind)
    for o in [proto, xproto] + list(proto.children) + list(xproto.children):
        o.hide_render = True

    count = 7
    slots = compartment_slots(count if kind == "hold" else math.ceil(count / 2))
    placements = []
    if kind == "hold":
        for i, (cx, length, xdeck) in enumerate(slots, start=1):
            placements.append((f"hold_{i:02d}", cx, 0.0, length, xdeck, i))
    else:
        n = 0
        for pair, (cx, length, xdeck) in enumerate(slots, start=1):
            for side, sign in (("p", 1.0), ("s", -1.0)):
                if n >= count:
                    break
                placements.append((f"tank_{pair:02d}{side}", cx, sign * TANK_Y,
                                   length, xdeck, pair))
                n += 1

    for name, cx, cy, length, xdeck, idx in placements:
        state = statuses.get(idx, "not-started")
        fill = STATUS_COLOURS[state]["fill"]
        _, kids = clone_tree(proto, name, (cx, cy, deck_z_at(cx)), (length, 1.0, 1.0))
        for key in ("coaming", "hatch_cover", "hatch_cover_stowed"):
            if key in kids:
                kids[key].data = kids[key].data.copy()
                kids[key].data.materials[0] = tint_status(
                    kids[key].data.materials[0].copy(), fill)
        for key in ("hatch_cover", "hatch_cover_stowed", "cargo_fill"):
            if key in kids:
                open_hold = state == "in-progress" and kind == "hold"
                kids[key].hide_render = not (
                    (key == "hatch_cover" and not open_hold)
                    or (key in ("hatch_cover_stowed", "cargo_fill") and open_hold))
        if "compartment_progress" in kids:
            ratio = {"not-started": 0.0, "in-progress": 0.55, "complete": 1.0}[state]
            po = kids["compartment_progress"]
            po.scale = (max(ratio, 1e-4), 1.0, 1.0)
            po.hide_render = ratio <= 0.0
            po.data = po.data.copy()
            po.data.materials[0] = tint_status(po.data.materials[0].copy(),
                                               STATUS_COLOURS[state]["edge"])
        if "cargo_fill" in kids:
            kids["cargo_fill"].scale = (1.0, 1.0, 0.62)
    for _, _, _, _, xdeck, _ in placements:
        clone_tree(xproto, f"xd_{xdeck:.3f}", (xdeck, 0.0, deck_z_at(xdeck)))

    setup_render(samples=samples, res=(1600, 900))
    tag = "bulker" if kind == "hold" else "tanker"
    add_camera((11.6, -10.2, 4.3), (0.1, 0.0, 0.72), lens=55)
    render_to(out / f"scripts/previews_hd/{tag}-3q.png")
    add_camera((4.2, -3.4, 3.0), (0.6, 0.0, 0.60), lens=42)
    render_to(out / f"scripts/previews_hd/{tag}-detail.png")
    add_camera((0.0, -17.5, 1.55), (0.0, 0.0, 0.86), lens=55)
    render_to(out / f"scripts/previews_hd/{tag}-profile.png")


def main():
    out = Path(os.environ.get("VESSEL_OUT",
                              "/Users/ritesh5001/Office/CleanShip/frontend"))
    mode = os.environ.get("VESSEL_MODE", "all")
    tex = int(os.environ.get("VESSEL_TEX", "2048"))
    kinds = os.environ.get("VESSEL_KINDS", "hold,tank").split(",")

    if mode in ("all", "export"):
        rows = []
        for kind in kinds:
            rows.append(export_hull(kind, out, texture=tex))
            print(f"  {rows[-1]}", flush=True)
            rows.append(export_module(kind, out, texture=max(512, tex // 4)))
            print(f"  {rows[-1]}", flush=True)
        path = out / "public/models/vessel-layout.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(layout_manifest(), indent=2))
        print(f"  layout {path} {path.stat().st_size} bytes", flush=True)
        print("EXPORT SUMMARY " + json.dumps(rows), flush=True)

    if mode in ("all", "preview"):
        for kind in kinds:
            render_previews(kind, out)
            print(f"  previews {kind} done", flush=True)

    print("BUILD DONE", flush=True)


if __name__ == "__main__":
    main()
