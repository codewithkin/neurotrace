import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Switch } from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { MetricSlider } from "@/components/tracker/metric-slider";
import { BadgeChip, MonoValue } from "@/components/ui/atoms";
import { PrimaryButton } from "@/components/ui/buttons";
import { FadeSlideIn } from "@/components/ui/motion";
import { useNTColors } from "@/lib/theme";
import {
  calculateStreak,
  getTodayEntry,
  saveTodayEntry,
} from "@/lib/tracker/entries";

/*
 * Daily check-in, from designs "Light/Dark 12 Daily check-in".
 *
 * The four metrics stay ours — focusLevel / brainFog / executiveFriction /
 * mood — rather than the designer's Focus / Restlessness / Sleep quality /
 * Task follow-through, because the stored data and ten locales already use
 * them (D-002). The styling is the design's.
 */
const METRICS = [
  { key: "focusLevel", labelKey: "tracker.focus_level", icon: "locate-outline" },
  { key: "brainFog", labelKey: "tracker.brain_fog", icon: "cloudy-outline" },
  { key: "executiveFriction", labelKey: "tracker.executive_friction", icon: "cog-outline" },
  { key: "mood", labelKey: "tracker.mood", icon: "sunny-outline" },
] as const;

export default function TrackerTab() {
  const { t, i18n } = useTranslation();
  const nt = useNTColors();

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

  const today = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

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
    <Container className="px-4 pt-[22px]" isScrollable={false}>
      <FadeSlideIn>
        <View className="items-center">
          <BadgeChip
            size="lg"
            tone="amber"
            icon="flame"
            label={t("tracker.streak", { count: streak })}
          />
          <Text className="text-foreground mt-4 text-[26px] font-semibold tracking-[-0.03em]">
            {t("tracker.title")}
          </Text>
          <Text className="text-muted mt-[5px] text-[13px]">
            {t("tracker.subtitle", { date: today })}
          </Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn index={1}>
        <View className="mt-5 rounded-[20px] border border-border bg-surface p-5">
          <View className="gap-[22px]">
            {METRICS.map((metric) => (
              <View key={metric.key}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-[9px]">
                    <Ionicons name={metric.icon} size={19} color={nt.pri} />
                    <Text className="text-foreground text-sm font-semibold">
                      {t(metric.labelKey)}
                    </Text>
                  </View>
                  <MonoValue className="text-[15px]">{values[metric.key]}</MonoValue>
                </View>
                <MetricSlider
                  value={values[metric.key]}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [metric.key]: v }))
                  }
                  onCommit={() => Haptics.selectionAsync()}
                />
              </View>
            ))}
          </View>

          {/* Full-bleed hairline: the design bleeds it past the 20px padding. */}
          <View
            className="bg-border"
            style={{ height: 1, marginTop: 20, marginHorizontal: -20 }}
          />

          <View className="flex-row items-center gap-3 pt-4">
            <Ionicons name="medical-outline" size={20} color={nt.pri} />
            <Text className="text-foreground flex-1 text-sm font-semibold">
              {t("tracker.medication_taken")}
            </Text>
            <Switch
              isSelected={medicationTaken}
              onSelectedChange={(v) => {
                setMedicationTaken(v);
                Haptics.selectionAsync();
              }}
            />
          </View>
        </View>
      </FadeSlideIn>

      <View className="mb-4 mt-auto">
        <PrimaryButton
          label={saved ? t("tracker.already_logged") : t("tracker.save_entry")}
          disabled={saved}
          onPress={handleSave}
        />
      </View>
    </Container>
  );
}
