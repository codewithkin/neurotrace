# Plan 04 — Web (apps/web)

Anchors: `Web 1 Landing`, `Web 2 Screener`, `Web 3 Result`.
Existing logic to keep: `src/lib/asrs.ts` (scoring), `screener.tsx`
(localStorage persistence), `results-view.tsx`, `scale-pills.tsx`,
`progress-bar.tsx`. Restyle, don't rebuild logic.

## T01 — Theme tokens + landing page
- [x] `4bd419b`
- **Commit:** `feat(web): landing page per design with brand palette`
- **Touches:** `app/globals.css` (or tailwind config tokens), `components/header.tsx`, `app/page.tsx`
- **Spec:** light site; nav = wordmark **Neuro**(violet #6d42e8)**Trace** +
  links How it works / The science / Privacy + violet CTA pill "Start the
  screener"; hero centered: mono pill badge "WHO ASRS v1.1" (tint bg), h1
  ~66px w600 −0.045em "Find out whether it is worth asking your **doctor**"
  (doctor in violet), sub 18px muted, CTAs violet "Give me my score →" +
  outline "Health statement", trust mono line "No account · no upload ·
  free", three feature cards (target/file/science icons, radius 20,
  1px border). Footer citation strip. Animations: CSS keyframes fade-up
  staggered on load, hover lift on cards/buttons.
- **Done when:** matches Web 1 at desktop + mobile widths.

**Note (session 3):** built. Details worth knowing before T02/T03:

- Tokens live in `apps/web/src/index.css`, overriding the shadcn neutrals
  from `packages/ui` *after* the import so the shared package stays
  generic. Three greys the design uses that shadcn has no slot for
  (`#5f5b70` hero paragraph, `#8a8698` trust line, `#dcd9e2` outline
  border) are exposed as `--nt-hero-sub` / `--nt-trust` / `--nt-chrome`.
- The site is forced to light and the header's mode toggle is gone
  (D-013). `mode-toggle.tsx` is now unreferenced but left in place.
- `layout.tsx` no longer loads Geist: the design's type is the platform
  system stack, now set on `--font-sans`. One fewer font download.
- The design's nav is three links; they map to `/#how-it-works`,
  `/health` ("The science") and `/privacy`. **The `/health` mapping is a
  guess** — if "The science" should be its own page, say so.
- Below `md` the three nav links collapse and only the violet CTA pill
  remains; the h1 clamps between 2.25rem and 66px and the feature cards
  stack. The static 1280px mock cannot express any of that.
- Entrances are `.nt-rise` CSS keyframes with inline `animation-delay`
  staggers, hover lift is `.nt-lift`; both are disabled under
  `prefers-reduced-motion` (D-008).

**Not verified:** no browser has rendered this yet. `next build` was not
run — the repo lives on a Windows filesystem reached over a slow bridge and
a full Next build did not fit the session. First job next session is to run
`pnpm dev --filter web` and compare against `Web 1 Landing` side by side,
especially that every utility class actually resolved (unknown classes fail
silently — the `bg-primary` lesson from session 1).

## T02 — Screener page restyle
- [ ] `pending-T02`
- **Commit:** `feat(web): screener restyled per design with selected pill ring`
- **Spec:** compact header row: wordmark left, right mono caps
  "QUESTION {n} OF 18 · CORE SCREENING/PART B"; thin progress bar; eyebrow
  "Over the past six months"; question h2 clamp(28–40px); ScalePills
  restyled: ramp colors @ .92, white label + mono numeral right, py 20 px
  26, radius 16, selected = full-opacity bg + double ring
  (`box-shadow: 0 0 0 3px #fff, 0 0 0 6px #15121d`) + tick icon; footer
  "Progress is kept in this browser only". Keep reveal flow + localStorage.
- **Done when:** matches Web 2; answers persist across reload.

## T03 — Result page rebuild (dark, print)
- [ ] `pending-T03`
- **Commit:** `feat(web): dark result page with gradient bars and print summary`
- **Spec:** permanently dark (#0b0a0f) regardless of theme (D-009): badge
  chip amber "Symptoms consistent with ADHD"/green low variant + disclaimer;
  breakdown card (#17151f, border #282534, radius 24) rows Inatt %/Hyper %/
  Part A x/6 with **gradient fills** linear-gradient(90deg,#6d42e8,#a855f7)
  / (#6d42e8,#8b5cf6) / (#4f46e5,#7c3aed); CTAs "Print my summary"
  (bg #8b5cf6, ink text, printer icon → window.print of white-styled
  printable summary) + "Continue in the app" outline (deep-link
  neurotrace:// or store fallback). Footer instrument citation line.
  Print stylesheet: white doc, ink text, no nav/badge colors.
- **Done when:** matches Web 3; print preview is plain white document.
