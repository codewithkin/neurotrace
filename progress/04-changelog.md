# Changelog

## Session 3 (26 Aug 2026) — onboarding shipped both platforms; the locale files were corrupt

**Native onboarding (all five steps) and the web landing page built against
the design file. Along the way: every non-ASCII string in all ten locales
turned out to be double-encoded, and has been repaired.**

### The locale corruption (the big one)

`de.json` read `"WÃ¤hle deine Sprache"`. `ja.json` read
`"è¨€èªžã‚’é¸æŠžã—ã¦ãã ã•ã„"`. **767 strings across all 10 files** were
UTF-8 bytes that had been read back as sloppy-windows-1252 and re-encoded
as UTF-8 — nine of ten languages were shipping visible mojibake, and this
was already committed, so it went out in the Play build.

The inverse transform is per-string: map each character back to its single
byte through cp1252-with-the-five-undefined-slots-passed-through, decode as
UTF-8, repeat until stable, and leave the string alone if either step
fails. That last part matters: the files were a *mix* — `de.json` held both
mangled `ZurÃ¼ck` and correct `ü`, so a whole-file transform throws. The
naive latin-1-only inverse (and `ftfy.fix_encoding` at its default
confidence) both under-fix: latin-1 fails on the CP1252 high slots that
appear in Arabic, ftfy declines 9 Polish and Japanese strings it is not
sure about. Verified afterwards: key sets identical to HEAD in all 10
files, zero `Ã`/`Â`/`â€`/C1 residue, valid JSON, no BOM, LF.

Canonical on-disk form is now UTF-8 no BOM, LF, 2-space indent (D-012).
The files were also CRLF in the working tree and LF at HEAD, which is why
`git diff` showed 2,140 changed lines before any of this started.

### Native — plan 01 T02 (and a rebuild of T01)

`app/onboarding.tsx` rewritten wholesale rather than patched: the file
carried a UTF-8 BOM and the mojibake `â† Back` labels the plan warned
about. All five steps now follow `Light/Dark 01`–`05` literally — 26px
/-0.03em headings with a 6px subtitle gap, 18px-radius option rows,
selected rows on tint with a 1.5px violet border, 6px step dots with a 24px
active pill at 5px gaps.

Judgement calls, all recorded as Notes in `plans/01-native-onboarding.md`:

1. **No Back control** on any step, because the design has none (D-011).
   `BackHandler` covers Android; iOS has no way back and the owner should
   decide whether that is acceptable.
2. **The legal checkbox card does not tint on accept** — the design draws
   the accepted state as plain card + border with only the checkbox filled.
3. **`legal.cta` and `legal.checkbox` now carry the design's copy**
   ("Start screening" / "I understand this is a screening tool and not a
   medical diagnosis"), re-translated across 10 locales. This shortens a
   compliance-surface string — flagged for the owner.
4. **1.5px borders and the 17px CTA go through a new `contentStyle` prop**
   on `PressableScale` rather than `border-[1.5px]`-style arbitrary
   classes, because unknown classes fail silently here (session 1's
   `bg-primary` lesson).
5. **CTA blocks sit 34px off the screen edge** by subtracting the
   safe-area inset `Container` already applies, instead of the design's
   literal `padding-bottom:34px` which would have double-counted on iOS.

Left alone deliberately: step 02 still ships our five intent options and
step 03 our teaser copy, both of which differ from the design's wording.
Adopting the design's four intent options drops "Supporting someone else",
which is a product decision — filed as T04, blocked on the owner.

### Web — plan 04 T01

Landing page and header rebuilt against `Web 1 Landing`. Brand tokens
override the shadcn neutrals from `apps/web/src/index.css` (after the
import, so `packages/ui` stays generic); three greys the design uses that
shadcn has no slot for are exposed as `--nt-hero-sub`, `--nt-trust`,
`--nt-chrome`. Site forced to light, mode toggle dropped (D-013). Geist
removed from `layout.tsx` — the design's type is the platform system stack.

### Verification — and how it had to be done

`pnpm` does not exist in the Linux VM bridged to the Windows checkout, and
**background processes there are reaped between commands**, so a `tsc` run
(several minutes over the bridge) can never finish: it must complete inside
one ~45s command. Everything long-running therefore has to happen
elsewhere.

What was done instead: 111 source files staged into a cloud sandbox,
`pnpm install --frozen-lockfile`, and there —

- `tsc --noEmit` clean for **native** and for **web**;
- `next build` clean, 7 static routes;
- the built site served and screenshotted at 1280px and 390px.

The screenshots caught one real defect measurement would have missed
otherwise: the header CTA rendered at **16px radius, not the design's
12px**, because `packages/ui` remaps shadcn's radius scale
(`--radius-xl = --radius + 4px`), so `rounded-xl` is not 12px in this repo.
Fixed to `rounded-[12px]`. Every other measured value — 66px/-0.045em h1,
28.8px paragraph leading, #5f5b70, 20px card radius, 22px/56px footer —
matches the design exactly.

Two cosmetic deltas remain and are font-metric artifacts of the Linux
fallback face, not code: the h1 and the hero paragraph wrap to three lines
where the mock (SF Pro) shows two. Worth re-checking on Windows/Segoe UI.

**Not verified: the native screens.** No simulator here. First job next
session.

### Repo hygiene

Commits were made from the bridge, which cannot `unlink`: git recovers by
renaming, but it leaves `.git/objects/**/tmp_obj_*` droppings and an empty
`.git/index.lock` behind. Harmless, cleaned by `git gc` (or plain deletion)
from Windows. There is also a `.git/zz_stale_lock_*` file — an index.lock
renamed out of the way — safe to delete.


## Session 1 (26 Aug 2026) — product build + build-infra fixes

**Built the entire V1 app from the blueprint, then unblocked the Play
production build.**

### Product (commits ed900bb…63e184f, 20 todos)
- ASRS v1.1 scoring engine + 18-item bank; MMKV storage layer.
- Onboarding (language/intent/teaser/pace/legal), Part A/B with autosave,
  milestone, calculating interstitial, results with trait bars, doctor PDF
  report (preview/share/save/print + 30-day reminder), daily check-in with
  streaks, history chart, settings, Brown Noise cross-promo card.
- i18n: all 10 locales incl. RTL Arabic; device-locale detection.
- Monetization scaffolding: AdMob rewarded + UMP consent (ADS_ENABLED=false
  in V1 → gates short-circuit unlocked). RevenueCat was added then removed
  for V1 (565659e).
- Web: browser ASRS screener with reveal flow + printable summary.

### Build infra (792563e…f275acc)
- Kotlin pinned to 2.3.0 via `plugins/with-kotlin-version.js` because
  play-services-ads 25.4.0 ships Kotlin 2.3 metadata that KGP 2.1 cannot
  read. Three iterations: catalog override alone didn't move the compiler;
  `$ext.kotlinVersion` inside buildscript failed (delegate scoping);
  **inline literal version in root classpath + first-line
  `ext.kotlinVersion = "2.3.0"` worked** (aedcf9c).
- EAS project id/owner linked; .easignore added (replaces .gitignore for
  uploads); assets shrunk; dark splash reference removed after asset delete.

## Session 2 (26 Aug 2026) — design implementation started, scaffolded this workflow system

**Implemented the design-system foundation and onboarding steps 1–2 from the
new designs folder; scaffolded plans/systems/progress so the work can
continue across chats.**

### Done
- Extracted full design language from NeuroTrace Screens.dc.html into
  `systems/03-design-system.md` (palette both themes, ramp, type, motion).
- `global.css` overrides heroui-native raw vars for light/dark; discovered
  heroui has NO primary token — brand is accent; aliased
  `--color-primary: var(--accent)` (D-001). Prior code using bg-primary had
  been silently rendering without violet.
- Motion primitives: FadeSlideIn (staggered), PressableScale, AnimatedBar;
  atoms: SectionLabel/MonoValue/BadgeChip; PrimaryButton/GhostButton/
  OutlineButton/StepDots.
- Onboarding steps 1–2 rebuilt per design (language grid 10 locales w/
  English subtitles, intent rows w/ icons+descriptions), staggered
  entrances (a3264b3).

### Divergences from the designer
Logged as D-002/D-003/D-004/D-005/D-006/D-007/D-009 in
`systems/09-decisions.md`. Owner approved via Q&A.

### What is verified / not
- Typecheck green at every commit. Nothing rendered on a device this
  session — visual audit pending (plans/05).
- Locale files rewritten via PowerShell round-trip: verified UTF-8 no-BOM
  content byte-level for de/ja/ar; other locales spot-checked only.

### Uncommitted on disk right now
`app-storage.ts` (AssessmentPace + two_sessions mapping) and all 10 locale
files (pace subtitle/sitting/split/daily + legal title/subtitle/bullets).
These are the groundwork of plan 01 T02 — commit them WITH that todo.

### Next
1. `plans/01-native-onboarding.md` T02 (pace + legal restyle) — note the
   Edit-tool trap about literal ← arrows; re-read before editing.
2. Then T03, then `plans/02`, `03`, `04`, `05`.
