# Roadmap

Order of attack for the design-implementation effort (designs source:
`designs/NeuroTrace Screens.dc.html`, 15 native screens light+dark + 3 web).

| Plan | Area | State |
|---|---|---|
| `01-native-onboarding.md` | Onboarding steps 1–5 restyle | T01 done, T02 next |
| `02-native-assessment.md` | Part A, milestone, Part B, calculating, results, report | not started |
| `03-native-tabs.md` | Assess tab build-out, check-in, history, settings, tab bar | not started |
| `04-web.md` | Landing, screener, result pages | not started |
| `05-audit.md` | Per-screen design audit both themes + parity checks | blocked by all |
| `06-ads.md` | AdMob integration: dependency, config, unit IDs | **pending AdMob verify** |

## Open monetization thread (Session 5, 28 Aug 2026)

AdMob is asked to verify `com.codewithkin.neurotrace` (app-ads.txt live at
`https://neurotrace.gamesforstrangers.lol/app-ads.txt`, verified 200/plain).
**When the owner confirms "verified"**, you will:

1. Install the ad dependency **`react-native-google-mobile-ads@^16.3.4`** —
   the exact version the Word Hug project uses (`C:\Users\kinzi\Desktop\projects\word-hug`).
   Prefer `npx expo install react-native-google-mobile-ads` and confirm it
   resolves ≥16.3.4 with an SDK-57-compatible build; pin if needed.
2. Add the `react-native-google-mobile-ads` plugin to `apps/native/app.json`
   (androidAppId / iosAppId from the NeuroTrace AdMob app entry —
   NOT copied from Word Hug).
3. Keep `ADS_ENABLED=false` for V1 (gates already short-circuit).
4. Then ask the owner which **ad units to create** (rewarded / interstitial /
   banner) and collect their **unit IDs** for implementation — mock the
   structure in `systems/ads.md` (mirror Word Hug's `systems/ads.md`).
5. Create `plans/06-ads.md` and implement.

Groundwork already committed: palette tokens + motion primitives +
atoms (`446e6e9`), onboarding language/intent (`a3264b3`), pace/legal
storage + locale groundwork (`7db6ef2`). Working tree is clean.
