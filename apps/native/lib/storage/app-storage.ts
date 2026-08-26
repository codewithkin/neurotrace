import { ASRSResponse, ASRSScore } from "@/lib/asrs/scoring";
import { getDeviceLanguage } from "@/lib/i18n/device-locale";

import { mmkv } from "./mmkv";

/**
 * - fast:          single-question auto-advance through all 18 items
 * - two_sessions:  Part A now, Part B resumed later (also covers "a few a day")
 * - list:          legacy full-list choice, treated like `fast`
 */
export type AssessmentPace = "fast" | "two_sessions" | "list";

export interface StoredAssessmentResult extends ASRSScore {
  id: string;
  completedAt: string; // ISO date
  /** Full 18-item response matrix, kept for the PDF export. */
  responses: ASRSResponse[];
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  focusLevel: number; // 0-10
  brainFog: number; // 0-10
  executiveFriction: number; // 0-10
  mood: number; // 0-10
  medicationTaken: boolean;
}

const KEYS = {
  onboardingCompleted: "onboarding.completed",
  language: "app.language",
  pace: "assessment.pace",
  responses: "assessment.responses",
  latestResult: "results.latest",
  resultHistory: "results.history",
  reportUnlockedFor: "report.unlockedFor",
  dailyEntries: "tracker.entries",
  reminderEnabled: "settings.reminderEnabled",
  adsRemoved: "settings.adsRemoved",
  userAlias: "profile.userAlias",
} as const;

function getString(key: string): string | undefined {
  return mmkv.getString(key);
}

function setObject<T>(key: string, value: T) {
  mmkv.set(key, JSON.stringify(value));
}

function getObject<T>(key: string): T | undefined {
  const raw = getString(key);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

// --- Onboarding ---

export function getOnboardingCompleted(): boolean {
  return mmkv.getBoolean(KEYS.onboardingCompleted) ?? false;
}

export function setOnboardingCompleted(value: boolean) {
  mmkv.set(KEYS.onboardingCompleted, value);
}

// --- Language & pace ---

export function getLanguageCode(): string {
  return getString(KEYS.language) ?? "";
}

export function setLanguageCode(code: string) {
  mmkv.set(KEYS.language, code);
}

export function getPace(): AssessmentPace {
  const stored = getString(KEYS.pace) as AssessmentPace | undefined;
  if (stored === "two_sessions") return "two_sessions";
  return "fast"; // "fast" and legacy "list" both use the auto-advance flow
}

export function setPace(pace: AssessmentPace) {
  mmkv.set(KEYS.pace, pace);
}

// --- In-progress assessment state ---

export function getResponses(): ASRSResponse[] {
  return getObject<ASRSResponse[]>(KEYS.responses) ?? [];
}

export function saveResponses(responses: ASRSResponse[]) {
  setObject(KEYS.responses, responses);
}

export function clearResponses() {
  mmkv.remove(KEYS.responses);
}

// --- Results ---

export function getLatestResult(): StoredAssessmentResult | undefined {
  return getObject<StoredAssessmentResult>(KEYS.latestResult);
}

export function getResultHistory(): StoredAssessmentResult[] {
  return getObject<StoredAssessmentResult[]>(KEYS.resultHistory) ?? [];
}

export function storeResult(result: StoredAssessmentResult) {
  setObject(KEYS.latestResult, result);
  const history = getResultHistory().filter((r) => r.id !== result.id);
  history.push(result);
  history.sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  setObject(KEYS.resultHistory, history.slice(-24));
}

// --- Report unlock gating ---

export function isReportUnlocked(resultId?: string): boolean {
  if (!resultId) return false;
  return getString(KEYS.reportUnlockedFor) === resultId;
}

export function unlockReport(resultId: string) {
  mmkv.set(KEYS.reportUnlockedFor, resultId);
}

// --- Daily tracker entries ---

export function getDailyEntries(): DailyEntry[] {
  return getObject<DailyEntry[]>(KEYS.dailyEntries) ?? [];
}

export function upsertDailyEntry(entry: DailyEntry) {
  const entries = getDailyEntries().filter((e) => e.date !== entry.date);
  entries.push(entry);
  entries.sort((a, b) => a.date.localeCompare(b.date));
  setObject(KEYS.dailyEntries, entries.slice(-365));
}

// --- Settings ---

export function getReminderEnabled(): boolean {
  return mmkv.getBoolean(KEYS.reminderEnabled) ?? false;
}

export function setReminderEnabled(value: boolean) {
  mmkv.set(KEYS.reminderEnabled, value);
}

export function getAdsRemoved(): boolean {
  return mmkv.getBoolean(KEYS.adsRemoved) ?? false;
}

export function setAdsRemoved(value: boolean) {
  mmkv.set(KEYS.adsRemoved, value);
}

// --- User alias (local PDF customization only, never transmitted) ---

export function getUserAlias(): string {
  return getString(KEYS.userAlias) ?? "";
}

export function setUserAlias(alias: string) {
  mmkv.set(KEYS.userAlias, alias.trim());
}

// --- Danger zone ---

export function clearAllData() {
  mmkv.clearAll();
}
