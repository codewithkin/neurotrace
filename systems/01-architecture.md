# Architecture

## Native (`apps/native`)

- Entry: `app/_layout.tsx` — GestureHandler > KeyboardProvider >
  AppThemeProvider > HeroUINativeProvider > `BootstrapGate` (OTA check,
  i18n init from stored language or device locale) > Stack.
- Routes: `/` redirect gate → `/onboarding` (5 steps) → `/(tabs)` =
  index (daily check-in), assess, history, settings. Push routes:
  `assessment/part-a`, `assessment/part-b`, `results`, `report` (modal).
- Storage: MMKV via `lib/storage/app-storage.ts` (typed accessors; see
  02-data-layer.md). No other persistence.
- Services: `lib/ads/*` (rewarded + UMP consent; ADS_ENABLED=false short-
  circuits all gates to unlocked), `lib/pdf/report-template.ts`,
  `lib/tracker/*`, `lib/notifications/*`, `lib/i18n/*`, `lib/updates/ota.ts`.
- Theming: uniwind CSS variables overridden in `global.css` under
  `:root { @variant light/dark }`. heroui-native brand colour is **accent**;
  `global.css` aliases `--color-primary: var(--accent)` so both class
  families work (D-001).

## Web (`apps/web`)

- Next.js App Router. `/` landing, `/app` browser screener (localStorage),
  `/app/result` dark results page with print summary, legal pages.
- Components: `screener.tsx`, `scale-pills.tsx`, `progress-bar.tsx`,
  `results-view.tsx`, `header.tsx`.

## Build/release

- EAS: `apps/native/eas.json` profiles development/preview/production;
  `requireCommit: true`; versionCode auto-increments server-side.
- `plugins/with-kotlin-version.js` pins Kotlin 2.3.0 (root ext + gradle
  properties) because play-services-ads 25.x ships Kotlin 2.3 metadata.
- OTA updates wired to EAS project 498bc086…; runtimeVersion policy appVersion.
