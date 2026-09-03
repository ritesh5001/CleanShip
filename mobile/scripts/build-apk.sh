#!/usr/bin/env bash
#
# Builds a signed release APK locally, with no cloud service involved.
#
# Needs: JDK 17 and the Android SDK (platform 36, build-tools 36). Both are
# already on the machine this was written on; `sdkmanager --list_installed`
# will tell you what you have.
#
# The signing credentials live in credentials/keystore.env, which is
# gitignored. They are passed to Gradle as -P properties rather than written
# into the generated project, so nothing secret ends up in android/ — which is
# itself disposable and rewritten by `expo prebuild`.
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"

if [ ! -f credentials/keystore.env ]; then
  echo "Missing credentials/keystore.env — see README, 'Building an APK'." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; . credentials/keystore.env; set +a

: "${ANDROID_HOME:?ANDROID_HOME is not set — install the Android SDK command-line tools}"

# Regenerate the native project so the signing plugin is applied and the build
# reflects app.json.
#
# NOT --clean by default: that deletes android/ including Gradle's incremental
# state, which turns every rebuild into a full one — minutes instead of
# seconds, for no benefit when only JS or app.json changed. The config plugins
# re-apply either way, and they are written to be safe to run twice.
#
# Pass --clean when the native project needs rebuilding from scratch: after
# adding a dependency with native code, or when a build fails in a way that
# smells like stale generated files.
PREBUILD_ARGS=(--platform android)
if [ "${1:-}" = "--clean" ]; then
  echo "==> prebuild (clean)"
  PREBUILD_ARGS+=(--clean)
else
  echo "==> prebuild"
fi
npx expo prebuild "${PREBUILD_ARGS[@]}"

cd android

# Generate the autolinking sources before anything asks CMake to compile.
#
# OnLoad.cpp does `#include <autolinking.h>`, and that header — along with the
# Android-autolinking.cmake that CMake reads — is produced by a Gradle task.
# In an assembleRelease graph that task does not reliably run before the native
# build configures, so a clean build dies seven minutes in with:
#
#   fatal error: 'autolinking.h' file not found
#
# Running it explicitly first is deterministic and costs a few seconds. It is
# a no-op (UP-TO-DATE) once the files exist.
echo "==> gradle generateAutolinkingNewArchitectureFiles"
./gradlew :app:generateAutolinkingNewArchitectureFiles --no-daemon

echo "==> gradle assembleRelease"
./gradlew assembleRelease --no-daemon \
  -PCLEANTRACK_STORE_FILE="$ROOT/credentials/$CLEANTRACK_STORE_FILE" \
  -PCLEANTRACK_STORE_PASSWORD="$CLEANTRACK_STORE_PASSWORD" \
  -PCLEANTRACK_KEY_ALIAS="$CLEANTRACK_KEY_ALIAS" \
  -PCLEANTRACK_KEY_PASSWORD="$CLEANTRACK_KEY_PASSWORD"

APK="$ROOT/android/app/build/outputs/apk/release/app-release.apk"
if [ ! -f "$APK" ]; then
  echo "Build finished but no APK at $APK" >&2
  exit 1
fi

mkdir -p "$ROOT/build"
OUT="$ROOT/build/cleantrack-$(date +%Y%m%d-%H%M).apk"
cp "$APK" "$OUT"

echo
echo "APK: $OUT"
echo "Size: $(du -h "$OUT" | cut -f1)"
echo
echo "Install on a connected phone with:  adb install -r \"$OUT\""
