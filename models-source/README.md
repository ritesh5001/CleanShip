# Vessel model source pieces

Build inputs for the Blender script that produces `frontend/public/models/vessel-*.glb`.

They live here rather than in `frontend/public/` because anything under
`public/` is served to the internet and deployed with every build. These four
files total ~7 MB and no browser ever requests them — the per-count vessel
models are self-contained at 33–62 KB each. Keeping them in `public/` meant
paying 7 MB of deploy weight to serve nothing.
