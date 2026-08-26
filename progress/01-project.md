# NeuroTrace — project brief

**One line:** a private, local-first adult ADHD self-screener (WHO ASRS v1.1)
with a doctor-ready PDF export, a 10-second daily check-in, and long-term
trend tracking.

## Non-negotiables

1. **100% local-first.** Responses, scores, alias and check-ins live in MMKV
   on device only. No account, no upload, no analytics of health data.
2. **Compliance framing.** Never use "diagnosis", "diagnostic", "detector",
   "medical test" or "cure" as product claims. Always "self-screener",
   "educational self-report", "screening tool". Every results surface carries
   the not-a-diagnosis disclaimer.
3. **Clinical fidelity.** WHO ASRS v1.1: Part A = items 1–6 with thresholds
   (items 1–3 significant at ≥2/Sometimes; items 4–6 at ≥3/Often); ≥4 of 6
   met ⇒ `isPartAPositive`. Inattention ids 1,2,3,7–12; hyperactivity 4,5,6,
   13–18. Scale 0=Never … 4=Very Often.
4. **10 locales, all strings through i18next.** en, es, de, fr, pt-BR, ja,
   it, nl, pl, ar (+RTL). New user-facing copy goes into every locale file;
   fallback to en is a stopgap, never a release state.
5. **One todo, one commit** while implementing plans; design files outrank
   prose for appearance (see AGENT-WORKFLOW.md).

## Monorepo layout

- `apps/native` — Expo SDK 57, expo-router tabs + stack, heroui-native +
  uniwind (tailwind v4), react-native-reanimated, MMKV, AdMob (ADS_ENABLED
  false for V1), expo-print/sharing/notifications/updates.
- `apps/web` — Next.js (App Router) marketing + browser screener
  (`/`, `/app`, `/app/result`, legal pages), tailwind, theme-provider.
- `packages/*` — config/env/ui scaffolding from Better T Stack.
- `designs/*.dc.html` — the design source (15 native screens light+dark,
  3 web screens). Anchors: `data-screen-label="Light 06 Part A question"` etc.
