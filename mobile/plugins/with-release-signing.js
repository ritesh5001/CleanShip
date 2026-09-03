const { withAppBuildGradle } = require("expo/config-plugins");

/**
 * Signs release builds with the project's own keystore instead of the debug one.
 *
 * The generated `android/` directory is disposable — `expo prebuild` rewrites
 * it — so editing app/build.gradle by hand would work exactly once. This
 * re-applies the change on every prebuild, which is what makes a local release
 * build repeatable rather than a thing someone did on their laptop in August.
 *
 * The credentials are NOT here. They come from Gradle properties passed at
 * build time (see scripts/build-apk.sh), so nothing secret is in the repo or
 * in the generated project. When they are absent the build falls back to the
 * debug key and says so — a developer running `assembleRelease` by hand still
 * gets an APK rather than a confusing failure.
 */
const SIGNING_CONFIG = `
        release {
            // Injected by plugins/with-release-signing.js.
            // Values come from -P flags; see scripts/build-apk.sh.
            if (project.hasProperty('CLEANTRACK_STORE_FILE')) {
                storeFile file(project.property('CLEANTRACK_STORE_FILE'))
                storePassword project.property('CLEANTRACK_STORE_PASSWORD')
                keyAlias project.property('CLEANTRACK_KEY_ALIAS')
                keyPassword project.property('CLEANTRACK_KEY_PASSWORD')
            }
        }
`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents;

    /* Add a `release` signing config beside the template's `debug` one. */
    if (!contents.includes("CLEANTRACK_STORE_FILE")) {
      contents = contents.replace(
        /(signingConfigs\s*\{)/,
        `$1${SIGNING_CONFIG}`,
      );
    }

    /* Point the release BUILD TYPE at it, but only when the credentials were
       actually supplied — otherwise Gradle fails on a null storeFile, which is
       a worse outcome than a build signed with the debug key.
       
       Scoped to the buildTypes section deliberately. The signingConfigs block
       above now also contains the word `release`, and a regex run over the
       whole file matches that one first — which silently patches the DEBUG
       build type and leaves release signed with the debug key. Exactly
       backwards, and invisible until someone inspects the APK's certificate. */
    const buildTypesAt = contents.indexOf("buildTypes {");
    if (buildTypesAt !== -1) {
      const head = contents.slice(0, buildTypesAt);
      const tail = contents
        .slice(buildTypesAt)
        .replace(
          /(release\s*\{[^]*?)signingConfig signingConfigs\.debug/,
          "$1signingConfig project.hasProperty('CLEANTRACK_STORE_FILE') ? signingConfigs.release : signingConfigs.debug",
        );
      contents = head + tail;
    }

    cfg.modResults.contents = contents;
    return cfg;
  });
};
