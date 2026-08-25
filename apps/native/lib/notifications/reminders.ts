import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { ensureNotificationPermission } from "./permissions";

export const REASSESSMENT_NOTIFICATION_ID = "reassessment-30d";

const ANDROID_CHANNEL_ID = "reminders";

/**
 * Local reminders are silent, non-promotional nudges stored entirely on-device.
 */
async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Re-assessment Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    showBadge: false,
  });
}

/**
 * Schedules the 30-day re-assessment local notification.
 * Returns false when permission was denied or scheduling failed.
 */
export async function scheduleReassessmentReminder(
  title: string,
  body: string,
  daysFromNow = 30,
): Promise<boolean> {
  const permitted = await ensureNotificationPermission();
  if (!permitted) return false;

  try {
    await ensureAndroidChannel();
    await Notifications.cancelScheduledNotificationAsync(
      REASSESSMENT_NOTIFICATION_ID,
    ).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier: REASSESSMENT_NOTIFICATION_ID,
      content: { title, body, sound: false },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000),
        channelId: Platform.OS === "android" ? ANDROID_CHANNEL_ID : undefined,
      },
    });
    return true;
  } catch {
    return false;
  }
}

/** Removes the scheduled re-assessment reminder, if any. */
export async function cancelReassessmentReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    REASSESSMENT_NOTIFICATION_ID,
  ).catch(() => {});
}
