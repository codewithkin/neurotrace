# Plan 03 — Native tabs (check-in, assess, history, settings, tab bar)

Anchors: `Light/Dark 12 Daily check-in`, `13 Assess tab`, `14 History tab`,
`15 Settings tab`. Depends on: plan 01 T02 (pace), plan 02 (for assess tab
stats + report link targets).

## T01 — Assess tab build-out
- [ ] `pending-T01`
- **Commit:** `feat(design): assess tab hub with resume card and last-result stats`
- **Touches:** `app/(tabs)/assess.tsx`
- **Spec (three states):**
  - In-progress (responses exist): resume card — title "Part B in progress"
    or "Core screening in progress" by count<6 vs ≥6; mono chip `{n} / 18`;
    progress bar; primary Resume → part-a (if n<6) else part-b.
  - Last completed card (latest result exists): SectionLabel "Last
    completed" + locale date right; BadgeChip amber/green from
    classificationKey; divider; 3-col stats 24px w700 over mono caps labels
    INATT./HYPER./PART A (% values); outline View report row → /results.
  - Always bottom: OutlineButton "Start a fresh assessment" → part-a (with
    confirm if in-progress) + tiny disclaimer line
    ("Screening tool only. Results are not a diagnosis." — new key
    `assessment.tab_disclaimer` ×10).
- **Done when:** all three states render per design; navigation correct.

## T02 — Daily check-in restyle
- [ ] `pending-T02`
- **Commit:** `feat(design): check-in screen with icon sliders and mono values`
- **Touches:** `app/(tabs)/index.tsx`
- **Spec:** keep streak chip (🔥 N-day) + h1; slider card radius 20 p-20:
  per-metric rows — Ionicon left (target/cloudy/cog-outline/sunny), name
  14px w600, MonoValue right; heroui Slider styled thin: track h-[6px]
  rounded, primary fill, thumb 20px circle bg-background border-2 primary;
  hairline divider full-bleed; medication row medical-outline + Switch;
  PrimaryButton save (already-saved state keeps ✓ copy). Staggered
  FadeSlideIn per row. Data keys unchanged (D-002).
- **Done when:** matches Light/Dark 12; saving/streak logic unchanged.

## T03 — History restyle
- [ ] `pending-T03`
- **Commit:** `feat(design): history chart card and sessions list per design`
- **Touches:** `app/(tabs)/history.tsx`, `components/history/score-chart.tsx`
- **Spec:** chart card radius 20: SVG viewBox 320×172, dashed gridlines at
  y for 100/66/33/0 with mono left labels, two smooth polylines (primary +
  #f59e0b) strokeWidth 2.5 round joins, dots r 3.5, month labels mono 9px
  bottom (derive from result dates); legend dot+label centered below.
  Percent-normalise series to 0–100 scale (design axis), not raw/36.
  Sessions section: SectionLabel "Sessions", rows = border card: bold date,
  muted sub "Inattention {n} · Hyperactivity {n}", right status dot
  (green improving / amber elevated / muted stable — reuse trend logic per
  result). Empty state unchanged conceptually but restyled. Bottom primary
  "Re-assess now".
- **Done when:** matches Light/Dark 14; real data renders.

## T04 — Settings restyle + daily reminder toggle (D-005)
- [ ] `pending-T04`
- **Commit:** `feat(design): settings per design with daily check-in reminder`
- **Touches:** `app/(tabs)/settings.tsx`, `lib/notifications/reminders.ts`
  (add scheduleDailyCheckInReminder/cancel + storage flag)
  `settings.dailyReminderEnabled` key; REMOVE Remove-ads row (D-004).
- **Spec:** Language section: horizontal wrap pills (selected = tint bg +
  primary text + priBorder, else border+muted). App group list card:
  notifications-outline "Daily check-in reminder" + Switch (permission-
  gated, cancels on off, default hour 20:00 local);
  task-outline "Retake assessment" chevron row → part-a. Privacy tint box
  (lock icon + privacy_note). Danger button Clear all data
  (dangerBg/dangerFg pair). Mono footer version line.
- **Done when:** matches Light/Dark 15 minus remove-ads row; reminder
  schedules a real repeating notification.

## T05 — Tab bar restyle
- [ ] `pending-T05`
- **Commit:** `feat(design): tab bar icons and labels per design`
- **Touches:** `app/(tabs)/_layout.tsx`
- **Spec:** four tabs Check-in / Assess / History / Settings (i18n keys
  tabs.checkin etc. new ×10); Ionicons home-outline/task-outline/
  stats-chart-outline/settings-outline, active solid variant tinted primary
  23px, inactive muted; label 10px w600. Active tint via tabBarActiveTintColor.
- **Done when:** matches design footer in both themes.
