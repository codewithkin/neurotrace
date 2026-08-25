import {
  AdEventType,
  MobileAds,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

import { getRewardedAdUnit, REQUEST_NON_PERSONALIZED } from "./config";

let sdkInitialized = false;

async function ensureSdkInitialized() {
  if (sdkInitialized) return;
  try {
    await MobileAds().initialize();
  } catch {
    // SDK may fail on unsupported platforms (e.g. Expo Go); ads simply won't show.
  }
  sdkInitialized = true;
}

/**
 * Show a rewarded video ad and resolve whether the user earned the reward.
 * Falls back to `true` when the ad SDK is unavailable (dev builds in Expo Go)
 * so the flow remains testable.
 */
export async function showRewardedAd(
  purpose: "pdfUnlock" | "trendExport",
): Promise<boolean> {
  await ensureSdkInitialized();

  let rewarded = false;
  let ad: RewardedAd;

  try {
    ad = RewardedAd.createForAdRequest(getRewardedAdUnit(purpose), {
      requestNonPersonalizedAdsOnly: REQUEST_NON_PERSONALIZED,
    });
  } catch {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const unsubscribeLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        ad.show().catch(() => resolve(true));
      },
    );

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        rewarded = true;
      },
    );

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      cleanup();
      resolve(rewarded);
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
      cleanup();
      // Don't punish the user for an ad infrastructure failure.
      resolve(true);
    });

    function cleanup() {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    }

    ad.load();
  });
}

export async function showPdfUnlockAd(): Promise<boolean> {
  return showRewardedAd("pdfUnlock");
}

export async function showTrendExportAd(): Promise<boolean> {
  return showRewardedAd("trendExport");
}
