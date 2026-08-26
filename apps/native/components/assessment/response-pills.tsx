import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { PressableScale } from "@/components/ui/pressable-scale";
import { RESPONSE_SCALE, ResponseValue } from "@/lib/asrs/scoring";
import { FREQ_RAMP, MONO_FONT } from "@/lib/theme";

/*
 * Frequency scale, from designs "Light/Dark 06 Part A question" and
 * "08 Part B question": full-width rows at 17px/20px padding, 16px radius,
 * the 0-4 ramp colour at .92 opacity, white 16px/600 label, and a mono
 * numeral on the right at .75.
 *
 * The selected row goes to full opacity and gains the design's double ring
 * (3px of ground, then 3px of ink/white). CSS draws that with box-shadow,
 * which does not exist in React Native, so the two rings are absolutely
 * positioned outside the pill — that keeps them out of layout, exactly as
 * a box-shadow would be.
 */
export function ResponsePills({
  selectedValue,
  onSelect,
}: {
  selectedValue?: number;
  onSelect: (value: ResponseValue) => void;
}) {
  const { t } = useTranslation();

  return (
    <View className="gap-2.5">
      {RESPONSE_SCALE.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <View key={option.value}>
            {isSelected && (
              <>
                <View
                  pointerEvents="none"
                  className="absolute border-nt-ring"
                  style={{
                    top: -6,
                    left: -6,
                    right: -6,
                    bottom: -6,
                    borderWidth: 3,
                    borderRadius: 22,
                  }}
                />
                <View
                  pointerEvents="none"
                  className="absolute border-background"
                  style={{
                    top: -3,
                    left: -3,
                    right: -3,
                    bottom: -3,
                    borderWidth: 3,
                    borderRadius: 19,
                  }}
                />
              </>
            )}
            <PressableScale
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPressIn={() => Haptics.selectionAsync()}
              onPress={() => onSelect(option.value)}
              className="flex-row items-center justify-between"
              contentStyle={{
                backgroundColor: FREQ_RAMP[option.value],
                opacity: isSelected ? 1 : 0.92,
                borderRadius: 16,
                paddingVertical: 17,
                paddingHorizontal: 20,
              }}
            >
              <Text className="text-base font-semibold text-white">
                {t(`scale.${option.key}`)}
              </Text>
              {isSelected ? (
                <Ionicons name="checkmark" size={19} color="#ffffff" />
              ) : (
                <Text
                  className="text-[11px] font-semibold text-white"
                  style={{ fontFamily: MONO_FONT, opacity: 0.75 }}
                >
                  {option.value}
                </Text>
              )}
            </PressableScale>
          </View>
        );
      })}
    </View>
  );
}
