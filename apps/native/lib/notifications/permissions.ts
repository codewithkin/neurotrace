import * as Notifications from "expo-notifications";

/**
 * Ensures notification permission before scheduling local reminders.
 * Returns whether notifications may be scheduled.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  if (!current.canAskAgain) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}
