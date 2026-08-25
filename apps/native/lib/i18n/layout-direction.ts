import * as Updates from "expo-updates";
import { I18nManager } from "react-native";

import { isRTL } from "@/lib/i18n/languages";

/**
 * Applies the layout direction for `languageCode`. Because React Native
 * only honors RTL changes on a fresh native render tree, this reloads
 * the app via EAS Updates when the direction flips. No-op in Expo Go.
 */
export async function applyLayoutDirection(languageCode: string): Promise<void> {
  const shouldForceRTL = isRTL(languageCode);
  if (I18nManager.isRTL === shouldForceRTL) return;

  I18nManager.allowRTL(shouldForceRTL);
  I18nManager.forceRTL(shouldForceRTL);

  try {
    await Updates.reloadAsync();
  } catch {
    // Expo Go / dev: direction applies after the next manual restart.
  }
}
