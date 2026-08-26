# START HERE

You are picking up **NeuroTrace**, a private local-first adult ADHD
self-screener (WHO ASRS v1.1) with a doctor-ready PDF export, daily
check-in and trends. Expo monorepo: `apps/native` (Expo 57 + heroui-native
+ uniwind) and `apps/web` (Next.js). This file is self-contained.

> Read `AGENT-WORKFLOW.md` first — that is *how* work is done here.
> This file is *what* to build next.

Last updated: end of session 2 (26 Aug 2026).

## The rule that comes before everything else

**Open the design file for the screen you are building. Every time.**
`designs/NeuroTrace Screens.dc.html` — find your screen via
`data-screen-label="Light 06 Part A question"` (also `Dark NN …`, `Web N …`).
Designs outrank prose for appearance; `systems/09-decisions.md` outranks
them for behaviour. Distilled tokens/type/motion live in
`systems/03-design-system.md` but the HTML wins on specifics.

Concrete proof this matters: heroui-native has no `primary` color — earlier
code using `bg-primary` rendered without violet until we aliased it to
accent in `global.css`. Unknown tailwind classes fail silently.

## Your task

Implement the design across native + web. Order:

1. **`plans/01-native-onboarding.md` → T02** (pace 3-option + legal gate).
   Groundwork for it already landed in `7db6ef2` (pace type + locale
   ⚠️ `app/onboarding.tsx` steps 3–4 are still OLD style; a previous edit
   failed matching oldString because of literal ← characters — re-read the
   file fresh before editing.
2. Plan 01 T03 (milestone break-state), then `plans/02` (assessment flow),
   `plans/03` (tabs), `plans/04` (web), `plans/05` (audit).

Commands:

```
pnpm run check-types --filter native     # after every todo
pnpm run check-types --filter web
pnpm run prebuild -- --clean --platform android   # config validation only (no local SDK)
git add -A && git commit -m "feat(design): ..."   # one todo per commit
```

Nothing else uncommitted besides the groundwork above.

## What NeuroTrace is, in five rules

1. Local-first privacy: health data never leaves the device (MMKV only).
2. Compliance framing: screener/self-report language only; never
   diagnosis/detector/test claims; disclaimer on every results surface.
3. WHO ASRS v1.1 scoring lives only in `lib/asrs/scoring.ts`
   (web twin: `apps/web/src/lib/asrs.ts`) — thresholds in
   `progress/01-project.md`.
4. All user-facing strings through i18next in **all 10 locales**
   (en es de fr pt-BR ja it nl pl ar; ar = RTL).
5. One todo, one commit, ticked with its SHA in the plan file.

## What is already built

- Full V1 feature set native (onboarding→results→report→tracker→history→
  settings, ads scaffolding disabled) — see `progress/04-changelog.md`
  session 1. Play production build was passing at versionCode 11+.
- Web: landing + browser screener + result exist from an earlier pass,
  styled generically — restyle per `plans/04-web.md`.
- Design foundation committed: palette tokens light/dark (`global.css`),
  motion primitives (`components/ui/motion.tsx`,
  `pressable-scale.tsx`), atoms (`components/ui/atoms.tsx`),
  buttons/dots (`components/ui/buttons.tsx`), theme constants
  (`lib/theme.ts`), onboarding steps 1–2 (a3264b3).

"Built" = written + typechecked; visual device audit NOT yet done.

## Read this before you write a line

- PowerShell console renders UTF-8 as ??? — verify locale edits by regex on
  file bytes, never by console output. Write JSON via
  `[System.IO.File]::WriteAllText(..., UTF8Encoding($false))` (D-010).
- Literal ← characters in tsx files break Edit-tool oldString matches.
- EAS build logs are brotli — decode with node zlib.brotliDecompressSync.
- Kotlin pin plugin (`plugins/with-kotlin-version.js`) is load-bearing for
  the Play build — don't remove.
- `Surface variant="secondary"` is a neutral mid-tone now; violet tint is
  tertiary (`bg-nt-tint`). Progress fills must use primary/accent.

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
| `store-listings/*` | Play Store translations + verify.cjs | yes |
| `designs/*.dc.html` | design source (never edit) | yes |
| `designs/extracted/` | optional per-screen extracts | no |

## Open items, in priority order

1. plans/01 T02–T03 (onboarding pace/legal + milestone break)
2. plans/02 T01–T06 (assessment flow restyle)
3. plans/03 T01–T05 (tabs incl. daily reminder toggle D-005)
4. plans/04 T01–T03 (web)
5. plans/05 audit both themes; verify Play build still green after all
   native changes (eas build --platform android -p production)

## The test

Does what you just built help a distracted, overwhelmed adult get from cold
open to a doctor-ready PDF in under four minutes — without ever feeling
judged, and without their data ever leaving the device?
