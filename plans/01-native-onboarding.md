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
- [x] `63f3f14`
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

**Note (session 3):** built. Divergences from this plan's prose, all
resolved in favour of the design file per the precedence ladder:

1. *No Back control anywhere.* The spec said "Back ghost under it" for both
   steps; screens `Light/Dark 01`–`05` show no back affordance on any of
   the five. Implemented without one and registered `BackHandler` so
   Android hardware back still steps back (D-011). iOS has no way back —
   owner decision needed.
2. *Legal checkbox card does not tint on accept.* The spec said the card
   flips to tint + priBorder; `Light 05` draws the accepted state as plain
   `--card` + 1px `--border`, with only the 22px checkbox filling violet
   (radius 7, 16px tick). Implemented as drawn.
3. *Legal copy now matches the design.* `legal.cta` "Get Started" →
   "Start screening"; `legal.checkbox` → "I understand this is a screening
   tool and not a medical diagnosis." Both re-translated across all 10
   locales. This shortens a compliance-surface string — the WHO ASRS
   framing it dropped is now carried by `legal.subtitle` and the three
   bullets on the same screen, but the owner should confirm.
4. *Selected rows use a 1.5px border via `contentStyle`*, not an arbitrary
   `border-[1.5px]` class, because unknown utility classes fail silently
   here. `PressableScale` gained an optional `contentStyle` prop for this.

**Note (session 3) on T01:** steps 01–03 were rebuilt in the same pass
because the file was rewritten wholesale (the "←" trap below). Corrections
applied: step-dot geometry to the design's 5px gap / 18px padding; the
mojibake `â† Back` ghost buttons removed (see 1 above); step 02's trailing
chevron changed to the design's arrow; step 03's two perk rows given their
distinct icons (`document-text-outline`, `lock-closed-outline`) instead of
the same shield twice; step 03's bars redrawn at the design's 7px height /
4px radius through `AnimatedBar`'s new `radius` prop; every CTA block
pinned to the design's absolute 34px from the screen edge by subtracting
the safe-area inset the Container already applies.

**Still divergent from the design, deliberately left alone (T04 below):**
step 02 ships our five intent options with our copy; `Light 02` shows four
with different wording ("I think this might be me", "A clinician asked me
to", "Tracking over time", "Just curious"). Adopting the design's set drops
"Supporting someone else" — a product decision, not a styling one.
Step 03's heading and subtitle copy likewise still differ from
`Light 03`.

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


## T04 — Reconcile onboarding copy with the design (owner decision first)
- [ ] `pending-T04`
- **Commit:** `feat(design): adopt the design's intent options and teaser copy`
- **Depends on:** T02
- **Blocked on:** owner confirming (a) dropping the fifth intent option
  "Supporting someone else" and (b) the shortened legal checkbox wording
  already shipped in T02.
- **Touches:** `apps/native/app/onboarding.tsx`, 10 locale files
- **Spec:** `Light 02` intent rows become four — idea-01 "I think this
  might be me" / stethoscope "A clinician asked me to" / chart-line
  "Tracking over time" / search "Just curious", with the design's
  descriptions. `Light 03` heading becomes "You end up with a<br>doctor-ready
  summary", subtitle "One page, scored, with your flagged answers listed."
- **Done when:** steps 02–03 read exactly as the design in all 10 locales.
