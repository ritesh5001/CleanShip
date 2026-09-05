#!/usr/bin/env python3
"""
Parametric low-poly vessel models for the CleanTrack 3D compartment diagram.

WHAT THIS BUILDS

One .glb per (vessel type, compartment count) — holds 4..10 and tanks 4..10,
fourteen files — in which every cargo compartment is its own mesh object with
its own single-slot material, named to a fixed contract so the web app can look
a compartment up by name and set `material.color` at runtime:

    hold_01 .. hold_10                      material mat_hold_01 ..
    tank_01p, tank_01s, tank_02p, ...       material mat_tank_01p ..
    hull, superstructure                    brand navy
    detail_*                                deck furniture, safe to ignore

This is a schematic, not a ship portrait. It is read small, on a phone, on a
windy deck. Everything here trades realism for "which box is that, and is it
done" answered in one glance.

ORIENTATION (the part that is easy to get backwards)

    +X is the BOW.  -X is the stern.  +Y is port.  -Y is starboard.  +Z is up.

    Compartment No. 1 is the FORWARDMOST one and numbering increases aft,
    which is the maritime convention and the opposite of the 2D SVG diagram
    this replaces. The build asserts it rather than trusting the loop.

Authored Z-up; the glTF exporter does the Y-up conversion on the way out.
Hull length is a fixed 10 units whatever the compartment count, so every
variant frames identically in one camera.

RUNNING

    blender --background --python scripts/generate_vessels.py
    blender --background --python scripts/generate_vessels.py -- --counts 6 7

or, with no Blender install, using Blender as a Python module:

    pip install bpy==4.2.0        # needs CPython 3.11
    python scripts/generate_vessels.py

Both paths write the same files. See scripts/README-vessels.md.
"""

from __future__ import annotations

import argparse
import math
import sys
import time
from pathlib import Path

import bpy  # type: ignore
import bmesh  # type: ignore
from mathutils import Vector  # type: ignore


# --------------------------------------------------------------------------
# Contract: counts, colours, names
# --------------------------------------------------------------------------

MIN_COUNT = 4
MAX_COUNT = 10  # hard ceiling; above this the app falls back to the 2D diagram

BRAND_NAVY = "#0a2e52"

# Compartment status colours, copied from frontend/src/lib/cleantrack/types.ts
# (STATE_STYLE). Models export in the "not started" fill; the runtime overwrites
# base colour per compartment. `edge` is what the app should use for outline /
# selection strokes — the mesh carries one material slot, deliberately, so a
# colour swap can never half-apply.
STATUS_COLOURS = {
    "not-started": {"fill": "#e8edf2", "edge": "#b9c5cf"},
    "in-progress": {"fill": "#fdefd0", "edge": "#c9880d"},
    "complete": {"fill": "#d9f2e4", "edge": "#1e9e63"},
    "not-applicable": {"fill": "#7f7f7f", "edge": "#5f5f5f"},
}
DEFAULT_STATE = "not-started"


# --------------------------------------------------------------------------
# Hull dimensions
# --------------------------------------------------------------------------

LENGTH = 10.0          # stern (-5) to bow tip (+5), fixed for every variant
BEAM = 3.0
DEPTH = 1.15           # keel at z=0, weather deck at z=DEPTH
DECK_Z = DEPTH

# Cargo zone: forward limit clears the bow taper and the forecastle, aft limit
# clears the accommodation block.
FORECASTLE_X = 2.72
CARGO_FWD = 2.60
CARGO_AFT = -3.60
CARGO_GAP = 0.09       # gap between adjacent compartments, in X

HOLD_WIDTH = BEAM * 0.70            # holds run the full breadth
TANK_CENTRE_GAP = 0.14              # centreline bulkhead between p and s
TANK_WIDTH = (BEAM * 0.70 - TANK_CENTRE_GAP) / 2.0   # same block width as holds

RIM_W = 0.055          # coaming width — the visible rim around each hatch
RIM_H = 0.060          # rim height above the deck
PANEL_Z = 0.012        # hatch panel, sunk inside the rim and flush with the deck
SKIRT = 0.35           # how far the compartment shell is buried in the hull

SUPER_AFT = -4.55
SUPER_FWD = -3.45


# --------------------------------------------------------------------------
# Colour
# --------------------------------------------------------------------------

def _srgb_to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_to_linear_rgba(value: str, alpha: float = 1.0):
    """glTF stores base colour linear; the palette is written in sRGB hex."""
    h = value.lstrip("#")
    rgb = [int(h[i : i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return (*(_srgb_to_linear(c) for c in rgb), alpha)


# --------------------------------------------------------------------------
# Hull plan geometry
# --------------------------------------------------------------------------

def hull_outline(t: float):
    """
    Plan outline at height factor t (0 = keel, 1 = deck), CCW seen from +Z.

    The hull is two of these bridged: narrower and shorter at the keel, which
    gives a raked stem and a hint of rise-of-floor without a single curve
    modifier or a bulbous bow.
    """
    half = BEAM / 2.0 * (0.80 + 0.20 * t)
    stern_half = half * 0.94
    bow_tip = 4.70 + 0.30 * t
    aft = -LENGTH / 2.0
    return [
        (aft, -stern_half),
        (aft + 0.55, -half),
        (2.30, -half),
        (3.25, -half * 0.72),
        (3.95, -half * 0.34),
        (bow_tip, 0.0),
        (3.95, half * 0.34),
        (3.25, half * 0.72),
        (2.30, half),
        (aft + 0.55, half),
        (aft, stern_half),
    ]


def deck_half_beam(x: float) -> float:
    """Half breadth of the weather deck at station x — used to sanity-check
    that no compartment is wider than the ship it sits in."""
    pts = [(px, py) for px, py in hull_outline(1.0) if py >= 0.0]
    pts.sort(key=lambda p: p[0])
    if x <= pts[0][0]:
        return pts[0][1]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x <= x1:
            f = (x - x0) / (x1 - x0)
            return y0 + f * (y1 - y0)
    return pts[-1][1]


def clip_x_ge(pts, x0: float):
    """Sutherland-Hodgman clip of a closed polygon to the half-plane x >= x0."""
    out = []
    n = len(pts)
    for i in range(n):
        cur, nxt = pts[i], pts[(i + 1) % n]
        cur_in, nxt_in = cur[0] >= x0, nxt[0] >= x0
        if cur_in:
            out.append(cur)
        if cur_in != nxt_in:
            f = (x0 - cur[0]) / (nxt[0] - cur[0])
            out.append((x0, cur[1] + f * (nxt[1] - cur[1])))
    return out


def rounded_rect(length: float, width: float, radius: float, seg: int = 3):
    """CCW rounded rectangle centred on the origin. Fixed vertex count, so an
    inset copy pairs up 1:1 for the rim ring."""
    hx, hy = length / 2.0, width / 2.0
    r = max(0.012, min(radius, hx * 0.45, hy * 0.45))
    corners = [
        (hx - r, -hy + r, -90.0),
        (hx - r, hy - r, 0.0),
        (-hx + r, hy - r, 90.0),
        (-hx + r, -hy + r, 180.0),
    ]
    pts = []
    for ox, oy, a0 in corners:
        for k in range(seg + 1):
            a = math.radians(a0 + 90.0 * k / seg)
            pts.append((ox + r * math.cos(a), oy + r * math.sin(a)))
    return pts


# --------------------------------------------------------------------------
# bmesh builders
# --------------------------------------------------------------------------

def _bridge(bm, lower, upper):
    n = len(lower)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((lower[i], lower[j], upper[j], upper[i]))


def extrude_polygon(bm, pts, z0: float, z1: float):
    """Solid prism from a CCW plan polygon. Caps both ends."""
    lower = [bm.verts.new((x, y, z0)) for x, y in pts]
    upper = [bm.verts.new((x, y, z1)) for x, y in pts]
    _bridge(bm, lower, upper)
    bm.faces.new(list(reversed(lower)))
    bm.faces.new(upper)
    return bm


def box(bm, x0, x1, y0, y1, z0, z1):
    return extrude_polygon(bm, [(x0, y0), (x1, y0), (x1, y1), (x0, y1)], z0, z1)


def build_hull_bmesh():
    bm = bmesh.new()
    lower = [bm.verts.new((x, y, 0.0)) for x, y in hull_outline(0.0)]
    upper = [bm.verts.new((x, y, DECK_Z)) for x, y in hull_outline(1.0)]
    _bridge(bm, lower, upper)
    bm.faces.new(list(reversed(lower)))   # keel
    bm.faces.new(upper)                   # weather deck
    return bm


def build_compartment_bmesh(length: float, width: float):
    """
    One hatch: a shell buried in the deck, a raised coaming rim, and the panel
    sunk inside that rim, level with the deck. The rim is what keeps ten
    identical grey boxes from reading as one grey stripe at phone size.

    The panel sits at deck level rather than below it on purpose. A true recess
    puts the status colour — the whole point of the model — into its own
    shadow, and the colour has to survive being looked at on a phone in
    daylight. Sunk inside a raised rim reads as recessed and stays lit.

    Built in local coordinates around (0, 0, 0) = the hatch centre at deck
    level, so the object's own origin is meaningful to the runtime.
    """
    radius = max(0.035, min(0.11, length * 0.22, width * 0.22))
    outer = rounded_rect(length, width, radius)
    inner = rounded_rect(length - 2 * RIM_W, width - 2 * RIM_W, radius - RIM_W)

    bm = bmesh.new()
    o_lo = [bm.verts.new((x, y, -SKIRT)) for x, y in outer]
    o_hi = [bm.verts.new((x, y, RIM_H)) for x, y in outer]
    i_hi = [bm.verts.new((x, y, RIM_H)) for x, y in inner]
    i_lo = [bm.verts.new((x, y, PANEL_Z)) for x, y in inner]

    _bridge(bm, o_lo, o_hi)               # outer shell
    n = len(outer)
    for k in range(n):                    # flat rim
        j = (k + 1) % n
        bm.faces.new((o_hi[k], o_hi[j], i_hi[j], i_hi[k]))
    for k in range(n):                    # recess wall
        j = (k + 1) % n
        bm.faces.new((i_hi[k], i_hi[j], i_lo[j], i_lo[k]))
    bm.faces.new(i_lo)                    # panel floor
    return bm


def build_bulwark_bmesh():
    """A low rail following the deck edge — pure silhouette, no detail."""
    bm = bmesh.new()
    verts = [bm.verts.new((x, y, DECK_Z)) for x, y in hull_outline(1.0)]
    face = bm.faces.new(verts)
    res = bmesh.ops.inset_individual(bm, faces=[face], thickness=0.07, depth=0.0)
    bmesh.ops.delete(bm, geom=[face], context="FACES_ONLY")
    ext = bmesh.ops.extrude_face_region(bm, geom=res["faces"])
    moved = [g for g in ext["geom"] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0.0, 0.0, 0.10), verts=moved)
    return bm


def build_superstructure_bmesh():
    """Accommodation block plus wheelhouse, one object. Tall enough that which
    end is aft is obvious in a thumbnail."""
    bm = bmesh.new()
    box(bm, SUPER_AFT, SUPER_FWD, -1.05, 1.05, DECK_Z, DECK_Z + 0.85)
    box(bm, -4.05, -3.60, -1.20, 1.20, DECK_Z + 0.85, DECK_Z + 1.18)
    return bm


def build_funnel_bmesh():
    bm = bmesh.new()
    box(bm, -4.45, -4.12, -0.24, 0.24, DECK_Z + 0.85, DECK_Z + 1.48)
    return bm


def build_forecastle_bmesh():
    bm = bmesh.new()
    extrude_polygon(
        bm, clip_x_ge(hull_outline(1.0), FORECASTLE_X), DECK_Z, DECK_Z + 0.13
    )
    return bm


# --------------------------------------------------------------------------
# Scene assembly
# --------------------------------------------------------------------------

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def make_material(name: str, hex_colour: str, roughness=0.7, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    rgba = hex_to_linear_rgba(hex_colour)
    bsdf.inputs["Base Color"].default_value = rgba
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    mat.diffuse_color = rgba
    return mat


def add_object(name: str, bm, hex_colour: str, location=(0.0, 0.0, 0.0)):
    """One mesh, one object, one material slot named after the object."""
    mesh = bpy.data.meshes.new(name)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = False          # flat shading throughout
    mesh.materials.append(make_material(f"mat_{name}", hex_colour))
    obj = bpy.data.objects.new(name, mesh)
    obj.location = location
    bpy.context.collection.objects.link(obj)
    return obj


def compartment_slots(count: int):
    """Longitudinal slots, forward first. Slot 0 carries compartment No. 1."""
    span = CARGO_FWD - CARGO_AFT
    cell = (span - CARGO_GAP * (count - 1)) / count
    return [(CARGO_FWD - cell / 2.0 - i * (cell + CARGO_GAP), cell) for i in range(count)]


def build_vessel(vessel_type: str, count: int):
    """Returns (compartment_objects, structure_objects)."""
    if not MIN_COUNT <= count <= MAX_COUNT:
        raise ValueError(f"compartment count {count} outside {MIN_COUNT}..{MAX_COUNT}")

    reset_scene()
    fill = STATUS_COLOURS[DEFAULT_STATE]["fill"]

    structure = [
        add_object("hull", build_hull_bmesh(), BRAND_NAVY),
        add_object("superstructure", build_superstructure_bmesh(), BRAND_NAVY),
        add_object("detail_bulwark", build_bulwark_bmesh(), BRAND_NAVY),
        add_object("detail_funnel", build_funnel_bmesh(), BRAND_NAVY),
        add_object("detail_forecastle", build_forecastle_bmesh(), BRAND_NAVY),
    ]

    compartments = []
    if vessel_type == "hold":
        # Holds run the full breadth: one box per slot, on the centreline.
        for index, (cx, cell) in enumerate(compartment_slots(count), start=1):
            name = f"hold_{index:02d}"
            bm = build_compartment_bmesh(cell, HOLD_WIDTH)
            compartments.append(add_object(name, bm, fill, (cx, 0.0, DECK_Z)))
            _check_fits(name, cx, cell, HOLD_WIDTH / 2.0)
    else:
        # Tanks come in port/starboard pairs sharing one slot. An odd count
        # ends with a lone port tank and the starboard side left empty.
        pairs = math.ceil(count / 2)
        offset = TANK_CENTRE_GAP / 2.0 + TANK_WIDTH / 2.0
        placed = 0
        for pair_no, (cx, cell) in enumerate(compartment_slots(pairs), start=1):
            for side, sign in (("p", 1.0), ("s", -1.0)):
                if placed >= count:
                    break
                name = f"tank_{pair_no:02d}{side}"
                bm = build_compartment_bmesh(cell, TANK_WIDTH)
                compartments.append(
                    add_object(name, bm, fill, (cx, sign * offset, DECK_Z))
                )
                _check_fits(name, cx, cell, offset + TANK_WIDTH / 2.0)
                placed += 1

    _assert_numbering(compartments)
    return compartments, structure


def _check_fits(name: str, cx: float, cell: float, half_width: float):
    """No compartment may be wider than the hull at its forward face."""
    fwd = cx + cell / 2.0
    room = deck_half_beam(fwd)
    if half_width > room - 0.03:
        raise AssertionError(
            f"{name} is {half_width:.3f} half-wide at x={fwd:.2f} "
            f"where the deck is only {room:.3f}"
        )


def _assert_numbering(compartments):
    """No. 1 is forwardmost and numbering increases aft — asserted, not assumed."""
    xs = [(o.name, round(o.location.x, 6)) for o in compartments]
    first_name, first_x = xs[0]
    for name, x in xs[1:]:
        if x > first_x:
            raise AssertionError(
                f"{first_name} must be the most forward compartment, "
                f"but {name} sits further forward (x={x} > {first_x})"
            )
    ordered = sorted(xs, key=lambda p: -p[1])
    numbers = [int(n.split("_")[1][:2]) for n, _ in ordered]
    if numbers != sorted(numbers):
        raise AssertionError(f"numbering does not increase aft: {ordered}")
    return first_x


def triangle_count(objs) -> int:
    total = 0
    for obj in objs:
        mesh = obj.data
        total += sum(len(p.vertices) - 2 for p in mesh.polygons)
    return total


# --------------------------------------------------------------------------
# Export
# --------------------------------------------------------------------------

def export_glb(objs, path: Path):
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_cameras=False,
        export_lights=False,
        export_animations=False,
        export_extras=False,
        export_normals=True,
        export_texcoords=False,
        export_materials="EXPORT",
    )
    return path.stat().st_size


def _world_centre_x(obj) -> float:
    return sum((obj.matrix_world @ Vector(c)).x for c in obj.bound_box) / 8.0


def verify_glb(path: Path, expected_compartments, expected_structure):
    """Reopen what we actually wrote and check the integration contract on the
    file, not on the scene it came from."""
    reset_scene()
    bpy.ops.import_scene.gltf(filepath=str(path))
    bpy.context.view_layer.update()

    scene_objs = list(bpy.context.scene.objects)
    stray = [o.name for o in scene_objs if o.type in {"CAMERA", "LIGHT"}]
    if stray:
        raise AssertionError(f"{path.name}: camera/light leaked into the glb: {stray}")

    meshes = [o for o in scene_objs if o.type == "MESH"]
    found = sorted(o.name for o in meshes)
    expected = sorted(list(expected_compartments) + list(expected_structure))
    if found != expected:
        missing = sorted(set(expected) - set(found))
        extra = sorted(set(found) - set(expected))
        raise AssertionError(
            f"{path.name}: object names differ. missing={missing} unexpected={extra}"
        )

    for obj in meshes:
        if len(obj.data.materials) != 1:
            raise AssertionError(
                f"{path.name}: {obj.name} has {len(obj.data.materials)} material "
                "slots, expected exactly 1"
            )
        slot = obj.data.materials[0]
        if slot.name != f"mat_{obj.name}":
            raise AssertionError(
                f"{path.name}: {obj.name} uses material {slot.name!r}, "
                f"expected 'mat_{obj.name}'"
            )

    cells = [o for o in meshes if o.name in set(expected_compartments)]
    ranked = sorted(cells, key=lambda o: -_world_centre_x(o))
    if ranked[0].name != expected_compartments[0]:
        raise AssertionError(
            f"{path.name}: {ranked[0].name} is further forward than "
            f"{expected_compartments[0]}"
        )
    return [o.name for o in ranked]


# --------------------------------------------------------------------------
# Preview render (never exported — camera, lights and labels live only here)
# --------------------------------------------------------------------------

def _look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def _screen_yaw(cam) -> float:
    """Rotation about Z that makes flat text run left-to-right on screen."""
    # From the euler directly: matrix_world is stale until the depsgraph runs.
    right = cam.rotation_euler.to_matrix() @ Vector((1.0, 0.0, 0.0))
    return math.atan2(right.y, right.x)


def _flat_text(name: str, body: str, location, size: float, colour: str, yaw: float):
    """Text lying flat in the deck plane, turned to face the preview camera."""
    curve = bpy.data.curves.new(name, type="FONT")
    curve.body = body
    curve.align_x = "CENTER"
    curve.align_y = "CENTER"
    curve.size = size
    obj = bpy.data.objects.new(name, curve)
    obj.location = location
    obj.rotation_euler = (0.0, 0.0, yaw)
    obj.data.materials.append(make_material(f"mat_{name}", colour))
    bpy.context.collection.objects.link(obj)
    return obj


def _add_number_labels(compartments, yaw: float):
    """Compartment numbers printed on their own hatch panels, so the numbering
    can be checked from the PNG alone. Cosmetic: if the bundled font is
    unavailable the render simply loses them."""
    try:
        for obj in compartments:
            tag = obj.name.split("_")[1]
            _flat_text(
                f"preview_label_{obj.name}",
                tag.lstrip("0"),
                (obj.location.x, obj.location.y, DECK_Z + PANEL_Z + 0.004),
                0.24,
                "#33475a",
                yaw,
            )
    except Exception as exc:  # pragma: no cover - cosmetic only
        print(f"    (labels skipped: {exc})")


def _shrink_png(path: Path):
    """Previews live in the repo, so palette them down. Flat shading means ~200
    colours is visually lossless. Silently skipped if Pillow is absent."""
    try:
        from PIL import Image
    except ImportError:
        return
    before = path.stat().st_size
    img = Image.open(path).convert("RGB")
    img.quantize(colors=200, dither=Image.Dither.FLOYDSTEINBERG).save(
        path, optimize=True
    )
    print(f"    png          : {before / 1024:.0f} KB -> {path.stat().st_size / 1024:.0f} KB")


def render_preview(compartments, title: str, path: Path, samples: int = 32):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 1100
    scene.render.resolution_y = 620
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.image_settings.compression = 100

    world = bpy.data.worlds.new("preview_world")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = hex_to_linear_rgba("#eef3f7")
    bg.inputs[1].default_value = 1.1
    scene.world = world

    cam_data = bpy.data.cameras.new("preview_cam")
    cam_data.lens = 44
    cam = bpy.data.objects.new("preview_cam", cam_data)
    cam.location = Vector((9.0, -9.2, 5.6))
    bpy.context.collection.objects.link(cam)
    _look_at(cam, (-0.2, -0.35, 0.7))
    scene.camera = cam

    key_data = bpy.data.lights.new("preview_key", type="SUN")
    key_data.energy = 3.2
    key_data.angle = math.radians(12)
    key = bpy.data.objects.new("preview_key", key_data)
    key.location = Vector((6.0, -6.0, 9.0))
    bpy.context.collection.objects.link(key)
    _look_at(key, (0.0, 0.0, 0.0))

    fill_data = bpy.data.lights.new("preview_fill", type="AREA")
    fill_data.energy = 620
    fill_data.size = 9.0
    fill = bpy.data.objects.new("preview_fill", fill_data)
    fill.location = Vector((-7.0, 6.0, 5.0))
    bpy.context.collection.objects.link(fill)
    _look_at(fill, (0.0, 0.0, 0.6))

    ground = bpy.data.meshes.new("preview_ground")
    gbm = bmesh.new()
    box(gbm, -26, 26, -26, 26, -0.06, -0.02)
    gbm.to_mesh(ground)
    gbm.free()
    ground.materials.append(make_material("mat_preview_ground", "#dde5ec", 0.9))
    bpy.context.collection.objects.link(bpy.data.objects.new("preview_ground", ground))

    yaw = _screen_yaw(cam)
    _add_number_labels(compartments, yaw)
    _flat_text("preview_caption", title, (-0.9, -2.55, -0.015), 0.46, "#0a2e52", yaw)
    _flat_text("preview_bow", "BOW  \u25b6", (3.7, -1.75, -0.015), 0.34, "#0a2e52", yaw)
    _flat_text("preview_stern", "STERN", (-4.5, -1.75, -0.015), 0.28, "#8391 9c".replace(" ", ""), yaw)

    path.parent.mkdir(parents=True, exist_ok=True)
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    _shrink_png(path)
    return path


# --------------------------------------------------------------------------
# Driver
# --------------------------------------------------------------------------

def script_args(argv=None):
    """Works under `blender -- ...` and under plain `python script.py ...`."""
    argv = list(sys.argv if argv is None else argv)
    if "--" in argv:
        return argv[argv.index("--") + 1 :]
    # bpy.app.binary_path is empty when Blender is imported as a module.
    return [] if getattr(bpy.app, "binary_path", "") else argv[1:]


def main():
    here = Path(__file__).resolve().parent
    root = here.parent

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=root / "public" / "models")
    parser.add_argument("--previews", type=Path, default=here / "previews")
    parser.add_argument("--no-previews", action="store_true")
    parser.add_argument("--no-verify", action="store_true")
    parser.add_argument("--save-blend", action="store_true",
                        help="also write a .blend per variant, with camera and lights")
    parser.add_argument("--blend-dir", type=Path, default=here / "blend")
    parser.add_argument("--samples", type=int, default=32)
    parser.add_argument("--counts", type=int, nargs="+",
                        default=list(range(MIN_COUNT, MAX_COUNT + 1)))
    parser.add_argument("--types", nargs="+", choices=["hold", "tank"],
                        default=["hold", "tank"])
    parser.add_argument("--max-bytes", type=int, default=250 * 1024)
    parser.add_argument("--max-tris", type=int, default=6000)
    args = parser.parse_args(script_args())

    for count in args.counts:
        if not MIN_COUNT <= count <= MAX_COUNT:
            parser.error(
                f"--counts must be within {MIN_COUNT}..{MAX_COUNT}; got {count}. "
                "Above 10 the app falls back to the 2D diagram by design."
            )

    started = time.time()
    rows = []
    manifest = []

    for vessel_type in args.types:
        for count in args.counts:
            name = f"vessel-{vessel_type}-{count:02d}"
            print(f"\n=== {name} ===")

            compartments, structure = build_vessel(vessel_type, count)
            objs = structure + compartments
            tris = triangle_count(objs)

            forward = max(compartments, key=lambda o: o.location.x)
            print(f"    compartments : {', '.join(o.name for o in compartments)}")
            print(f"    forwardmost  : {forward.name} at x={forward.location.x:+.3f}"
                  f"  (expected {compartments[0].name})")
            assert forward.name == compartments[0].name

            glb = args.out / f"{name}.glb"
            size = export_glb(objs, glb)
            print(f"    triangles    : {tris}")
            print(f"    glb          : {size / 1024:.1f} KB -> {glb}")

            if tris > args.max_tris:
                raise AssertionError(f"{name}: {tris} triangles exceeds {args.max_tris}")
            if size > args.max_bytes:
                raise AssertionError(f"{name}: {size} bytes exceeds {args.max_bytes}")

            rows.append((name, len(compartments), tris, size))
            manifest.append((glb, [o.name for o in compartments],
                             [o.name for o in structure]))

            if not args.no_previews:
                label = ("Holds" if vessel_type == "hold" else "Tanks")
                png = render_preview(
                    compartments, f"{count} {label}",
                    args.previews / f"{name}.png", args.samples,
                )
                print(f"    preview      : {png}")

            if args.save_blend:
                args.blend_dir.mkdir(parents=True, exist_ok=True)
                blend = args.blend_dir / f"{name}.blend"
                bpy.ops.wm.save_as_mainfile(filepath=str(blend))
                print(f"    blend        : {blend}")

    if not args.no_verify:
        print("\n=== verifying exported files ===")
        for glb, cells, structure in manifest:
            order = verify_glb(glb, cells, structure)
            print(f"    {glb.name}: {len(cells) + len(structure)} objects, "
                  f"bow to stern {' '.join(order)}")

    print("\n" + "=" * 62)
    print(f"{'model':<22}{'cells':>7}{'tris':>9}{'KB':>10}")
    print("-" * 62)
    for name, cells, tris, size in rows:
        print(f"{name:<22}{cells:>7}{tris:>9}{size / 1024:>9.1f}")
    print("-" * 62)
    print(f"{len(rows)} models, largest {max(s for *_, s in rows) / 1024:.1f} KB, "
          f"{time.time() - started:.0f}s")


if __name__ == "__main__":
    main()
