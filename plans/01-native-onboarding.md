# Plan 01 — Native onboarding (5 steps)

Design anchors: `Light/Dark 01 Language`, `02 Intent`, `03 Report teaser`,
`04 Pace`, `05 Legal gate`. Shared spec: `systems/03-design-system.md`.

## T01 — Language grid + intent rows
- [x] `a3264b3`
- **Commit:** `feat(design): onboarding language grid and intent rows with staggered entrances`
- **Touches:** `app/onboarding.tsx`, `components/ui/buttons.tsx` (new),
  `global.css`, 10 locale files.
- **Done when:** steps 1–2 match design (grid cards, tint+checkmark selected
  state, icon intent rows, pill step dots, PrimaryButton), typechecks.

**Note (session 1):** T02 groundwork landed in `7db6ef2`:
`app-storage.ts` AssessmentPace now `"fast" | "two_sessions" | "list"`
(legacy list → fast) and all 10 locales gained pace
(`subtitle/sitting_title/desc/split_title/desc/daily_title/desc`) and legal
(`title/subtitle/bullet1..3_title/body`) keys. T02 itself (the screen
restyle) is still open.

## T02 — Pace (3-option mapping) + legal gate restyle
- [ ] `pending-T02`
- **Commit:** `feat(design): three-pace onboarding choice and read-this-first legal gate`
- **Depends on:** T01
- **Touches:** `apps/native/app/onboarding.tsx` (steps index 3 and 4 only)
- **Spec:**
  - Pace step: h1 "Pick your pace" + subtitle; three PressableScale rows
    (flash-outline / time-outline / moon-outline), title+desc, violet
    checkmark-circle when selected, tint bg + priBorder border on selection;
    Continue pinned bottom via mt-auto; Back ghost under it.
  - Mapping (D-003): sitting→`fast`; split→`two_sessions`; daily→
    `two_sessions`. Track a local `paceChoice` ("sitting"|"split"|"daily")
    for the visual selected state; persist mapped value via setPace.
  - Legal step: h1 from `onboarding.legal.title`, subtitle copy; three
    bullet rows (document-text/lock-closed/alert-circle icons, bold lead
    + body); checkbox card that flips to tint+priBorder when accepted;
    CTA label `onboarding.legal.cta` disabled until checked; Back ghost.
- **Done when:** both steps visually match Light/Dark 04 & 05; stored pace
  is one of fast/two_sessions; typechecks.

⚠️ **Edit-tool trap:** the file contains literal "←" characters. A previous
oldString replace failed silently on these. Re-read the file immediately
before editing; prefer replacing whole `{step === 3 && (...)}` blocks using
line-fresh content, or rewrite the file wholesale with Write.

## T03 — Part A/B pace behaviour: milestone break-state
- [ ] `pending-T03`
- **Commit:** `feat(assessment): two-sessions pace adds break state after Part A`
- **Depends on:** T02
- **Touches:** `apps/native/app/assessment/part-a.tsx`
- **Spec:** after Q6: if `getPace() === "two_sessions"` show break variant
  (title `assessment.milestone.break_title`, desc `break_desc`, primary
  "Keep going" (`milestone.continue_now`) → part-b, ghost "Continue later"
  (`milestone.break_cta`) → router.replace("/(tabs)/assess")). Else current
  single Continue → part-b. Needs 4 new i18n keys ×10 locales
  (`assessment.milestone.break_title/break_desc/break_cta/continue_now`).
- **Done when:** choosing split/daily pace yields the break state after Q6;
  fast keeps single continue; resume from Assess tab still works.

## i18n key inventory added this plan
pace.subtitle/sitting_*/split_*/daily_* ; legal.title/subtitle/
bullet1..3_title/body (committed with T02). milestone.break_* +
continue_now (commit with T03).
