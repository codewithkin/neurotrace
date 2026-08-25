import * as Haptics from "expo-haptics";
import { Button, Chip, Slider, Switch, Surface } from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import {
  calculateStreak,
  getTodayEntry,
  saveTodayEntry,
} from "@/lib/tracker/entries";

interface SliderConfig {
  key: "focusLevel" | "brainFog" | "executiveFriction" | "mood";
  emoji: string;
}

const SLIDERS: SliderConfig[] = [
  { key: "focusLevel", emoji: "🎯" },
  { key: "brainFog", emoji: "🌫️" },
  { key: "executiveFriction", emoji: "⚙️" },
  { key: "mood", emoji: "🌤️" },
];

export default function TrackerTab() {
  const { t } = useTranslation();

  const todayEntry = getTodayEntry();
  const [streak] = useState(calculateStreak);
  const [values, setValues] = useState<Record<string, number>>(() => {
    if (todayEntry) {
      return {
        focusLevel: todayEntry.focusLevel,
        brainFog: todayEntry.brainFog,
        executiveFriction: todayEntry.executiveFriction,
        mood: todayEntry.mood,
      };
    }
    return { focusLevel: 5, brainFog: 5, executiveFriction: 5, mood: 5 };
  });
  const [medicationTaken, setMedicationTaken] = useState(
    todayEntry?.medicationTaken ?? false,
  );
  const [saved, setSaved] = useState(Boolean(todayEntry));

  function handleSave() {
    saveTodayEntry({
      focusLevel: values.focusLevel,
      brainFog: values.brainFog,
      executiveFriction: values.executiveFriction,
      mood: values.mood,
      medicationTaken,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaved(true);
  }

  return (
    <Container
      className="px-4"
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
    >
      {/* Streak header */}
      <View className="items-center py-6">
        <Chip variant="secondary" color="warning" size="lg">
          <Chip.Label>🔥 {t("tracker.streak", { count: streak })}</Chip.Label>
        </Chip>
        <Text className="text-foreground mt-3 text-2xl font-semibold tracking-tight">
          {t("tracker.title")}
        </Text>
      </View>

      <Surface variant="secondary" className="gap-7 rounded-2xl p-5">
        {SLIDERS.map(({ key, emoji }) => (
          <View key={key} className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-foreground text-sm font-medium">
                {emoji} {t(`tracker.${key}`)}
              </Text>
              <Text className="text-muted text-sm font-semibold tabular-nums">
                {values[key]}
              </Text>
            </View>
            <Slider
              value={values[key]}
              minValue={0}
              maxValue={10}
              step={1}
              onChange={(v) =>
                setValues((prev) => ({
                  ...prev,
                  [key]: Array.isArray(v) ? v[0] : v,
                }))
              }
              onChangeEnd={() => Haptics.selectionAsync()}
            >
              <Slider.Track>
                <Slider.Fill />
                <Slider.Thumb />
              </Slider.Track>
            </Slider>
          </View>
        ))}

        {/* Medication toggle */}
        <View className="flex-row items-center justify-between pt-1">
          <Text className="text-foreground flex-1 text-sm font-medium">
            💊 {t("tracker.medication_taken")}
          </Text>
          <Switch
            isSelected={medicationTaken}
            onSelectedChange={(v) => {
              setMedicationTaken(v);
              Haptics.selectionAsync();
            }}
          />
        </View>
      </Surface>

      <Button size="lg" className="mt-6" isDisabled={saved} onPress={handleSave}>
        {saved ? t("tracker.already_logged") : t("tracker.save_entry")}
      </Button>
      {saved ? (
        <Text className="text-success mt-3 text-center text-xs font-medium">
          ✓ {t("tracker.entry_saved")}
        </Text>
      ) : null}
    </Container>
  );
}
