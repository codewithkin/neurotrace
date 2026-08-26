# Plan 04 — Web (apps/web)

Anchors: `Web 1 Landing`, `Web 2 Screener`, `Web 3 Result`.
Existing logic to keep: `src/lib/asrs.ts` (scoring), `screener.tsx`
(localStorage persistence), `results-view.tsx`, `scale-pills.tsx`,
`progress-bar.tsx`. Restyle, don't rebuild logic.

## T01 — Theme tokens + landing page
- [ ] `pending-T01`
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
