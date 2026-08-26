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
- [ ] `pending-T02`
- **Commit:** `test(design): palette parity check against design source`
- **Spec:** node script scanning `apps/native/global.css` +
  `apps/web` theme for the canonical hexes from systems/03-design-system.md;
  fails if a token is missing or drifted; run it, then tamper once to see
  it fail (Pillar 6). ASCII-only output.
