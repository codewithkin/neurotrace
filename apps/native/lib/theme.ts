import { Platform } from "react-native";

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
