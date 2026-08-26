import { Ionicons } from "@expo/vector-icons";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import { Switch } from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, View } from "react-native";

import { Container } from "@/components/container";
import { SectionLabel } from "@/components/ui/atoms";
import { FadeSlideIn } from "@/components/ui/motion";
import { PressableScale } from "@/components/ui/pressable-scale";
import { applyLayoutDirection } from "@/lib/i18n/layout-direction";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";
import {
  cancelDailyCheckInReminder,
  scheduleDailyCheckInReminder,
} from "@/lib/notifications/reminders";
import { MONO_FONT, useNTColors } from "@/lib/theme";
import {
  clearAllData,
  getDailyReminderEnabled,
  getLanguageCode,
  setDailyReminderEnabled,
} from "@/lib/storage/app-storage";

/*
 * Settings, from designs "Light/Dark 15 Settings tab".
 *
 * The design's first App row is "Remove ads"; it is not built, because
 * RevenueCat came out for V1 and D-004 hides the row until in-app purchase
 * returns. Everything below it is the design's.
 */
export default function SettingsTab() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const nt = useNTColors();

  const [languageCode, setLanguageCodeState] = useState(getLanguageCode());
  const [dailyReminder, setDailyReminder] = useState(getDailyReminderEnabled());

  function changeLanguage(code: string) {
    setLanguageCodeState(code);
    i18n.changeLanguage(code);
    applyLayoutDirection(code); // reloads the app if the RTL direction flips
  }

  async function toggleDailyReminder(value: boolean) {
    setDailyReminder(value);
    setDailyReminderEnabled(value);

    if (value) {
      const ok = await scheduleDailyCheckInReminder(
        t("tracker.title"),
        t("settings.daily_reminder_body"),
      );
      if (!ok) {
        setDailyReminder(false);
        setDailyReminderEnabled(false);
      }
    } else {
      await cancelDailyCheckInReminder();
    }
  }

  function confirmClearData() {
    Alert.alert(t("settings.clear_data"), t("settings.clear_data_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.clear_data"),
        style: "destructive",
        onPress: () => {
          clearAllData();
          router.replace("/");
        },
      },
    ]);
  }

  return (
    <Container className="px-4 pt-[26px]">
      <FadeSlideIn>
        <Text className="text-foreground text-[28px] font-semibold tracking-[-0.03em]">
          {t("settings.title")}
        </Text>
      </FadeSlideIn>

      <FadeSlideIn index={1}>
        <View className="mt-[26px]">
          <SectionLabel className="tracking-[0.14em]">
            {t("settings.language")}
          </SectionLabel>
        </View>
        <View className="mt-3 flex-row flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const selected = lang.code === languageCode;
            return (
              <PressableScale
                key={lang.code}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => changeLanguage(lang.code)}
                className={`rounded-full ${selected ? "bg-accent" : "border border-border"}`}
                contentStyle={{ paddingVertical: 9, paddingHorizontal: 15 }}
              >
                <Text
                  className={`text-sm font-semibold ${selected ? "text-white" : "text-muted"}`}
                >
                  {lang.nativeName}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </FadeSlideIn>

      <FadeSlideIn index={2}>
        <View className="mt-7">
          <SectionLabel className="tracking-[0.14em]">{t("settings.app")}</SectionLabel>
        </View>
        <View className="mt-3 overflow-hidden rounded-[18px] border border-border bg-surface">
          <View
            className="flex-row items-center gap-3"
            style={{ paddingVertical: 15, paddingHorizontal: 16 }}
          >
            <Ionicons name="notifications-outline" size={20} color={nt.pri} />
            <Text className="text-foreground flex-1 text-sm font-semibold">
              {t("settings.daily_reminder")}
            </Text>
            <Switch isSelected={dailyReminder} onSelectedChange={toggleDailyReminder} />
          </View>

          <View className="h-px bg-border" />

          <PressableScale
            accessibilityRole="button"
            onPress={() => router.push("/assessment/part-a")}
            className="flex-row items-center gap-3"
            contentStyle={{ paddingVertical: 15, paddingHorizontal: 16 }}
          >
            <Ionicons name="list-outline" size={20} color={nt.pri} />
            <Text className="text-foreground flex-1 text-sm font-semibold">
              {t("settings.retake_assessment")}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={nt.muted} />
          </PressableScale>
        </View>
      </FadeSlideIn>

      <FadeSlideIn index={3}>
        <View
          className="mt-5 flex-row gap-3 rounded-2xl bg-nt-tint"
          style={{ paddingVertical: 14, paddingHorizontal: 16 }}
        >
          <Ionicons name="lock-closed-outline" size={20} color={nt.pri} />
          <Text className="text-muted flex-1 text-xs" style={{ lineHeight: 18 }}>
            {t("settings.privacy_note")}
          </Text>
        </View>

        <PressableScale
          accessibilityRole="button"
          onPress={confirmClearData}
          className="mt-5 items-center rounded-2xl bg-nt-danger-bg"
          contentStyle={{ padding: 15 }}
        >
          <Text className="text-nt-danger-fg text-[15px] font-semibold">
            {t("settings.clear_data")}
          </Text>
        </PressableScale>
      </FadeSlideIn>

      <Text
        className="text-muted mb-[22px] mt-auto pt-8 text-center text-[11px] font-medium tracking-[0.1em]"
        style={{ fontFamily: MONO_FONT }}
      >
        NeuroTrace {Application.nativeApplicationVersion ?? "1.0.0"} (
        {Application.nativeBuildVersion ?? "1"})
      </Text>
    </Container>
  );
}
