import { Text, View } from "react-native";
import { useThemeColor } from "heroui-native";

import { AnimatedBar } from "@/components/ui/motion";
import { MONO_FONT } from "@/lib/theme";

/*
 * Assessment progress header from designs "Light/Dark 06/07/08":
 * 40px above an 8px/4px-radius bar, then a 12px gap to an 11px mono caps
 * label at .16em. The milestone screen dims the whole block to .35.
 */
export function AssessmentProgressHeader({
  pct,
  label,
  dimmed = false,
}: {
  /** 0-100 */
  pct: number;
  label: string;
  dimmed?: boolean;
}) {
  const accent = useThemeColor("accent");

  return (
    <View className="pt-10" style={dimmed ? { opacity: 0.35 } : undefined}>
      <AnimatedBar pct={pct} color={accent} height={8} radius={4} />
      <Text
        className="text-muted mt-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ fontFamily: MONO_FONT }}
      >
        {label}
      </Text>
    </View>
  );
}
