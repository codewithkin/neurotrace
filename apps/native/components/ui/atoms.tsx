import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { MONO_FONT, useNTColors } from "@/lib/theme";

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

/**
 * Rounded status badge. The amber/green pairs are the design's own status
 * tokens (`--nt-amber-*`, `--nt-green-*`), not Tailwind's amber-100/800,
 * which are a shade off in both themes.
 */
export function BadgeChip({
  label,
  tone,
  icon,
  size = "md",
}: {
  label: string;
  tone: "amber" | "green" | "violet";
  icon?: keyof typeof Ionicons.glyphMap;
  size?: "sm" | "md" | "lg";
}) {
  const surface = {
    amber: "bg-nt-amber-bg",
    green: "bg-nt-green-bg",
    violet: "bg-nt-tint",
  } as const;
  const foreground = {
    amber: "text-nt-amber-fg",
    green: "text-nt-green-fg",
    violet: "text-primary",
  } as const;
  const nt = useNTColors();
  const iconColor = {
    amber: nt.amberFg,
    green: nt.greenFg,
    violet: nt.pri,
  } as const;
  const metrics = {
    sm: { paddingVertical: 6, paddingHorizontal: 11, fontSize: 12, icon: 15, gap: 6 },
    md: { paddingVertical: 7, paddingHorizontal: 13, fontSize: 13, icon: 16, gap: 7 },
    lg: { paddingVertical: 9, paddingHorizontal: 16, fontSize: 14, icon: 18, gap: 8 },
  } as const;
  const m = metrics[size];

  return (
    <View
      className={`self-start flex-row items-center rounded-full ${surface[tone]}`}
      style={{ paddingVertical: m.paddingVertical, paddingHorizontal: m.paddingHorizontal, gap: m.gap }}
    >
      {icon ? <Ionicons name={icon} size={m.icon} color={iconColor[tone]} /> : null}
      <Text className={`font-semibold ${foreground[tone]}`} style={{ fontSize: m.fontSize }}>
        {label}
      </Text>
    </View>
  );
}
