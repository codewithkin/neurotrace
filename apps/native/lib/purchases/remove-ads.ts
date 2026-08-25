import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";

import { getAdsRemoved, setAdsRemoved } from "@/lib/storage/app-storage";

const REMOVE_ADS_ENTITLEMENT_ID = "remove_ads";
const REMOVE_ADS_PRODUCT_ID = process.env.EXPO_PUBLIC_IAP_REMOVE_ADS_ID ?? "remove_ads_monthly";

const RC_API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "",
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? "",
};

let configured = false;

/** Configure RevenueCat once with an anonymous app-user ID (no accounts). */
export function ensurePurchasesConfigured(): void {
  if (configured) return;
  const apiKey = Platform.select({ ios: RC_API_KEYS.ios, android: RC_API_KEYS.android });
  if (!apiKey) return; // Keys not set yet — IAP silently unavailable.
  try {
    Purchases.configure({ apiKey });
    configured = true;
  } catch {
    // Configure may throw on unsupported platforms.
  }
}

function hasRemoveAdsEntitlement(info: CustomerInfo | null): boolean {
  if (!info) return false;
  return Boolean(
    info.entitlements.active[REMOVE_ADS_ENTITLEMENT_ID] ||
      info.entitlements.active["remove ads"] ||
      info.activeSubscriptions.includes(REMOVE_ADS_PRODUCT_ID),
  );
}

/**
 * Syncs the local "ads removed" flag from the RevenueCat entitlement state.
 * Call during bootstrap so a restored subscription survives reinstalls.
 */
export async function syncRemoveAdsState(): Promise<void> {
  ensurePurchasesConfigured();
  if (!configured) return;
  try {
    const info = await Purchases.getCustomerInfo();
    const active = hasRemoveAdsEntitlement(info);
    if (active !== getAdsRemoved()) {
      setAdsRemoved(active);
    }
  } catch {
    // Offline / not configured — keep the locally cached flag.
  }
}

export interface PurchaseResult {
  success: boolean;
  /** User cancelled the native purchase sheet. */
  cancelled?: boolean;
}

/** Buys the Remove Ads monthly support subscription ($1.99/mo). */
export async function purchaseRemoveAds(): Promise<PurchaseResult> {
  ensurePurchasesConfigured();
  if (!configured) return { success: false };

  try {
    const offerings = await Purchases.getOfferings();
    const product =
      offerings.current?.availablePackages.find(
        (p) => p.product.identifier === REMOVE_ADS_PRODUCT_ID,
      ) ?? offerings.current?.monthly;

    if (!product) return { success: false };

    const result = await Purchases.purchaseProduct(product.product.identifier);
    const active = hasRemoveAdsEntitlement(result.customerInfo);
    setAdsRemoved(active);
    return { success: active };
  } catch (error: unknown) {
    const code = (error as { code?: unknown })?.code;
    if (code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      return { success: false, cancelled: true };
    }
    // Some SDK versions surface cancellation via userCancelled flag.
    const userCancelled = (error as { userCancelled?: boolean })?.userCancelled;
    return userCancelled ? { success: false, cancelled: true } : { success: false };
  }
}

/** Restores prior purchases and reflects the entitlement locally. */
export async function restorePurchases(): Promise<boolean> {
  ensurePurchasesConfigured();
  if (!configured) return false;
  try {
    const info = await Purchases.restorePurchases();
    const active = hasRemoveAdsEntitlement(info);
    setAdsRemoved(active);
    return active;
  } catch {
    return false;
  }
}
