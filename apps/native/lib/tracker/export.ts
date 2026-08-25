import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { showTrendExportAd } from "@/lib/ads/rewarded";
import {
  getDailyEntries,
  getLatestResult,
  getResultHistory,
} from "@/lib/storage/app-storage";

function csvEscape(value: string | number | boolean): string {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildDailyCsv(): string {
  const header = [
    "date",
    "focus_level",
    "brain_fog",
    "executive_friction",
    "mood",
    "medication_taken",
  ].join(",");

  const rows = getDailyEntries().map((e) =>
    [
      e.date,
      e.focusLevel,
      e.brainFog,
      e.executiveFriction,
      e.mood,
      e.medicationTaken,
    ]
      .map(csvEscape)
      .join(","),
  );

  return [header, ...rows].join("\n");
}

function buildAssessmentCsv(): string {
  const header = ["completed_at", "part_a_score", "inattention", "hyperactivity"].join(
    ",",
  );

  const rows = getResultHistory().map((r) =>
    [
      r.completedAt,
      r.partAScore,
      r.inattentionRaw,
      r.hyperactivityRaw,
    ]
      .map(csvEscape)
      .join(","),
  );

  return [header, ...rows].join("\n");
}

/**
 * Retention monetization path: unlocks the monthly progress export
 * behind a rewarded video. Returns the shared file URI, or null when
 * there is nothing to export.
 */
export async function exportTrendsViaShare(): Promise<string | null> {
  if (getDailyEntries().length === 0 && !getLatestResult()) return null;

  const rewarded = await showTrendExportAd();
  if (!rewarded) return null;

  const csv = [
    "# NeuroTrace Daily Check-ins",
    buildDailyCsv(),
    "",
    "# NeuroTrace Assessment History",
    buildAssessmentCsv(),
  ].join("\n");

  const file = new File(Paths.cache, `neurotrace-export-${Date.now()}.csv`);
  file.create({ overwrite: true });
  file.write(csv);

  await Sharing.shareAsync(file.uri, {
    mimeType: "text/csv",
    dialogTitle: "NeuroTrace Export",
    UTI: "public.comma-separated-values-text",
  });

  return file.uri;
}
