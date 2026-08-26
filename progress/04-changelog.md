# Changelog

## Session 1 (26 Aug 2026) — product build + build-infra fixes

**Built the entire V1 app from the blueprint, then unblocked the Play
production build.**

### Product (commits ed900bb…63e184f, 20 todos)
- ASRS v1.1 scoring engine + 18-item bank; MMKV storage layer.
- Onboarding (language/intent/teaser/pace/legal), Part A/B with autosave,
  milestone, calculating interstitial, results with trait bars, doctor PDF
  report (preview/share/save/print + 30-day reminder), daily check-in with
  streaks, history chart, settings, Brown Noise cross-promo card.
- i18n: all 10 locales incl. RTL Arabic; device-locale detection.
- Monetization scaffolding: AdMob rewarded + UMP consent (ADS_ENABLED=false
  in V1 → gates short-circuit unlocked). RevenueCat was added then removed
  for V1 (565659e).
- Web: browser ASRS screener with reveal flow + printable summary.

### Build infra (792563e…f275acc)
- Kotlin pinned to 2.3.0 via `plugins/with-kotlin-version.js` because
  play-services-ads 25.4.0 ships Kotlin 2.3 metadata that KGP 2.1 cannot
  read. Three iterations: catalog override alone didn't move the compiler;
  `$ext.kotlinVersion` inside buildscript failed (delegate scoping);
  **inline literal version in root classpath + first-line
  `ext.kotlinVersion = "2.3.0"` worked** (aedcf9c).
- EAS project id/owner linked; .easignore added (replaces .gitignore for
  uploads); assets shrunk; dark splash reference removed after asset delete.

## Session 2 (26 Aug 2026) — design implementation started, scaffolded this workflow system

**Implemented the design-system foundation and onboarding steps 1–2 from the
new designs folder; scaffolded plans/systems/progress so the work can
continue across chats.**

### Done
- Extracted full design language from NeuroTrace Screens.dc.html into
  `systems/03-design-system.md` (palette both themes, ramp, type, motion).
- `global.css` overrides heroui-native raw vars for light/dark; discovered
  heroui has NO primary token — brand is accent; aliased
  `--color-primary: var(--accent)` (D-001). Prior code using bg-primary had
  been silently rendering without violet.
- Motion primitives: FadeSlideIn (staggered), PressableScale, AnimatedBar;
  atoms: SectionLabel/MonoValue/BadgeChip; PrimaryButton/GhostButton/
  OutlineButton/StepDots.
- Onboarding steps 1–2 rebuilt per design (language grid 10 locales w/
  English subtitles, intent rows w/ icons+descriptions), staggered
  entrances (a3264b3).

### Divergences from the designer
Logged as D-002/D-003/D-004/D-005/D-006/D-007/D-009 in
`systems/09-decisions.md`. Owner approved via Q&A.

### What is verified / not
- Typecheck green at every commit. Nothing rendered on a device this
  session — visual audit pending (plans/05).
- Locale files rewritten via PowerShell round-trip: verified UTF-8 no-BOM
  content byte-level for de/ja/ar; other locales spot-checked only.

### Uncommitted on disk right now
`app-storage.ts` (AssessmentPace + two_sessions mapping) and all 10 locale
files (pace subtitle/sitting/split/daily + legal title/subtitle/bullets).
These are the groundwork of plan 01 T02 — commit them WITH that todo.

### Next
1. `plans/01-native-onboarding.md` T02 (pace + legal restyle) — note the
   Edit-tool trap about literal ← arrows; re-read before editing.
2. Then T03, then `plans/02`, `03`, `04`, `05`.
