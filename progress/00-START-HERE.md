# START HERE

You are picking up **NeuroTrace**, a private local-first adult ADHD
self-screener (WHO ASRS v1.1) with a doctor-ready PDF export, daily
check-in and trends. Expo monorepo: `apps/native` (Expo 57 + heroui-native
+ uniwind) and `apps/web` (Next.js 16). This file is self-contained.

> Read `AGENT-WORKFLOW.md` first — that is *how* work is done here.
> This file is *what* to build next.

Last updated: end of session 4 (26 Aug 2026).

## The state of things

**Every screen in the design file is now implemented.** Plans 01-04 are
built and typecheck. Plan 05 T02 (token parity) is done.

**Almost none of it has been looked at.** The three web screens have been
rendered, measured and screenshotted. **All fifteen native screens have
only ever been typechecked.** That is the single biggest risk in the
project right now, and it is your first job.

## Your task

1. **Run the app and look at it.** `pnpm dev --filter native`, walk every
   screen in both themes against its design anchor, and write what is
   wrong into `plans/05-audit.md` T01 before building anything new. The
   order that matters most: onboarding 01-05, then the assessment flow
   06-11, then the tabs 12-15.
2. **Check the four judgement calls** in "Open questions" below.
3. Then plan 05 T01 proper, and `eas build --platform android -p
   production` to confirm the Play build is still green after all this.

Commands (from the repo root, on Windows):

```
pnpm run check-types --filter native
pnpm run check-types --filter web
pnpm run build --filter web                       # catches CSS/class errors
node scripts/check-design-tokens.cjs              # palette parity, 84 assertions
git add -A && git commit -m "feat(design): ..."   # one todo per commit
```

## The rule that comes before everything else

**Open the design file for the screen you are building. Every time.**
`designs/NeuroTrace Screens.dc.html` — find your screen via
`data-screen-label="Light 06 Part A question"` (also `Dark NN …`, `Web N …`).
Designs outrank prose for appearance; `systems/09-decisions.md` outranks
them for behaviour. Distilled tokens live in
`systems/03-design-system.md` but the HTML wins on specifics.

Light and dark differ **only** in the token block on the screen's outer
div — with exactly three exceptions, all found in session 4: the Assess
tab's resume-bar track (`#ffffff` vs `rgba(255,255,255,.14)`, now
`--nt-tint-track`) and heroui's own Switch knob on two screens.

**The design is not always self-consistent.** Its progress-bar widths
disagree across screens 06/07/08; its report lists a flagged Part B item
its own spec says cannot exist. Where it contradicts itself, pick the
reading that is monotonic or reproducible, and write down why.

## What is already built

- Full V1 feature set, then rebuilt against the design across sessions
  2-4: onboarding (5), assessment flow (6), tabs (4), web (3).
- Palette + motion primitives, shared atoms, buttons, `PressableScale`
  (with `contentStyle`), `AnimatedBar` (with `radius` / `trackColor`),
  `AssessmentProgressHeader`, `ResponsePills`, `MetricSlider`, `ScoreChart`.
- All 10 locales: 251 keys each, repaired and verified.
- `scripts/check-design-tokens.cjs` — 84 assertions across the three
  places the palette lives; proven to fail when tampered with.

"Built" = written + typechecked. Only the **three web screens** have also
been seen rendered.

## Read this before you write a line

- **Radius scales lie.** `rounded-2xl` is **16px on native** (heroui:
  `--radius` 0.5rem x2) and **20px on web** (`packages/ui`: `--radius`
  0.75rem +8px). Neither matches the other. This has caused two real
  defects. Write design radii literally on web: `rounded-[16px]` (D-016).
- **Never let PowerShell touch a locale file** (D-012). All ten were
  double-encoded before session 3. Python or Node only; UTF-8 no BOM, LF,
  2-space indent. Guard: no `Ã`, `Â`, `â€`, or bytes 0x81/0x8D/0x9D.
- **Unknown utility classes fail silently.** If a value has to be exact
  and you are not certain the class exists, use `contentStyle` /
  `style={{...}}` instead of an arbitrary class, and let the token check
  cover the colours.
- The design's `padding-bottom:34px` on CTA blocks **is** the home
  indicator. `Container` already pads by `insets.bottom`, so subtract it:
  `Math.max(0, 34 - insets.bottom)`.
- `ASRS_SYMPTOM_KEYS` was realigned in session 4 — it used to label every
  question with a different item's symptom. If you touch the question
  bank, re-check that map.
- EAS build logs are brotli — decode with node `zlib.brotliDecompressSync`.
- Kotlin pin plugin (`plugins/with-kotlin-version.js`) is load-bearing for
  the Play build — don't remove it.
- `eas.json` sets `requireCommit: true`, so **the working tree must be
  clean before `eas build`** — uncommitted work never reaches the builder.

## If you are working over the Windows bridge (agent sessions)

Established by trying, sessions 3 and 4. From the Linux VM that mounts the
Windows checkout:

- `git` works, **including commit**, but cannot unlink. It recovers by
  renaming and leaves `.git/objects/**/tmp_obj_*` and stale `*.lock`
  files behind. Clear locks by `mv`-ing them aside before each git call;
  clean up from Windows with `git gc`.
- `rm` fails with "Operation not permitted" anywhere under the mount.
  `mv` works.
- `pnpm` is not installed there, and **background processes are reaped
  between commands**, so nothing longer than ~45s can finish. `tsc` over
  the bridge takes minutes and will never complete.
- What works: stage the source into a cloud sandbox, `pnpm install
  --frozen-lockfile`, and run `tsc`, `next build` and Playwright there.
  That is how sessions 3 and 4 verified everything.

## Open questions for the owner

1. **iOS onboarding has no way back.** The design has no Back control on
   any of the five steps (D-011); Android hardware back works, iOS has
   nothing. Accept, or add an off-design affordance?
2. **Compliance copy changed twice.** The legal checkbox got shorter
   (session 3), and the result classification now reads "Symptoms
   consistent with ADHD" / "Symptoms below the screening threshold"
   (session 4). Both are the design's words. Confirm or revert.
3. **The symptom map realignment** changes what the PDF prints next to
   every flagged item. Worth one clinical read-through.
4. **`plans/01` T04 — intent options.** The design shows four with
   different wording; we ship five. Adopting it drops "Supporting someone
   else". Product call, still blocked on you.
5. **`STORE_URL`** in `apps/web/src/components/app/results-view.tsx` is
   built from the `com.anonymous.neurotrace` package id in `app.json`. If
   the Play listing differs, fix it.
6. **"The science"** nav link still points at `/health` — a guess.

## How to work here

One todo one commit · change the plan first if the plan is wrong
(`docs(plan):` + Note block) · divergences recorded as Notes · changelog +
START-HERE rewritten every session · decisions logged D-XXX in
`systems/09-decisions.md`.

## Where things are

| Path | What | Tracked |
|---|---|---|
| `AGENT-WORKFLOW.md` | full method | yes |
| `plans/*.md` | todos w/ SHAs | yes |
| `systems/*.md` | architecture/data/design-system/decisions | yes |
| `progress/*.md` | START-HERE, project, changelog, process | yes |
| `scripts/*.cjs` | parity checks | yes |
| `store-listings/*` | Play Store translations + verify.cjs | yes |
| `designs/*.dc.html` | design source (never edit) | yes |
| `designs/extracted/` | optional per-screen extracts | no |

## The test

Does what you just built help a distracted, overwhelmed adult get from cold
open to a doctor-ready PDF in under four minutes — without ever feeling
judged, and without their data ever leaving the device?
