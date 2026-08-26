const { withGradleProperties } = require("expo/config-plugins");

/**
 * play-services-ads 25.x (pulled in by react-native-google-mobile-ads) ships
 * Kotlin metadata 2.3.0, which requires the Kotlin Gradle plugin 2.3+ to
 * compile against. Expo SDK 57 defaults to Kotlin 2.1.20, so we override it
 * via the `kotlinVersion` gradle property (honored by ExpoRootProjectPlugin).
 */
const KOTLIN_VERSION = "2.3.0";

module.exports = function withKotlinVersion(config) {
  return withGradleProperties(config, (config) => {
    const items = config.modResults;
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].type === "property" && items[i].key === "kotlinVersion") {
        items.splice(i, 1);
      }
    }
    items.push({ type: "property", key: "kotlinVersion", value: KOTLIN_VERSION });
    return config;
  });
};
