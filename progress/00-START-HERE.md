# START HERE

You are picking up **NeuroTrace**, a private local-first adult ADHD
self-screener (WHO ASRS v1.1) with a doctor-ready PDF export, daily
check-in and trends. Expo monorepo: `apps/native` (Expo 57 + heroui-native
+ uniwind) and `apps/web` (Next.js 16). This file is self-contained.

> Read `AGENT-WORKFLOW.md` first — that is *how* work is done here.
> This file is *what* to build next.

Last updated: end of session 3 (26 Aug 2026).

## The rule that comes before everything else

**Open the design file for the screen you are building. Every time.**
`designs/NeuroTrace Screens.dc.html` — find your screen via
`data-screen-label="Light 06 Part A question"` (also `Dark NN …`, `Web N …`).
Designs outrank prose for appearance; `systems/09-decisions.md` outranks
them for behaviour. Distilled tokens/type/motion live in
`systems/03-design-system.md` but the HTML wins on specifics.

Light and dark variants differ **only** in the CSS custom properties on the
screen's outer div — the markup is byte-identical. Build once against
tokens and both themes follow.

Two proofs this matters, both from real defects:
heroui-native has no `primary` colour, so `bg-primary` rendered without
violet until `global.css` aliased it to accent; and `packages/ui` remaps
shadcn's radius scale, so on web `rounded-xl` is **16px, not 12px**.
Unknown *and* misremembered utility classes both fail silently.

## Your task

1. **Look at what session 3 built.** Native onboarding (5 steps) and the
   web landing page are written and typecheck, and the web page has been
   screenshotted against the design — but **no native screen has ever been
   rendered on a device.** Run `pnpm dev --filter native`, walk the five
   onboarding steps in both themes against `Light/Dark 01`–`05`, and record
   what is wrong in `plans/01-native-onboarding.md` before building more.
2. **`plans/01` T03** (two-sessions pace adds a break state after Part A).
3. Then `plans/02` (assessment flow), `plans/03` (tabs), `plans/04` T02–T03
   (web screener + result), `plans/05` (audit).
4. **`plans/01` T04 is blocked on the owner** — see Open questions below.

Commands (from the repo root, on Windows):

```
pnpm run check-types --filter native
pnpm run check-types --filter web
pnpm run build --filter web                       # catches CSS/class errors
pnpm run prebuild -- --clean --platform android   # config validation only
git add -A && git commit -m "feat(design): ..."   # one todo per commit
```

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
  settings, ads scaffolding disabled) — `progress/04-changelog.md` session 1.
  Play production build was passing at versionCode 11+.
- Design foundation: palette tokens light/dark (`global.css`), motion
  primitives, atoms, buttons/dots, `lib/theme.ts` (446e6e9, a3264b3).
- **Session 3:** all five native onboarding steps rebuilt against the design
  (`app/onboarding.tsx` rewritten wholesale); web landing + header rebuilt
  against `Web 1 Landing`; **all 10 locale files repaired** — 767 strings
  were double-encoded mojibake.
- Web screener + result exist from an earlier pass, styled generically —
  restyle per `plans/04-web.md` T02/T03.

"Built" = written + typechecked. Only the **web landing page** has also been
seen rendered.

## Read this before you write a line

- **Never let PowerShell touch a locale file** (D-012). Every non-ASCII
  string in all ten was double-encoded before session 3. Write them with
  Python or Node only; canonical form is UTF-8 no BOM, LF, 2-space indent.
  The guard: no locale file may contain `Ã`, `Â`, `â€` or bytes
  0x81/0x8D/0x9D.
- On web, `rounded-xl` is 16px and `rounded-lg` is 12px — `packages/ui`
  offsets the whole shadcn radius scale. Use `rounded-[Npx]` for design
  values.
- `PressableScale` takes a `contentStyle` prop for values the class layer
  cannot express exactly (1.5px borders, 17px CTA padding). Prefer it over
  arbitrary classes on native.
- The design's `padding-bottom:34px` on CTA blocks **is** the home-indicator
  inset. `Container` already pads by `insets.bottom`, so subtract it
  (`Math.max(0, 34 - insets.bottom)`) instead of adding 34 on top.
- EAS build logs are brotli — decode with node `zlib.brotliDecompressSync`.
- Kotlin pin plugin (`plugins/with-kotlin-version.js`) is load-bearing for
  the Play build — don't remove.
- `Surface variant="secondary"` is a neutral mid-tone; violet tint is
  tertiary (`bg-nt-tint`). Progress fills must use primary/accent.
- `eas.json` sets `requireCommit: true`, so **the working tree must be clean
  before `eas build`** — uncommitted work never reaches the builder.

## If you are working over the Windows bridge (agent sessions)

Establish limits by trying, not assuming. As of session 3, from the Linux
VM that mounts the Windows checkout:

- `git` works — including `commit` — but **cannot unlink**. It recovers by
  renaming and leaves `.git/objects/**/tmp_obj_*` and an empty
  `.git/index.lock` behind. Harmless; clean up from Windows with `git gc`.
- `rm` fails with "Operation not permitted" anywhere under the mount.
  `mv` works, including out of the way.
- `pnpm` is not installed there, and **background processes are reaped
  between commands**, so anything longer than ~45s cannot finish. `tsc`
  over the bridge takes minutes and will never complete.
- What worked: stage the source into a cloud sandbox, `pnpm install
  --frozen-lockfile`, and run `tsc`, `next build` and Playwright
  screenshots there. That is how session 3 verified the web page.

## Open questions for the owner

1. **iOS onboarding has no way back.** The design has no Back control on
   any of the five steps, so the implementation has none (D-011). Android
   hardware back works. Accept, or add an off-design back affordance?
2. **The legal checkbox copy got shorter.** It now reads the design's
   "I understand this is a screening tool and not a medical diagnosis",
   replacing the longer WHO-ASRS-citing sentence. The WHO framing is still
   on the same screen in the subtitle and bullets. Confirm or revert.
3. **`plans/01` T04 — intent options.** The design shows four options with
   different wording; we ship five. Adopting the design drops "Supporting
   someone else". Product call, blocked on you.
4. **"The science" nav link** currently points at `/health`. Right target?

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

## The test

Does what you just built help a distracted, overwhelmed adult get from cold
open to a doctor-ready PDF in under four minutes — without ever feeling
judged, and without their data ever leaving the device?
