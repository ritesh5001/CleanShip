#!/usr/bin/env bash
#
# Compresses the source hero videos for web delivery.
#
# The sources are 1920x1080 at 4.4-9 Mbps (8-20 MB each) — fine as masters,
# far too heavy to autoplay behind a hero. These play muted, looping, at small
# on-screen size behind a navy scrim, so they can take aggressive compression
# that would be unacceptable for foreground video.
#
# Outputs, per clip:
#   public/videos/<slug>.webm  — VP9, primary (roughly 30-40% smaller)
#   public/videos/<slug>.mp4   — H.264, fallback for Safari/older browsers
#   public/posters/<slug>.jpg  — still shown before playback (next/image
#                                 converts this to AVIF/WebP on request)
#
# The poster is what the browser paints first and is therefore the LCP
# candidate — it is encoded at higher quality than the video deliberately.
#
# Usage: ./scripts/compress-videos.sh

set -euo pipefail

SRC="videos"
OUT_V="public/videos"
OUT_P="public/posters"

mkdir -p "$OUT_V" "$OUT_P"

# 720p is ample behind a scrim; 25fps reads as smooth for ambient footage.
WIDTH=1280
FPS=25

# source filename -> output slug (matches the service slug in lib/services.ts)
map_slug() {
  case "$1" in
    "Hydroblasting")                  echo "hydroblasting" ;;
    "In-Water class survey")          echo "in-water-class-survey" ;;
    "NDT & Repair")                   echo "ndt-and-repair" ;;
    "NDT Inspection")                 echo "ndt-inspection" ;;
    "Offshore")                       echo "offshore" ;;
    "Painting")                       echo "marine-painting" ;;
    "Propeller Super Polishing")      echo "propeller-super-polishing" ;;
    "Remote Inspection Tech")         echo "remote-inspection-technology" ;;
    "Thruster Cleaning & Polishing")  echo "thruster-cleaning-polishing" ;;
    "Underwater Hull Cleaning")       echo "underwater-hull-cleaning" ;;
    *)                                echo "" ;;
  esac
}

total_before=0
total_after=0

for f in "$SRC"/*.mp4; do
  base="$(basename "$f" .mp4)"
  slug="$(map_slug "$base")"

  if [ -z "$slug" ]; then
    echo "!! no slug mapping for '$base' — skipped"
    continue
  fi

  before=$(stat -f%z "$f")
  total_before=$((total_before + before))

  echo "→ $base  ($slug)"

  # ---- MP4 / H.264 -------------------------------------------------------
  # -an strips audio (these sources have none, but this guarantees it).
  # +faststart moves the moov atom to the front so playback can begin before
  # the whole file has arrived.
  ffmpeg -y -loglevel error -i "$f" \
    -vf "scale=${WIDTH}:-2:flags=lanczos,fps=${FPS}" \
    -c:v libx264 -profile:v high -crf 30 -preset slow \
    -pix_fmt yuv420p -movflags +faststart -an \
    "$OUT_V/$slug.mp4"

  # ---- WebM / VP9 --------------------------------------------------------
  # row-mt + good deadline keeps encode time sane at this resolution.
  ffmpeg -y -loglevel error -i "$f" \
    -vf "scale=${WIDTH}:-2:flags=lanczos,fps=${FPS}" \
    -c:v libvpx-vp9 -crf 38 -b:v 0 -deadline good -cpu-used 2 -row-mt 1 \
    -pix_fmt yuv420p -an \
    "$OUT_V/$slug.webm"

  # ---- Poster still ------------------------------------------------------
  # Taken ~1.5s in; the opening frames are often a fade or a blank plate.
  # Only a JPEG is produced — next/image negotiates AVIF/WebP from it at
  # request time, so encoding those here would be duplicated work.
  ffmpeg -y -loglevel error -ss 1.5 -i "$f" -frames:v 1 \
    -vf "scale=1600:-2:flags=lanczos" -q:v 3 "$OUT_P/$slug.jpg"

  after_mp4=$(stat -f%z "$OUT_V/$slug.mp4")
  after_webm=$(stat -f%z "$OUT_V/$slug.webm")
  total_after=$((total_after + after_webm))

  printf "   %s -> mp4 %sKB · webm %sKB\n" \
    "$((before / 1024))KB" "$((after_mp4 / 1024))" "$((after_webm / 1024))"
done

echo ""
echo "source total : $((total_before / 1024 / 1024)) MB"
echo "webm total   : $((total_after / 1024 / 1024)) MB"

# Record which format won per clip so <source> order is always optimal.
node scripts/build-video-manifest.mjs
