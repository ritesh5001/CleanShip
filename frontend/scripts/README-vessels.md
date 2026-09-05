# CleanTrack 3D vessels

Two photoreal-ish ships for the CleanTrack compartment view — a **bulk carrier**
and a **product tanker** — generated from one parametric Blender script and
exported as glTF with baked PBR textures.

The hull loads once and caches. The app then clones a single compartment module
per hold or tank and places it from `vessel-layout.json`. That means **any**
compartment count works, not just 4–10, and a detailed hull is downloaded once
per vessel type instead of once per count.

| | |
| --- | --- |
| Generator | `frontend/scripts/vessel_hd.py` |
| Verifier | `frontend/scripts/verify_models.py` |
| Models | `frontend/public/models/` |
| Previews | `frontend/scripts/previews_hd/` (not served) |

---

## Files

| File | What it is |
| --- | --- |
| `hull-bulker.glb` | Handymax bulk carrier: hull, deckhouse, forecastle, open cargo trough with topside and hopper tanks |
| `module-hold.glb` | One cargo hold: coaming, hatch cover, stowed cover, progress overlay, cargo level, plus the cross-deck |
| `hull-tanker.glb` | Product tanker: flush deck, centreline catwalk, midship manifold, deck lines |
| `module-tank.glb` | One cargo tank: painted tank panel, tank hatch, P/V riser, Butterworth plates, progress overlay |
| `vessel-layout.json` | Where to put every clone, for counts 4–10, both types |

The earlier low-poly set (`vessel-hold-04.glb` … `vessel-tank-10.glb`, ~33–63 KB
each) is still in `public/models/`. Keep it as the **light tier**: it is the
right thing to serve to a supervisor on a phone on port mobile data, where a
3 MB hull is not. The detailed pair is the desktop/customer-facing tier.

---

## Regenerating

Needs Blender 5.x. From `frontend/`:

```bash
blender --background scripts/blend/base.blend --python scripts/vessel_hd.py
```

Controlled by environment variables rather than flags, because Blender eats
argv:

| Variable | Default | |
| --- | --- | --- |
| `VESSEL_MODE` | `all` | `export`, `preview`, or `all` |
| `VESSEL_KINDS` | `hold,tank` | which vessels to build |
| `VESSEL_TEX` | `2048` | hull texture size; modules get a quarter of it |
| `VESSEL_OUT` | the repo `frontend/` | output root |

A full run at `VESSEL_TEX=4096` takes about three minutes on an M4 with Cycles
on Metal — most of it baking. Then check what was written:

```bash
blender --background scripts/blend/base.blend --python scripts/verify_models.py
```

That reopens every `.glb`, prints the node names, texture sizes and triangle
counts, asserts no camera or light leaked in, and — the part worth having —
rebuilds a seven-compartment ship **from the manifest alone** and renders it, so
a broken layout shows up as a broken picture rather than as a silent runtime
bug.

---

## The integration contract

### Node names

Inside `module-hold.glb` / `module-tank.glb`:

| Node | Purpose |
| --- | --- |
| `compartment` | empty root — **clone this**, set its transform |
| `compartment__coaming` | the large status-coloured surface (bulker: hatch coaming; tanker: painted tank panel) |
| `compartment__hatch_cover` | hatch cover in place (bulker only) |
| `compartment__hatch_cover_stowed` | the same panels stacked aft, for the hold-open view (bulker only) |
| `compartment__compartment_progress` | the partial-fill overlay |
| `compartment__cargo_fill` | the cargo level solid |
| `compartment__cleats` / `compartment__tank_fittings` | fixed steel, never recoloured |
| `crossdeck` | empty root for the steel between two compartments |
| `crossdeck__plate`, `crossdeck__bulkhead` | its parts |

Inside the hulls: `hull` and `superstructure`. Two nodes, two texture sets.

### Placing the clones

`vessel-layout.json` gives, per type and per count, every compartment's
`name`, `x`, `y`, `z` and `scaleX`, and every cross-deck position.

**Scale the compartment root in X only** — that is why the hatch-cover ribs run
fore-and-aft and why the cross-deck is a separate node: nothing that has a true
width gets stretched.

glTF is Y-up while these numbers are authored Z-up, so in three.js:

```js
const layout = await (await fetch("/models/vessel-layout.json")).json();
const plan = layout.types[vessel.type === "tank" ? "tank" : "hold"]
                   .counts[String(vessel.compartmentCount)];

for (const spec of plan.compartments) {
  const node = moduleProto.clone(true);
  node.name = spec.name;                       // hold_01, tank_03p, ...
  node.position.set(spec.x, spec.z, -spec.y);  // Z-up -> Y-up
  node.scale.set(spec.scaleX, 1, 1);
  ship.add(node);
}
```

### Driving the four readouts

All four mechanisms are in the model; use as many as suit the screen.

```js
const c = ship.getObjectByName("hold_03");

// 1. status colour on the big surface
for (const key of ["coaming", "hatch_cover", "hatch_cover_stowed"]) {
  const m = c.getObjectByName(`hold_03__${key}`);
  if (m) m.material.color.setStyle(STATE_STYLE[state].fill);
}

// 2. partial fill of the hatch surface, aft to forward
const bar = c.getObjectByName("hold_03__compartment_progress");
bar.visible = ratio > 0;
bar.scale.x = ratio;                                   // 0..1
bar.material.color.setStyle(STATE_STYLE[state].stroke);

// 3. cargo level rising in an open hold
c.getObjectByName("hold_03__hatch_cover").visible = !open;
c.getObjectByName("hold_03__hatch_cover_stowed").visible = open;
const cargo = c.getObjectByName("hold_03__cargo_fill");
cargo.visible = open;
cargo.scale.z = ratio;                                 // base sits on the tank top

// 4. floating percentage — anchor at layout.labelOffsetZ above the module root
sprite.position.copy(c.position).add(new THREE.Vector3(0, layout.labelOffsetZ, 0));
```

The base colour textures are baked **neutral grey with the grime and streaking
on top**, so `material.color` multiplies into tinted steel rather than flat
plastic. That is deliberate: set the colour, don't replace the map.

---

## Colours

Hull and funnel carry the brand navy `#0a2e52`; decks are a working green;
below the waterline is antifouling red with a black boot-top.

Compartments export in the **not started** fill and the app overwrites it:

| State | Fill | Edge (use for the progress bar and outlines) |
| --- | --- | --- |
| Not started | `#e8edf2` | `#b9c5cf` |
| In progress | `#fdefd0` | `#c9880d` |
| Complete | `#d9f2e4` | `#1e9e63` |
| Not applicable | `#7f7f7f` | `#5f5f5f` |

Same values as `STATE_STYLE` in `src/lib/cleantrack/types.ts` plus the `na` grey
from `CELL_STYLE`, and they are repeated inside `vessel-layout.json` so the
model and the app cannot drift apart silently.

---

## Orientation

```
        stern                                              bow
        -X  ────────────────────────────────────────────►  +X
             7    6    5    4    3    2    1                    holds
```

- **+X is the bow**, +Y port, −Y starboard, +Z up (authored Z-up).
- **No. 1 is the forwardmost compartment**, numbering increasing aft — maritime
  convention, and the opposite of the 2D SVG in
  `src/components/cleantrack/vessel-diagram.tsx`.
- Tanks come in port/starboard pairs: `1p 1s 2p 2s …`; an odd count ends with a
  lone port tank and the starboard side of that slot left empty.
- Origin is the centre of the vessel at the keel, so the hull sits on Z = 0.
  The waterline is at Z = 0.62 if you want to draw a sea plane.

---

## What is modelled

**Bulk carrier.** Station-lofted hull with real sheer, bilge radius, raked stem
and bulbous bow; transom stern with skeg, rudder and propeller; open cargo
trough with topside wing tanks, hopper tanks and the inner bottom, so an opened
hold shows the octagonal section a bulker actually has; four-deck accommodation
block with bridge wings and wheelhouse; funnel with brand band; forecastle with
windlass and mooring winches; fore and aft masts; railings.

It is **gearless** — no deck cranes. Cranes sit between hatches, and hatch
positions move with the compartment count, so fixed cranes would collide on some
counts. Many handymax and most panamax/capesize bulkers are gearless, so this is
a real ship, not a compromise. Say the word if you want a geared version — it
means either a per-count hull or cranes as a third instanced module.

**Product tanker.** Same hull form, flush deck, raised centreline catwalk on
stools with railings, midship manifold with drip trays and risers, cargo and
stripping lines running fore and aft. Tanks are closed structures, so the
cargo-level readout is only visible in a cutaway view; on deck a tank reads
through its painted panel, progress bar and label.

Not modelled: hull plating seams, anchors, accommodation ladders, lifeboats,
draft marks, ship name.

---

## Weight

| | tris | textures | file |
| --- | --- | --- | --- |
| `hull-bulker.glb` | 8,300 | 4096 + 2048 | 2.29 MB |
| `module-hold.glb` | 564 | 8 × 1024 | 0.41 MB |
| `hull-tanker.glb` | 11,604 | 4096 + 2048 | 3.85 MB |
| `module-tank.glb` | 276 | 5 × 1024 | 0.25 MB |

So **2.7 MB for a bulker and 4.1 MB for a tanker**, whatever the compartment
count — inside the 8–15 MB ceiling with room to spare if you want
`VESSEL_TEX=8192`. Triangle counts are low because the realism is carried by
baked texture rather than by geometry, which is the right trade for WebGL.

### Two things the modules ship collapsed

`compartment__compartment_progress` exports at `scale.x = 0.0001` and
`compartment__cargo_fill` at `scale.z = 0.0001`, so loading a module without
wiring anything up gives a clean hatch rather than a full amber bar and a hold
full of cargo. Both are meant to be driven — set the scale to the ratio.

### Textures

Each object carries two maps: a baked albedo (paint, grime, rust streaking and
ambient occlusion multiplied in) and a packed ORM — occlusion in R, roughness in
G, metallic in B. The ORM is composed in the script rather than left to the
exporter, which otherwise synthesises a blank one and every surface arrives in
the browser as a mirror.

Give the viewer an environment map. These are PBR materials with real roughness
variation and they look flat under a single directional light.

---

## Wired into the app

| File | Role |
| --- | --- |
| `src/lib/cleantrack/vessel-3d.ts` | the scene: loads, clones, places, recolours. Plain three.js, no react-three-fiber |
| `src/components/cleantrack/vessel-diagram-3d.tsx` | React wrapper — same props as `VesselDiagram`, plus the legend, the keyboard list and the fallback |
| `vessel-diagram-static.tsx` | customer view, read-only |
| `status-grid.tsx` | supervisor view, `onSelect` wired to the compartment sheet |

`three` is the only dependency added. It is behind a dynamic `import()`, so the
shared bundle stays at **103 kB** and the vessel page adds ~11 kB up front; the
**83 kB gzipped** three chunk loads only when a 3D view actually mounts.

### What changes with the percentage

Three separate channels, all driven from `progressOf` and `compartmentState`:

- **Colour** — the coaming and hatch cover take `STATE_STYLE[state].fill`. Pass
  `colourMode="gradient"` to blend continuously by percentage instead, at the
  cost of the 3D view and the grid disagreeing about a half-done hold.
- **Bar** — a translucent wash in the edge colour fills the hatch aft-to-forward
  at `scale.x = ratio`, the same language the SVG plan uses.
- **Cargo level** — an in-progress hold opens its covers and the cargo rises to
  `scale.z = ratio`.

Materials are cloned per compartment on build. Without that, glTF clones share
material instances and recolouring one hold recolours all of them.

### Falling back

The SVG plan renders instead when WebGL is missing, when a model fails to load,
or when the compartment count is outside 4–10. A **3D / Plan** switch sits under
the view either way, because a supervisor in gloves on a windy deck may well
want flat tap targets that do not rotate away from a finger.

The canvas is not reachable by keyboard or screen reader, so the same
compartments appear underneath as real buttons carrying the same label, colour,
progress and `onSelect`.
