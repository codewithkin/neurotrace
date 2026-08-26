import { Text, View } from "react-native";

import { MONO_FONT } from "@/lib/theme";

/**
 * Design-language section label: tiny mono uppercase with wide tracking
 * (e.g. "TRAIT BREAKDOWN", "SESSIONS").
 */
export function SectionLabel({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <Text
      className={`text-muted text-[11px] font-semibold tracking-[0.16em] uppercase ${className}`}
      style={{ fontFamily: MONO_FONT }}
    >
      {children}
    </Text>
  );
}

/** Monospaced numeric value (percentages, scores, slider readings). */
export function MonoValue({
  children,
  className = "",
}: {
  children: string | number;
  className?: string;
}) {
  return (
    <Text className={`text-foreground font-semibold ${className}`} style={{ fontFamily: MONO_FONT }}>
      {children}
    </Text>
  );
}

/** Rounded status badge (amber "consistent", green "low", etc.). */
export function BadgeChip({
  label,
  tone,
}: {
  label: string;
  tone: "amber" | "green" | "violet";
}) {
  const tones = {
    amber: "bg-amber-100 dark:bg-amber-900/25",
    green: "bg-green-100 dark:bg-green-900/25",
    violet: "bg-nt-tint",
  } as const;
  const fg = {
    amber: "text-amber-800 dark:text-amber-400",
    green: "text-green-800 dark:text-green-400",
    violet: "text-primary",
  } as const;

  return (
    <View className={`self-start flex-row items-center gap-2 rounded-full px-4 py-2 ${tones[tone]}`}>
      <Text className={`text-sm font-semibold ${fg[tone]}`}>{label}</Text>
    </View>
  );
}
