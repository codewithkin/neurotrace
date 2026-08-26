# Data layer

All persistence is MMKV (`createMMKV({ id: "neurotrace-storage" })`) accessed
only through `lib/storage/app-storage.ts`.

## Keys and shapes

| Key | Shape | Notes |
|---|---|---|
| `onboarding.completed` | bool | gates `/` redirect |
| `app.language` | string | BCP47; "" ⇒ detect device locale |
| `assessment.pace` | `"fast" \| "two_sessions" \| "list"` | legacy "list" behaves as fast |
| `assessment.responses` | `{questionId,value}[]` | in-progress autosave; cleared on calculate |
| `results.latest` | StoredAssessmentResult | includes full 18-item responses for PDF |
| `results.history` | StoredAssessmentResult[] (max 24, sorted) | feeds History tab + sessions list |
| `report.unlockedFor` | string (result id) | rewarded-ad gate; bypassed while ADS_ENABLED=false |
| `tracker.entries` | DailyEntry[] (max 365) | one per YYYY-MM-DD |
| `settings.reminderEnabled` | bool | 30-day re-screen notification |
| `settings.dailyReminderEnabled` | **planned** (T-11) | repeating daily check-in nudge |
| `settings.adsRemoved` | bool | manual toggle only until IAP returns (D-004) |
| `profile.userAlias` | string | local PDF header only |

StoredAssessmentResult = ASRSScore fields (`partAScore`, `isPartAPositive`,
`inattentionRaw/Max`, `hyperactivityRaw/Max`, `classificationKey`) +
`id: asrs-<ts>`, `completedAt: ISO`, `responses[]`.

## Invariants

- Scoring lives only in `lib/asrs/scoring.ts`; thresholds per 01-project.md §3.
- Part A/B screens autosave after every answer; calculation requires 18
  responses and must clear `assessment.responses`.
- Deleting all data = `mmkv.clearAll()` → router.replace("/").

## Web parity

Browser screener keeps progress in localStorage only; same scoring function
duplicated at `apps/web/src/lib/asrs.ts` — keep the two in sync if either
changes (Pillar 6 candidate for a shared check).
