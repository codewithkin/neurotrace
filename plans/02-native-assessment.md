# Plan 02 — Native assessment flow (Part A → results → report)

Anchors: `Light/Dark 06 Part A question`, `07 Milestone`, `08 Part B
question`, `09 Calculating`, `10 Results`, `11 Doctor report`.
Depends on: 01-native-onboarding T02 (pace values in storage).

## T01 — Part A question restyle + animated progress
- [x] `9578f45`
- **Commit:** `feat(design): Part A screen per design with ramp pills and animated progress`
- **Touches:** `app/assessment/part-a.tsx`, maybe
  `components/assessment/animated-progress-bar.tsx` (replace with
  AnimatedBar-based fill), `components/assessment/response-pills.tsx`.
- **Spec:** top progress bar (8px, radius 4, track bg, primary fill) with
  mono caps label under it: `PART A · {n} OF 6`
  (`assessment.progress` reworked or new key); centre block: muted eyebrow
  "Over the past six months" (`assessment.part_a_intro` shortened copy ok)
  then question 26px/36px w600; ResponsePills restyled: full-width rows,
  radius 16, py≈17px px≈20px, FREQ_RAMP bg @ .92, white 16px w600 label,
  mono numeral right at opacity .75; selected pill gets double ring (white
  ring inside ink ring) like Web 2; footer tick icon +
  `assessment.answers_saved`. Keyed FadeSlideIn on question change.
- **Done when:** matches Light/Dark 06; auto-advance + autosave unchanged.

## T02 — Milestone screen restyle (+ break-state from plan 01 T03)
- [x] `9578f45`
- **Commit:** `feat(design): milestone card per design with spring pop`
- **Spec:** dimmed (opacity .35) progress bar + mono label
  "PART A COMPLETE · 6 OF 6"; centered card radius 24 p-8: 74px rounded-3xl
  tint tile with trophy/flag Ionicon (spring pop scale-in), title
  milestone_badge, sub line, primary Continue. Pace-aware variants from
  plan 01 T03.
- **Done when:** matches Light/Dark 07 both themes.

## T03 — Part B restyle
- [x] `9578f45`
- **Commit:** `feat(design): Part B screen aligned to Part A language`
- **Touches:** `app/assessment/part-b.tsx`
- **Spec:** identical question layout to Part A but total 12, header label
  "PART B · {n} OF 12"; keep encouraging banner only before Q1; Calculate
  CTA appears after all 18 answered (mono-styled? keep PrimaryButton).
  Remove old calculate guard duplication if any.
- **Done when:** matches Light/Dark 08; scoring path untouched.

## T04 — Calculating screen
- [x] `9578f45`
- **Commit:** `feat(design): calculating interstitial per design`
- **Spec:** centered spinner ring — 34px circle, 3px track border,
  border-top-color primary, rotate 0.9s linear infinite (reanimated
  rotate); h2 "Analyzing your responses" (assessment.calculating); mono
  caps sub "18 ANSWERS · WHO SCORING MATRIX" (new key ×10 locales:
  `assessment.calculating_sub`); footer "This takes a couple of seconds"
  (new key `assessment.calculating_footnote`). Keep 2s delay + navigate.
- **Done when:** matches Light/Dark 09.

## T05 — Results restyle
- [x] `9578f45`
- **Commit:** `feat(design): results screen with badge chip and animated trait bars`
- **Touches:** `app/results.tsx`
- **Spec:** BadgeChip amber when isPartAPositive
  (classification.high_consistency) else green (low); disclaimer line under;
  Trait breakdown card (SectionLabel + three AnimatedBar rows: Inatt %,
  Hyper %, Part A x/6 with opacities 1/.72/.55; percentages =
  round(raw/max*100)); info row (chart icon + "Re-screen in 30 days…"
  — reuse report.reminder_desc? add `results.rescreen_hint` ×10) with
  chevron; CTAs: unlock/unlocked PrimaryButton w/ document icon, Ghost
  retake. Keep cross-promo card + ad-gate logic exactly as-is.
- **Done when:** matches Light/Dark 10; rewarded gate behaviour unchanged.

## T06 — Doctor report screen restyle
- [x] `9578f45`
- **Commit:** `feat(design): doctor report preview with flagged responses`
- **Touches:** `app/report.tsx`, `lib/pdf/report-template.ts` (flagged list)
- **Spec:** doc preview stays WHITE in both themes (D-009 analogue):
  title "ASRS v1.1 Screening Summary", mono date caption, 2px violet rule,
  3 stat chips grid (Part A x/6 · Inatt % · Hyper %), "FLAGGED RESPONSES"
  SectionLabel + red-tinted rows for each flagged item: `Q{n}` mono red +
  symptom short label + bold frequency (flagged = Part A items meeting
  thresholds; data already in result.responses), citation small print incl.
  Kessler 2005 credit. Action row: OutlineButton Save to Files (folder),
  PrimaryButton Share (share-outline). Reminder toggle row
  (notifications-outline). Ghost back. WebView html source can stay for
  fidelity OR swap to native-rendered preview — prefer native-rendered
  (faster, themeable) while PDF keeps HTML template.
- **Done when:** matches Light/Dark 11; share/save/print/reminder still work.


## Notes (session 4)

All six todos built in one pass; the commits are shared and say so.
Typechecks clean. **No native screen has been rendered on a device yet.**

**The progress bar scale.** The design's widths do not agree with each
other: 17% at "Question 1 of 6" (Light 06), 33% at "6 of 6" (Light 07),
50% at "Question 9 of 18" (Light 08). Only global-progress-out-of-18 is
monotonic, and it matches two of the three exactly, so the bar is n/18
everywhere. Labels are the design's own text, verbatim.

**No Calculate CTA (T03).** The spec kept one for the last question, but
every other item auto-advances and no design shows such a control, so
answering item 18 goes straight to the interstitial.

**Flagged responses span both parts (T06, D-014).** The spec said Part A
items only; `Light 11` lists a Q9, which that rule cannot produce. Part A
uses its ASRS thresholds, Part B counts Often/Very often.

**The symptom map was wrong.** `ASRS_SYMPTOM_KEYS` was misaligned with the
question bank — item 1 ("wrapping up final details") was labelled
"careless mistakes", item 4 ("avoid a task that requires a lot of
thought") was labelled "difficulty finishing tasks", and so on down all
eighteen. Every label on the clinician-facing page described the wrong
item. Realigned, with one new key (`pdf.symptoms.listening_difficulty`)
for item 9; `acting_without_thinking` is now unused.

**Cross-promo card kept (T05).** The design has no such card; the plan
said keep it, so it sits between the re-screen hint and the CTAs.

**The report preview is native, not a WebView.** It themes correctly and
appears instantly; `report-template.ts` stays the single source for the
PDF itself.
