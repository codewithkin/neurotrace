import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { RESPONSE_SCALE, ResponseValue } from "@/lib/asrs/scoring";

const PILL_STYLES = [
  "bg-blue-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-violet-600",
  "bg-purple-700",
] as const;

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
          <Pressable
            key={option.value}
            accessibilityRole="button"
            onPressIn={() => Haptics.selectionAsync()}
            onPress={() => onSelect(option.value)}
            className={`rounded-xl px-5 py-4 ${PILL_STYLES[option.value]} ${isSelected ? "opacity-100 ring-2 ring-white/70" : "opacity-90"}`}
          >
            <Text className="text-center text-base font-semibold text-white">
              {t(`scale.${option.key}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
