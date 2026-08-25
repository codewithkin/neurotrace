import {
  DailyEntry,
  getDailyEntries,
  upsertDailyEntry,
} from "@/lib/storage/app-storage";

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getTodayEntry(): DailyEntry | undefined {
  return getDailyEntries().find((e) => e.date === todayKey());
}

export function saveTodayEntry(
  entry: Omit<DailyEntry, "date">,
): DailyEntry {
  const full: DailyEntry = { ...entry, date: todayKey() };
  upsertDailyEntry(full);
  return full;
}

/**
 * Consecutive-day streak ending today (or yesterday if today isn't logged yet).
 */
export function calculateStreak(): number {
  const dates = new Set(getDailyEntries().map((e) => e.date));
  if (dates.size === 0) return 0;

  const cursor = new Date();
  if (!dates.has(todayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1); // grace: streak alive until day ends
  }

  let streak = 0;
  while (dates.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
