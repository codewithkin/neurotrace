# Plan 05 — Design audit + parity

Blocked until 01–04 complete.

## T01 — Screen-by-screen design audit
- [ ] `pending-T01`
- **Commit:** `docs(audit): per-screen design audit notes` (notes in this file)
- **Spec:** for every built screen open Light AND Dark design anchors and
  compare: ground, card, border, radius, control heights, type sizes,
  section gaps, ramp colors, badge pairs. Log mismatches here with fix
  commits. Known risk spots from session 1: progress-bar fill colors used
  `bg-primary` before the alias existed (verify renders violet), Surface
  variant="secondary" semantics changed (now neutral mid-tone, tint moved
  to tertiary).

## T02 — Token parity check
- [x] `5853bd0`
- **Commit:** `test(design): palette parity check against design source`
- **Spec:** node script scanning `apps/native/global.css` +
  `apps/web` theme for the canonical hexes from systems/03-design-system.md;
  fails if a token is missing or drifted; run it, then tamper once to see
  it fail (Pillar 6). ASCII-only output.


## Note (session 4) — T02 done

`scripts/check-design-tokens.cjs` asserts the design's hexes across the
three places they live and cannot see each other: `apps/native/global.css`
(light and dark custom properties), `apps/native/lib/theme.ts` (raw values
for SVG fills and icon props) and `apps/web/src/index.css`. 84 assertions.

Made to fail once on purpose, per Pillar 6: flipping `theme.ts` light
`pri` from `#6d42e8` to `#6d42e9` produced

```
Design token check FAILED (1):
  - theme.ts light: pri is #6d42e9, expected #6d42e8
```

and exit code 1; restoring the value returned it to green. ASCII output
only, so PowerShell cannot mangle it.

**Not covered by the check, and worth adding:** the radius scales. Both
`heroui-native` and `packages/ui` remap Tailwind's radius steps, in
different directions — `rounded-2xl` is 16px on native and 20px on web.
That discrepancy has now caused two real defects.
