import * as Updates from "expo-updates";

/**
 * EAS Updates service: silent OTA check on boot. Fetches and reloads
 * automatically when a new update is published. No-ops in Expo Go / dev.
 */
export async function checkForOtaUpdate(): Promise<void> {
  if (__DEV__) return;
  try {
    const check = await Updates.checkForUpdateAsync();
    if (!check.isAvailable) return;

    const fetched = await Updates.fetchUpdateAsync();
    if (fetched.isNew) {
      await Updates.reloadAsync();
    }
  } catch {
    // Updates are unavailable (Expo Go, offline, misconfigured project id).
  }
}
