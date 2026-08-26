# Decision log (immutable; supersede, never edit)

**D-001** — heroui-native's brand token is `accent` (no `primary` exists).
`global.css` aliases `--color-primary: var(--accent)` so existing and new
code may use either class family. Never introduce a second violet source.

**D-002** — Daily check-in keeps OUR four metrics (focusLevel, brainFog,
executiveFriction, mood) despite the designer's rename (Focus/Restlessness/
Sleep quality/Task follow-through). Data compatibility + 10 locales already
translated. Design styling still applies.

**D-003** — Onboarding shows the designer's three pace options mapped to
behaviour: "All in one sitting" → pace `fast`; "Two short sessions" →
`two_sessions` (Part A now, Part B resumable from Assess tab); "A few a
day" → also `two_sessions`. Legacy stored `list` behaves as `fast`.

**D-004** — Settings hides the Remove-ads row until IAP returns (RevenueCat
was removed for V1). `settings.adsRemoved` stays as a data-plane flag.

**D-005** — Settings gains a functional "Daily check-in reminder" toggle:
repeating local daily notification (default 20:00), permission-gated,
cancelled on toggle-off.

**D-006** — Language grid ships ALL 10 supported locales even though the
design mock showed 6. Owner explicitly overrode the designer.

**D-007** — Icons are Ionicons equivalents of the designer's Hugeicons set
on native, and lucide-react equivalents on web; no new icon dependency
(licensing + size).

**D-008** — Animations use only react-native-reanimated primitives
(FadeSlideIn stagger, PressableScale, AnimatedBar) on native and plain CSS
keyframes on web. No moti/lottie/etc.

**D-009** — Web result page (`/app/result`) is permanently dark-themed per
design, regardless of site theme; print output renders white.

**D-010** — Locale JSON files must be written as UTF-8 **without BOM** via
`[System.IO.File]::WriteAllText(path, json, UTF8Encoding($false))`. PS 5.1
`Out-File -Encoding ascii` corrupts non-ASCII; ConvertTo-Json escapes to
\uXXXX which is safe.

**D-011** — None of the five onboarding designs carries a visible Back
control, so the implementation has none. To keep a mistap recoverable the
screen registers `BackHandler` so Android hardware back steps to the
previous question. **iOS has no equivalent affordance and therefore no way
back** — flagged to the owner as a designer gap rather than patched with an
off-design button.

**D-012** — Supersedes D-010's mechanism. Locale JSON is written only by
Python or Node, never by PowerShell in any form: as of session 3 all ten
files had been double-encoded (UTF-8 bytes re-read as sloppy-windows-1252
and re-encoded), corrupting 767 strings — every umlaut, every Japanese and
Arabic character. Canonical on-disk form is now UTF-8 without BOM, LF
endings, 2-space indent, `ensure_ascii=False`. The repair script lives in
the session log of `progress/04-changelog.md`; the guard is that no locale
file may contain the sequences `Ã`, `Â`, `â€` or the C1 bytes 0x81/0x8D/0x9D.

**D-013** — The web marketing site is forced to light (`forcedTheme="light"`,
no mode toggle in the header) because all three web designs are light-only.
The one dark surface, `/app/result`, paints its own ground per D-009.

**D-014** — The doctor's report lists flagged responses from **both**
parts: Part A items at or above their ASRS threshold (items 1-3 from
"Sometimes", 4-6 from "Often"), plus Part B items answered "Often" or
"Very often". Part A alone could not produce the Q9 row the design shows,
and Part B has no shaded boxes on the paper instrument to inherit.

**D-015** — Part B has no explicit Calculate button. Every other item in
the instrument auto-advances and no design shows such a control, so
answering item 18 goes straight to the calculating interstitial. Plan 02
T03 asked for one; this supersedes it.

**D-016** — Radius scales differ per app and neither matches Tailwind's
defaults: `heroui-native` sets `--radius: 0.5rem` with multiplier steps
(`rounded-2xl` = 16px), while `packages/ui` sets `--radius: 0.75rem` with
`+4/+8/+12` offsets (`rounded-2xl` = 20px). Design radii are therefore
written literally on web (`rounded-[16px]`) and only used as named steps
on native where the step happens to equal the design value.
