const { withGradleProperties } = require("expo/config-plugins");

/**
 * play-services-ads 25.x (pulled in by react-native-google-mobile-ads) ships
 * Kotlin metadata 2.3.0, which requires the Kotlin Gradle plugin 2.3+ to
 * compile against. Expo SDK 57 defaults to Kotlin 2.1.20, so we override:
 *
 * - `android.kotlinVersion`: overrides the expoLibs version-catalog entry
 *   ("kotlin") that resolves the kotlin-gradle-plugin classpath.
 * - `kotlinVersion`: keeps ExpoRootProjectPlugin / KSP lookup in sync.
 */
const KOTLIN_VERSION = "2.3.0";

module.exports = function withKotlinVersion(config) {
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
};
