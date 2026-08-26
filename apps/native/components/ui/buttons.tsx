import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "@/components/ui/pressable-scale";
import { useThemeColor } from "heroui-native";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

/**
 * Full-width violet CTA from the design language: 16px radius, centered
 * bold label, trailing icon, subtle press scale.
 */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  icon,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  const accentForeground = useThemeColor("accent-foreground");

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`flex-row items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-4 ${disabled ? "opacity-50" : ""}`}
      onPress={disabled ? undefined : onPress}
    >
      <Text className="text-base font-semibold" style={{ color: accentForeground }}>
        {label}
      </Text>
      {icon}
    </PressableScale>
  );
}

/** Ghost text button (e.g. "Retake assessment", "Back"). */
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

/** Secondary outlined button (Save to Files, Print, Start fresh…). */
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
 */
export function StepDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <View className="flex-row items-center justify-center gap-1.5 py-4">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={`h-1.5 rounded-full ${
            i === current
              ? "w-6 bg-primary"
              : i < current
                ? "w-1.5 bg-primary opacity-60"
                : "w-1.5 bg-nt-track"
          }`}
        />
      ))}
    </View>
  );
}

export function ArrowRightIcon() {
  const accentForeground = useThemeColor("accent-foreground");
  return <Ionicons name="arrow-forward" size={19} color={accentForeground} />;
}
