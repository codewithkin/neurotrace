import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Checkbox, useThemeColor } from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import {
  ArrowRightIcon,
  GhostButton,
  PrimaryButton,
  StepDots,
} from "@/components/ui/buttons";
import { FadeSlideIn } from "@/components/ui/motion";
import { PressableScale } from "@/components/ui/pressable-scale";
import { applyLayoutDirection } from "@/lib/i18n/layout-direction";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "@/lib/i18n/languages";
import {
  AssessmentPace,
  getLanguageCode,
  setLanguageCode,
  setOnboardingCompleted,
  setPace as persistPace,
} from "@/lib/storage/app-storage";

const TOTAL_STEPS = 5;

const INTENTS: Array<{
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: "option_focus_struggles", icon: "bulb-outline" },
  { key: "option_doctor_visit", icon: "medical-outline" },
  { key: "option_organization", icon: "stats-chart-outline" },
  { key: "option_curious", icon: "search-outline" },
  { key: "option_support_someone", icon: "people-outline" },
];

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const accent = useThemeColor("accent");
  const muted = useThemeColor("muted");

  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState(getLanguageCode() || DEFAULT_LANGUAGE);
  const [intent, setIntent] = useState<string | null>(null);
  const [pace, setPaceState] = useState<AssessmentPace>("fast");
  const [legalAccepted, setLegalAccepted] = useState(false);

  function selectLanguage(code: string) {
    setLanguage(code);
    i18n.changeLanguage(code);
    setLanguageCode(code);
    applyLayoutDirection(code); // reloads the app if the RTL direction flips
    Haptics.selectionAsync();
    setTimeout(() => setStep(1), 220);
  }

  function selectIntent(key: string) {
    setIntent(key);
    Haptics.selectionAsync();
    setTimeout(() => setStep(2), 220);
  }

  function finish() {
    persistPace(pace);
    setOnboardingCompleted(true);
    router.replace("/(tabs)");
  }

  return (
    <Container className="px-4" isScrollable={false}>
      <StepDots total={TOTAL_STEPS} current={step} />

      {/* Step 1: Language */}
      {step === 0 && (
        <View className="flex-1">
          <FadeSlideIn>
            <Text className="text-foreground text-[26px] font-semibold tracking-[-0.03em]">
              {t("onboarding.language.title")}
            </Text>
            <Text className="text-muted mt-1.5 text-sm leading-snug">
              {t("onboarding.language.subtitle")}
            </Text>
          </FadeSlideIn>

          <View className="mt-6 flex-row flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.map((lang, i) => {
              const selected = language === lang.code;
              return (
                <FadeSlideIn key={lang.code} index={i} className="w-[48.5%] grow">
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectLanguage(lang.code)}
                    className={`h-full rounded-2xl border px-3.5 py-3.5 ${
                      selected
                        ? "border-nt-pri-border bg-nt-tint"
                        : "border-border bg-surface"
                    }`}
                  >
                    <View className="flex-row items-center justify-between gap-1">
                      <Text className="text-[15px] font-semibold text-foreground">
                        {lang.nativeName}
                      </Text>
                      {selected && (
                        <Ionicons name="checkmark-circle" size={19} color={accent} />
                      )}
                    </View>
                    <Text className="text-muted mt-0.5 text-xs">{lang.englishName}</Text>
                  </PressableScale>
                </FadeSlideIn>
              );
            })}
          </View>

          <View className="mb-8 mt-auto">
            <FadeSlideIn index={4}>
              <PrimaryButton
                label={t("common.continue")}
                icon={<ArrowRightIcon />}
                onPress={() => setStep(1)}
              />
            </FadeSlideIn>
          </View>
        </View>
      )}

      {/* Step 2: Intent */}
      {step === 1 && (
        <View className="flex-1">
          <FadeSlideIn>
            <Text className="text-foreground text-[26px] font-semibold tracking-[-0.03em]">
              {t("onboarding.intent.title")}
            </Text>
            <Text className="text-muted mt-1.5 text-sm leading-snug">
              {t("onboarding.intent.subtitle")}
            </Text>
          </FadeSlideIn>

          <View className="mt-6 gap-2.5">
            {INTENTS.map((item, i) => {
              const selected = intent === item.key;
              return (
                <FadeSlideIn key={item.key} index={i}>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectIntent(item.key)}
                    className={`flex-row items-center gap-3.5 rounded-[18px] border p-4 ${
                      selected
                        ? "border-nt-pri-border bg-nt-tint"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={selected ? accent : muted}
                    />
                    <View className="flex-1 gap-0.5">
                      <Text className="text-base font-semibold text-foreground">
                        {t(`onboarding.intent.${item.key}`)}
                      </Text>
                      <Text className="text-muted text-[13px]">
                        {t(`onboarding.intent.${item.key}_desc`)}
                      </Text>
                    </View>
                    <Ionicons
                      name={selected ? "checkmark-circle" : "chevron-forward"}
                      size={20}
                      color={selected ? accent : muted}
                    />
                  </PressableScale>
                </FadeSlideIn>
              );
            })}
          </View>

          <Text className="text-muted mb-9 mt-auto self-center text-xs">
            {t("onboarding.intent.tap_to_continue")}
          </Text>

          <GhostButton label={`â† ${t("common.back")}`} onPress={() => setStep(0)} />
        </View>
      )}

      {/* Step 3: Value teaser (restyled in the next design pass) */}
      {step === 2 && (
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-foreground text-[26px] font-semibold tracking-[-0.03em]">
              {t("onboarding.value.title")}
            </Text>
            <Text className="text-muted mt-1.5 text-sm leading-relaxed">
              {t("onboarding.value.subtitle")}
            </Text>
          </View>

          <View className="rounded-[20px] border border-border bg-surface p-5">
            <Text className="text-foreground text-lg font-semibold tracking-tight">
              ASRS v1.1 Screening Summary
            </Text>
            <Text className="text-primary mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ fontFamily: "Menlo" }}>
              {t("onboarding.value.pdf_preview_subtitle")}
            </Text>
            <View className="my-4 h-px bg-border" />
            {[
              { label: t("onboarding.value.pdf_preview_row_inattention"), pct: 76, op: 1 },
              { label: t("onboarding.value.pdf_preview_row_hyperactivity"), pct: 48, op: 0.75 },
              { label: t("onboarding.value.pdf_preview_row_score"), pct: 62, op: 0.55 },
            ].map((row) => (
              <View key={row.label} className="mb-3.5">
                <Text className="text-muted text-xs font-semibold">{row.label}</Text>
                <View className="mt-1.5 h-[7px] w-full overflow-hidden rounded-full bg-nt-track">
                  <View
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${row.pct}%`, opacity: row.op }}
                  />
                </View>
              </View>
            ))}
          </View>

          <View className="gap-3 pb-4">
            {[t("onboarding.value.perk_export"), t("onboarding.value.perk_privacy")].map(
              (perk) => (
                <View key={perk} className="flex-row items-center gap-3">
                  <Ionicons name="shield-checkmark-outline" size={21} color={accent} />
                  <Text className="text-muted flex-1 text-sm">{perk}</Text>
                </View>
              ),
            )}
          </View>

          <PrimaryButton
            label={t("common.continue")}
            icon={<ArrowRightIcon />}
            onPress={() => setStep(3)}
          />
          <GhostButton label={`â† ${t("common.back")}`} onPress={() => setStep(1)} />
        </View>
      )}

      {/* Step 4: Pace selector (behavior mapping lands in the next pass) */}
      {step === 3 && (
        <View className="flex-1">
          <Text className="text-foreground text-[26px] font-semibold tracking-[-0.03em]">
            {t("onboarding.pace.title")}
          </Text>
          <View className="mt-6 gap-2.5">
            {(["fast", "list"] as AssessmentPace[]).map((mode) => (
              <PressableScale
                key={mode}
                accessibilityRole="button"
                accessibilityState={{ selected: pace === mode }}
                onPress={() => {
                  setPaceState(mode);
                  Haptics.selectionAsync();
                }}
                className={`rounded-[18px] border p-4 ${
                  pace === mode
                    ? "border-nt-pri-border bg-nt-tint"
                    : "border-border bg-surface"
                }`}
              >
                <Text className="text-base font-semibold text-foreground">
                  {mode === "fast"
                    ? t("onboarding.pace.fast_pace")
                    : t("onboarding.pace.full_list")}
                </Text>
                <Text className="text-muted mt-1 text-[13px] leading-snug">
                  {mode === "fast"
                    ? t("onboarding.pace.fast_pace_desc")
                    : t("onboarding.pace.full_list_desc")}
                </Text>
              </PressableScale>
            ))}
          </View>
          <View className="mt-auto pb-4">
            <PrimaryButton
              label={t("common.continue")}
              icon={<ArrowRightIcon />}
              onPress={() => setStep(4)}
            />
          </View>
          <GhostButton label={`â† ${t("common.back")}`} onPress={() => setStep(2)} />
        </View>
      )}

      {/* Step 5: Legal gate */}
      {step === 4 && (
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-foreground text-[26px] font-semibold tracking-[-0.03em]">
              {t("app_name")}
            </Text>
            <Text className="text-muted mt-6 text-sm leading-relaxed">
              {t("results.disclaimer")}
            </Text>
          </View>

          <View className="gap-4 pb-4">
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: legalAccepted }}
              onPress={() => {
                setLegalAccepted(!legalAccepted);
                Haptics.selectionAsync();
              }}
              className="flex-row items-start gap-3"
            >
              <Checkbox isSelected={legalAccepted} onSelectedChange={setLegalAccepted}>
                <Checkbox.Indicator />
              </Checkbox>
              <Text className="text-muted flex-1 text-sm leading-relaxed">
                {t("onboarding.legal.checkbox")}
              </Text>
            </Pressable>

            <PrimaryButton
              label={t("onboarding.legal.cta")}
              disabled={!legalAccepted}
              onPress={finish}
            />
            <GhostButton label={`â† ${t("common.back")}`} onPress={() => setStep(3)} />
          </View>
        </View>
      )}
    </Container>
  );
}

