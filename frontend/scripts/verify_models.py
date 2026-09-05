"""Reopen the exported .glb files, check the contract, render what a browser
will actually show. Nothing here touches the authoring scene."""
import json, math, os, sys
from pathlib import Path
import bpy
from mathutils import Vector

OUT = Path(os.environ.get("VESSEL_OUT", "/Users/ritesh5001/Office/CleanShip/frontend"))
MODELS = OUT / "public/models"


def fresh():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def world_and_light():
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = d.type != "CPU"
    sc.cycles.device = "GPU"
    sc.cycles.samples = 40
    sc.render.resolution_x, sc.render.resolution_y = 1600, 900
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGB"
    sc.view_settings.view_transform = "AgX"
    w = bpy.data.worlds.new("w"); w.use_nodes = True
    nt = w.node_tree
    bg = nt.nodes["Background"]
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sun_elevation = math.radians(28); sky.sun_rotation = math.radians(150)
    nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
    bg.inputs[1].default_value = 0.16
    sc.world = w
    ld = bpy.data.lights.new("sun", type="SUN"); ld.energy = 0.75
    s = bpy.data.objects.new("sun", ld)
    s.rotation_euler = (math.radians(52), 0, math.radians(214))
    bpy.context.collection.objects.link(s)


def cam(loc, tgt, lens=55):
    d = bpy.data.cameras.new("c"); d.lens = lens
    c = bpy.data.objects.new("c", d); c.location = Vector(loc)
    v = Vector(tgt) - c.location
    c.rotation_euler = v.to_track_quat("-Z", "Y").to_euler()
    bpy.context.collection.objects.link(c)
    bpy.context.scene.camera = c


def texture_colorspaces():
    return sorted({(i.name, i.colorspace_settings.name)
                   for i in bpy.data.images if i.name != "Render Result"})


def report(path):
    fresh()
    bpy.ops.import_scene.gltf(filepath=str(path))
    objs = list(bpy.context.scene.objects)
    info = {
        "file": path.name,
        "bytes": path.stat().st_size,
        "nodes": sorted(o.name for o in objs),
        "cameras_or_lights": [o.name for o in objs if o.type in ("CAMERA", "LIGHT")],
        "images": [(i.name, i.size[0], i.size[1]) for i in bpy.data.images if i.name != "Render Result"],
        "tris": sum(sum(len(p.vertices) - 2 for p in o.data.polygons)
                    for o in objs if o.type == "MESH"),
    }
    return info


def main():
    results = []
    layout = json.loads((MODELS / "vessel-layout.json").read_text())
    for name in sorted(p.name for p in MODELS.glob("hull-*.glb")) + \
                sorted(p.name for p in MODELS.glob("module-*.glb")):
        results.append(report(MODELS / name))
    print("VERIFY " + json.dumps(results), flush=True)

    # Assemble a 7-hold ship the way the app will, from the manifest alone.
    for kind, tag in (("hold", "bulker"), ("tank", "tanker")):
        entry = layout["types"].get(kind)
        if not entry or not (MODELS / entry["hull"]).exists():
            continue
        fresh(); world_and_light()
        bpy.ops.import_scene.gltf(filepath=str(MODELS / entry["hull"]))
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=str(MODELS / entry["module"]))
        imported = [o for o in bpy.data.objects if o not in before]
        roots = {o.name: o for o in imported if o.parent is None}
        plan = entry["counts"]["7"]
        for spec in plan["compartments"]:
            proto = roots.get("compartment")
            if proto is None:
                continue
            copies = []
            r = proto.copy(); r.name = spec["name"]
            # glTF is Y-up: (x, y, z)_blender -> importer already restored Z-up
            r.location = (spec["x"], spec["y"], spec["z"])
            r.scale = (spec["scaleX"], 1.0, 1.0)
            bpy.context.collection.objects.link(r)
            for ch in proto.children:
                c = ch.copy(); c.parent = r
                c.matrix_parent_inverse = ch.matrix_parent_inverse.copy()
                bpy.context.collection.objects.link(c); copies.append(c)
        for spec in plan["crossdecks"]:
            proto = roots.get("crossdeck")
            if proto is None:
                continue
            r = proto.copy()
            r.location = (spec["x"], spec.get("y", 0.0), spec["z"])
            bpy.context.collection.objects.link(r)
            for ch in proto.children:
                c = ch.copy(); c.parent = r
                c.matrix_parent_inverse = ch.matrix_parent_inverse.copy()
                bpy.context.collection.objects.link(c)
        for name in ("compartment", "crossdeck"):
            if name in roots:
                roots[name].hide_render = True
                for ch in roots[name].children:
                    ch.hide_render = True
        print("COLORSPACES " + repr(texture_colorspaces()), flush=True)
        cam((11.6, -10.2, 4.3), (0.1, 0.0, 0.72), 55)
        p = OUT / f"scripts/previews_hd/verify-{tag}-assembled.png"
        p.parent.mkdir(parents=True, exist_ok=True)
        bpy.context.scene.render.filepath = str(p)
        bpy.ops.render.render(write_still=True)
        print(f"  assembled {tag}", flush=True)
    print("VERIFY DONE", flush=True)


main()
