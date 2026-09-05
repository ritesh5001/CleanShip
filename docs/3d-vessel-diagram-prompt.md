# Prompt — 3D vessel diagram for CleanTrack (Blender → glTF)

Paste everything below the line into Claude Cowork. It assumes the agent can
run Blender headless (`blender --background --python script.py`).

---

## What I need

A **Blender Python script** that parametrically generates low-poly 3D vessel
models and exports them as **glTF-Binary (`.glb`)** for use on a website. The
models show a ship's cargo **holds** or **tanks** as separately addressable
objects, so a web app can colour each one at runtime according to its cleaning
status.

This replaces a flat 2D SVG diagram. It is a **schematic**, not a realistic
ship — clarity beats realism. It will be viewed small, often on a phone, by a
supervisor standing on a deck and by a customer checking progress.

## Deliverables

1. `scripts/generate_vessels.py` — one Blender script, parametric, no GUI.
2. Exported models in `public/models/`:
   - `vessel-hold-04.glb` … `vessel-hold-10.glb` (7 files)
   - `vessel-tank-04.glb` … `vessel-tank-10.glb` (7 files)
3. `README.md` explaining how to regenerate and what the object names mean.
4. One render preview PNG per variant so I can eyeball them without a viewer.

Each file must be **under 250 KB**. These load on port mobile data.

## Compartment counts

Generate for **4 through 10** compartments. Ten is the hard maximum — never
model more. If the app ever asks for more than 10 it will fall back to the 2D
diagram, so do not try to handle it.

## THE TWO VESSEL TYPES ARE DIFFERENT SHAPES

This is the part most likely to be got wrong, so read it twice.

**Holds** run the full width of the ship. A 7-hold vessel has 7 boxes in a
single row along the centreline, bow to stern.

**Tanks** come in port/starboard PAIRS. They are labelled `1p, 1s, 2p, 2s, 3p,
3s…` where `p` = port (left) and `s` = starboard (right). A 6-tank vessel is
**3 pairs side by side**, not 6 in a row. For an odd count (7 tanks), the last
one is a single unpaired tank — model it as a port-side tank with no
starboard partner, and leave the gap.

## ORIENTATION AND NUMBERING — CRITICAL

- The **bow (front) points along +X.** The stern is at −X.
- **Hold No. 1 / Tank 1p is the FORWARDMOST compartment**, nearest the bow.
  Numbering increases toward the stern. This is standard maritime convention
  and it is the opposite of what my current 2D diagram does, so do not copy
  any existing layout — follow this spec.
- Y is the beam (port/starboard), Z is up. glTF is Y-up, so let the exporter
  do its usual conversion; author in Blender's Z-up.
- Model origin at the **centre of the vessel**, sitting on Z=0.
- Keep total length around **10 Blender units** regardless of compartment
  count, so every model frames identically in the same camera.

## Object naming — the integration contract

The web app looks compartments up **by name** and sets their material colour.
Get this exactly right or nothing works:

- Holds: `hold_01`, `hold_02`, … `hold_10` (zero-padded, two digits)
- Tanks: `tank_01p`, `tank_01s`, `tank_02p`, `tank_02s`, …
- Hull: `hull`
- Superstructure/accommodation block: `superstructure`
- Any deck/rail detail: prefix `detail_` so it can be ignored in bulk

**Each compartment must be its own mesh object with its own material slot**,
not merged geometry and not a shared material. Name each material after its
object (`mat_hold_01`) so the runtime can swap base colour per compartment
without touching its neighbours.

## Materials and colours

Use simple **Principled BSDF**, no textures, no image maps — flat colour only.
Keep roughness high (~0.7) and metallic 0 so it reads clearly at small size.

Hull and superstructure use the brand navy: `#0a2e52`.

Compartments should be exported in the **"not started"** colour. The web app
overwrites these at runtime, so treat them as defaults, but match them exactly:

| State | Fill | Edge |
| --- | --- | --- |
| Not started | `#e8edf2` | `#b9c5cf` |
| In progress | `#fdefd0` | `#c9880d` |
| Complete | `#d9f2e4` | `#1e9e63` |

There is a fourth state, **Not applicable**, shown as grey `#7f7f7f` — a
compartment excluded from the job. Account for it in the README but export
with the "not started" default.

## Geometry guidance

- Hull: a simple extruded shape with a **pointed/raked bow** and a squared
  stern. It should read as a bulk carrier or tanker in silhouette. Do not
  model a bulbous bow, propeller, anchors, or hull plating.
- Compartments: rounded-corner boxes recessed slightly into the deck, with a
  visible rim so each one is distinct from its neighbour when they are all the
  same colour.
- Superstructure: a simple block toward the **stern**, tall enough to make the
  orientation obvious at a glance.
- **Total under 6,000 triangles per model.** Use flat shading. No subdivision
  surface modifiers left unapplied.
- No lights and no camera in the exported `.glb` — the web viewer supplies its
  own. Include them in the .blend for your preview renders only.

## Quality bar

- Every compartment individually selectable and correctly named — verify by
  reopening each exported `.glb` and listing object names in the script output.
- Numbering visually correct: print a check that `hold_01` has the **greatest
  X** (most forward) of all compartments, and assert it in the script rather
  than trusting the loop.
- All 14 files export without manual steps, from one command.
- Report the actual file sizes and triangle counts in your final message.

## What I do NOT want

- No realistic ship detailing, no textures, no PBR maps.
- No baked-in status colours other than the "not started" default.
- No animation, no rigging.
- No single mega-file with all counts — one file per count, per type.
- Do not merge compartments into the hull mesh.
