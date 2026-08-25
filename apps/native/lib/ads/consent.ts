import { AdsConsent } from "react-native-google-mobile-ads";

let consentResolved = false;
let canRequestAdsCache = false;

/**
 * Google UMP consent flow (GDPR / regulated regions).
 * Runs once before any ad request. Silent in Expo Go where the
 * native consent module is unavailable.
 *
 * Returns whether ad requests are allowed after consent gathering.
 */
export async function ensureAdsConsent(): Promise<boolean> {
  if (consentResolved) return canRequestAdsCache;

  try {
    await AdsConsent.requestInfoUpdate();
    await AdsConsent.loadAndShowConsentFormIfRequired();
    const info = await AdsConsent.getConsentInfo();
    canRequestAdsCache = info.canRequestAds;
  } catch {
    // Consent module unavailable or form dismissed — default to
    // non-personalized serving rather than blocking the user.
    canRequestAdsCache = true;
  }

  consentResolved = true;
  return canRequestAdsCache;
}
