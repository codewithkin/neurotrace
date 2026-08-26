import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "@/components/ui/pressable-scale";
import { useThemeColor } from "heroui-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

/**
 * Full-width violet CTA from the design language: 16px radius, centered
 * bold label, trailing icon, subtle press scale.
 *
 * Sizes come straight from the design file: onboarding steps 01/03/04 use
 * 16px padding + 16px label ("md"); the legal gate's "Start screening"
 * uses 17px padding + 17px label ("lg").
 */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  icon,
  iconPosition = "trailing",
  size = "md",
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  /** The design puts the arrow after the label and glyph icons before it. */
  iconPosition?: "leading" | "trailing";
  size?: "md" | "lg";
}) {
  const accentForeground = useThemeColor("accent-foreground");
  const large = size === "lg";

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`flex-row items-center justify-center gap-2 rounded-2xl bg-accent px-4 ${disabled ? "opacity-50" : ""}`}
      contentStyle={{ paddingVertical: large ? 17 : 16 }}
      onPress={disabled ? undefined : onPress}
    >
      {iconPosition === "leading" ? icon : null}
      <Text
        className="font-semibold"
        style={{ color: accentForeground, fontSize: large ? 17 : 16 }}
      >
        {label}
      </Text>
      {iconPosition === "trailing" ? icon : null}
    </PressableScale>
  );
}

/** Ghost text button (e.g. "Retake assessment"). */
export function GhostButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      className="items-center justify-center px-4 py-3.5"
      onPress={onPress}
    >
      <Text className="text-muted text-[15px] font-semibold">{label}</Text>
    </PressableScale>
  );
}

/** Secondary outlined button (Save to Files, Print, Start fresh...). */
export function OutlineButton({
  label,
  onPress,
  icon,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3.5 ${disabled ? "opacity-50" : ""}`}
      onPress={disabled ? undefined : onPress}
    >
      {icon}
      <Text className="text-[15px] font-semibold text-foreground">{label}</Text>
    </PressableScale>
  );
}

/**
 * Onboarding step indicator: wide violet pill for the active step,
 * smaller filled dot for completed, track-colored dot for upcoming.
 * Geometry from the design file: 6px dots, 24px active pill, 5px gap,
 * 18px vertical padding.
 */
export function StepDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <View
      className="flex-row items-center justify-center"
      style={{ gap: 5, paddingVertical: 18 }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{ height: 6, width: i === current ? 24 : 6, borderRadius: 3 }}
          className={
            i === current
              ? "bg-primary"
              : i < current
                ? "bg-primary opacity-60"
                : "bg-nt-track"
          }
        />
      ))}
    </View>
  );
}

/** An Ionicon tinted to sit on the accent surface (white in both themes). */
export function AccentIcon({
  name,
  size = 20,
}: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
}) {
  const accentForeground = useThemeColor("accent-foreground");
  return <Ionicons name={name} size={size} color={accentForeground} />;
}

export function ArrowRightIcon() {
  return <AccentIcon name="arrow-forward" size={20} />;
}
