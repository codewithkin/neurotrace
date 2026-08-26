# Design system (distilled from designs/NeuroTrace Screens.dc.html)

Always re-open the design HTML for the exact screen before building. Anchor
format: `data-screen-label="Light NN Name"`, `"Dark NN Name"`, `"Web N Name"`.

## Palette

| Token | Light | Dark |
|---|---|---|
| background | `#ffffff` | `#0b0a0f` |
| foreground (ink) | `#15121d` | `#f4f2fa` |
| muted | `#6d6981` | `#9a95ac` |
| border | `#eae7f2` | `#282534` |
| card (`--surface`) | `#f8f7fc` | `#17151f` |
| tint (`--surface-tertiary`, `--nt-tint`) | `#f2ecfe` | `#1d1730` |
| selected border (`--nt-pri-border`) | `#c8b4fa` | `#7c4df0` |
| track/bar bg (`--nt-track`) | `#ecebf3` | `#252231` |
| primary/accent | `#6d42e8` | `#8b5cf6` |

Status pairs (bg/fg): amber `#fef3c7/#92500e` · dark `#3a2c0a/#fbbf24`;
green `#dcfce7/#15803d` · dark `#0e2a18/#4ade80`; danger `#fef2f2/#b91c1c`
· dark `#2a1214/#f87171`.

Frequency ramp (Never→Very often), white text, opacity .92, mono numeral
right-aligned: `#2563eb #0ea5e9 #4f46e5 #7c3aed #9333ea`. Chart series 2 =
amber `#f59e0b`.

## Type & shape language

- System sans; h1 26px w600 tracking −0.03em; question h2 26px/36px;
  eyebrows/labels: 11px **monospace** uppercase, letter-spacing .14–.16em
  (`SectionLabel`, `MONO_FONT` from `lib/theme.ts`).
- Numeric values always mono w600 (`MonoValue`).
- Cards radius 20–24px, 1px border, card bg, padding 18–20px.
- Primary button: accent bg, white label 16–17px w600, radius 16px,
  py≈16px, centered, trailing arrow (`PrimaryButton`). Ghost = centered
  semibold muted text (`GhostButton`). Outline = 1px border + icon
  (`OutlineButton`).

## Motion language (every screen)

- Section entrances: staggered `FadeSlideIn index={n}` — FadeInDown,
  60ms per step, spring damping 22 / stiffness 180.
- Tactile: `PressableScale` spring to 0.97 on press.
- Bars/values: `AnimatedBar` spring-fills to pct after ~150ms delay.
- Question transitions in Part A/B: keyed remount + FadeSlideIn.
- Milestone/results: spring pop on badge/icon tile.

## Icon mapping (Ionicons stand-ins for Hugeicons, D-007)

idea=bulb-outline · clinician=medical-outline · tracking=stats-chart-outline ·
curious=search-outline · support=people-outline · flash=flash-outline ·
time=time-outline · few-a-day=moon-outline · legal=document-text-outline ·
privacy=lock-closed-outline · crisis=alert-circle-outline ·
checkmark=checkmark-circle · arrow=arrow-forward · save=folder-outline ·
share=share-outline · reminder=notifications-outline · meds=medical-outline
· focus=target · fog=cloudy · friction=cog-outline · mood=sunny ·
tabs: home/task-2/chart-line? use stats-chart / settings.
