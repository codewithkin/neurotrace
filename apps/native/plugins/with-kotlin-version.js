const { withGradleProperties, withProjectBuildGradle } = require("expo/config-plugins");

/**
 * play-services-ads 25.x (pulled in by react-native-google-mobile-ads) ships
 * Kotlin metadata 2.3.0, which requires the Kotlin Gradle plugin 2.3+ to
 * compile against. Expo SDK 57 defaults to Kotlin 2.1.20.
 *
 * Three coordinated overrides:
 *
 * 1. gradle.properties `android.kotlinVersion` -> overrides the expoLibs
 *    version-catalog entry ("kotlin") used by ExpoRootProjectPlugin / KSP.
 * 2. gradle.properties `kotlinVersion`        -> keeps KSP lookup consistent.
 * 3. root build.gradle pins `ext.kotlinVersion` as the FIRST statement and
 *    gives the root classpath an explicit version. Libraries such as
 *    react-native-google-mobile-ads read `rootProject.ext.kotlinVersion`
 *    from their own buildscript blocks; under EAS's parallel project
 *    configuration those can evaluate before Expo's root plugin runs, so
 *    the ext property must exist before anything else.
 */
const KOTLIN_VERSION = "2.3.0";
const MARKER = "// neurotrace-kotlin-pin";

function withKotlinPin(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language !== "groovy") return config;
    let contents = config.modResults.contents;
    if (!contents.includes(MARKER)) {
      contents =
        MARKER +
        "\n// Must precede everything: libraries' buildscript blocks read" +
        " rootProject.ext.kotlinVersion.\n" +
        "ext.kotlinVersion = \"" + KOTLIN_VERSION + "\"\n\n" +
        contents.replace(
          /classpath\('org\.jetbrains\.kotlin:kotlin-gradle-plugin'\)/,
          'classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$ext.kotlinVersion")'
        );
    }
    config.modResults.contents = contents;
    return config;
  });
}

function withKotlinProperties(config) {
  return withGradleProperties(config, (config) => {
    const items = config.modResults;
    const keys = ["kotlinVersion", "android.kotlinVersion"];
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].type === "property" && keys.includes(items[i].key)) {
        items.splice(i, 1);
      }
    }
    items.push({ type: "property", key: "android.kotlinVersion", value: KOTLIN_VERSION });
    items.push({ type: "property", key: "kotlinVersion", value: KOTLIN_VERSION });
    return config;
  });
}

module.exports = function withKotlinVersion(config) {
  return withKotlinProperties(withKotlinPin(config));
};
