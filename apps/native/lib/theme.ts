import { Platform } from "react-native";
import { useUniwind } from "uniwind";

/**
 * NeuroTrace design tokens that don't participate in light/dark theming:
 * the 0-4 frequency ramp, chart series colors and the mono label style.
 */
export const FREQ_RAMP = ["#2563eb", "#0ea5e9", "#4f46e5", "#7c3aed", "#9333ea"] as const;

export const CHART_AMBER = "#f59e0b";

export const MONO_FONT = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

/**
 * The design's per-theme palette, for the places that need a raw colour
 * value rather than a class: SVG fills, Ionicons `color`, border colours
 * on animated views.
 *
 * These hexes also live in `global.css` as CSS custom properties. That is
 * one value in two places, so `scripts/check-design-tokens.cjs` asserts
 * the two agree and fails the check if either drifts.
 */
export const NT_COLORS = {
  light: {
    bg: "#ffffff",
    fg: "#15121d",
    muted: "#6d6981",
    border: "#eae7f2",
    card: "#f8f7fc",
    tint: "#f2ecfe",
    pri: "#6d42e8",
    priBorder: "#c8b4fa",
    track: "#ecebf3",
    ring: "#15121d",
    amberBg: "#fef3c7",
    amberFg: "#92500e",
    greenBg: "#dcfce7",
    greenFg: "#15803d",
    dangerBg: "#fef2f2",
    dangerFg: "#b91c1c",
    tintTrack: "#ffffff",
  },
  dark: {
    bg: "#0b0a0f",
    fg: "#f4f2fa",
    muted: "#9a95ac",
    border: "#282534",
    card: "#17151f",
    tint: "#1d1730",
    pri: "#8b5cf6",
    priBorder: "#7c4df0",
    track: "#252231",
    ring: "#ffffff",
    amberBg: "#3a2c0a",
    amberFg: "#fbbf24",
    greenBg: "#0e2a18",
    greenFg: "#4ade80",
    dangerBg: "#2a1214",
    dangerFg: "#f87171",
    tintTrack: "rgba(255, 255, 255, 0.14)",
  },
} as const;

/** Widened so the dark palette is assignable alongside the light one. */
export type NTColors = {
  readonly [K in keyof (typeof NT_COLORS)["light"]]: string;
};

/** The design palette for whichever theme uniwind currently has active. */
export function useNTColors(): NTColors {
  const { theme } = useUniwind();
  return theme === "dark" ? NT_COLORS.dark : NT_COLORS.light;
}
