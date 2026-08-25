/**
 * Master switch for the ads monetization layer.
 *
 * V1.0 ships WITHOUT live ads (Play Store submission happens before AdMob
 * account approval). All rewarded-ad entry points short-circuit to a free
 * unlock while this is `false`. Flip to `true` in v1.1 once production
 * AdMob IDs are configured.
 */
export const ADS_ENABLED = false;

/**
 * AdMob identifiers.
 *
 * Defaults are Google's official TEST IDs so the app is safe to run during
 * development. Before store submission, replace these with production IDs
 * via EXPO_PUBLIC_AD_APP_ID_ANDROID / EXPO_PUBLIC_AD_APP_ID_IOS /
 * EXPO_PUBLIC_AD_UNIT_REWARDED_* env vars.
 */
const ANDROID_TEST_APP_ID = "ca-app-pub-3940256099942544~3347511713";
const IOS_TEST_APP_ID = "ca-app-pub-3940256099942544~1458002511";
const ANDROID_TEST_REWARDED = "ca-app-pub-3940256099942544/5224354917";
const IOS_TEST_REWARDED = "ca-app-pub-3940256099942544/1712485313";

export const ADMOB_APP_ID_ANDROID =
  process.env.EXPO_PUBLIC_AD_APP_ID_ANDROID ?? ANDROID_TEST_APP_ID;
export const ADMOB_APP_ID_IOS =
  process.env.EXPO_PUBLIC_AD_APP_ID_IOS ?? IOS_TEST_APP_ID;

/** Non-personalized ads by default (no aggressive ATT prompt). */
export const REQUEST_NON_PERSONALIZED = true;

export const REWARDED_AD_UNIT_IDS = {
  pdfUnlock: {
    android: process.env.EXPO_PUBLIC_AD_UNIT_PDF_UNLOCK_ANDROID ?? ANDROID_TEST_REWARDED,
    ios: process.env.EXPO_PUBLIC_AD_UNIT_PDF_UNLOCK_IOS ?? IOS_TEST_REWARDED,
  },
  trendExport: {
    android: process.env.EXPO_PUBLIC_AD_UNIT_TREND_EXPORT_ANDROID ?? ANDROID_TEST_REWARDED,
    ios: process.env.EXPO_PUBLIC_AD_UNIT_TREND_EXPORT_IOS ?? IOS_TEST_REWARDED,
  },
} as const;

import { Platform } from "react-native";

export function getRewardedAdUnit(purpose: keyof typeof REWARDED_AD_UNIT_IDS): string {
  return Platform.select({
    android: REWARDED_AD_UNIT_IDS[purpose].android,
    ios: REWARDED_AD_UNIT_IDS[purpose].ios,
    default: REWARDED_AD_UNIT_IDS[purpose].android,
  })!;
}
