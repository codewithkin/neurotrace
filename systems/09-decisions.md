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

**D-007** — Icons are Ionicons equivalents of the designer's Hugeicons set;
no new icon dependency (licensing + size).

**D-008** — Animations use only react-native-reanimated primitives
(FadeSlideIn stagger, PressableScale, AnimatedBar) on native and plain CSS
keyframes on web. No moti/lottie/etc.

**D-009** — Web result page (`/app/result`) is permanently dark-themed per
design, regardless of site theme; print output renders white.

**D-010** — Locale JSON files must be written as UTF-8 **without BOM** via
`[System.IO.File]::WriteAllText(path, json, UTF8Encoding($false))`. PS 5.1
`Out-File -Encoding ascii` corrupts non-ASCII; ConvertTo-Json escapes to
\uXXXX which is safe.
