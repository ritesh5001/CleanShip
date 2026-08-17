/**
 * Emits src/lib/video-manifest.json from the encoded files on disk.
 *
 * VP9 is usually smaller than H.264, but not always — high-motion water
 * footage occasionally encodes larger. Browsers pick the FIRST <source> they
 * support, so a fixed webm-then-mp4 order would hand Chrome the bigger file
 * for those clips. This records which format actually won per clip so the
 * player can order its sources accordingly.
 *
 * Run after ./scripts/compress-videos.sh.
 */
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VIDEO_DIR = "public/videos";
const OUT = "src/lib/video-manifest.json";

const slugs = [
  ...new Set(
    readdirSync(VIDEO_DIR)
      .filter((f) => f.endsWith(".mp4") || f.endsWith(".webm"))
      .map((f) => f.replace(/\.(mp4|webm)$/, "")),
  ),
].sort();

const manifest = {};

for (const slug of slugs) {
  const sizeOf = (ext) => {
    try {
      return statSync(join(VIDEO_DIR, `${slug}.${ext}`)).size;
    } catch {
      return null;
    }
  };

  const mp4 = sizeOf("mp4");
  const webm = sizeOf("webm");

  manifest[slug] = {
    mp4,
    webm,
    // Which format the player should offer first.
    preferred: webm !== null && (mp4 === null || webm <= mp4) ? "webm" : "mp4",
  };
}

writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`);

const mp4First = Object.entries(manifest).filter(
  ([, v]) => v.preferred === "mp4",
);
console.log(`wrote ${OUT} (${slugs.length} clips)`);
if (mp4First.length) {
  console.log(
    `mp4 preferred for: ${mp4First.map(([s]) => s).join(", ")}`,
  );
}
