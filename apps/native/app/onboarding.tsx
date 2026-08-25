import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Button, Checkbox, Separator, Surface } from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  isRTL,
} from "@/lib/i18n/languages";
import {
  AssessmentPace,
  getLanguageCode,
  setLanguageCode,
  setOnboardingCompleted,
  setPace as persistPace,
} from "@/lib/storage/app-storage";

const TOTAL_STEPS = 5;

const INTENT_KEYS = [
  "onboarding.intent.option_doctor_visit",
  "onboarding.intent.option_focus_struggles",
  "onboarding.intent.option_organization",
  "onboarding.intent.option_curious",
  "onboarding.intent.option_support_someone",
] as const;

function StepDots({ current }: { current: number }) {
  return (
    <View className="flex-row items-center justify-center gap-1.5 py-4">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View
          key={i}
          className={`h-1.5 rounded-full ${i === current ? "w-6 bg-primary" : i < current ? "w-1.5 bg-primary/60" : "w-1.5 bg-muted"}`}
        />
      ))}
    </View>
  );
}

function OptionCard({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Surface
        variant={selected ? "tertiary" : "secondary"}
        className={`rounded-xl border px-4 py-3 ${selected ? "border-primary" : "border-transparent"}`}
      >
        <Text
          className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}
        >
          {label}
        </Text>
        {description ? (
          <Text className="text-muted mt-1 text-xs leading-snug">
            {description}
          </Text>
        ) : null}
      </Surface>
    </Pressable>
  );
}

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState(getLanguageCode() || DEFAULT_LANGUAGE);
  const [intent, setIntent] = useState<string | null>(null);
  const [pace, setPaceState] = useState<AssessmentPace>("fast");
  const [legalAccepted, setLegalAccepted] = useState(false);

  function selectLanguage(code: string) {
    setLanguage(code);
    i18n.changeLanguage(code);
    setLanguageCode(code);
    const shouldForceRTL = isRTL(code);
    if (I18nManager.isRTL !== shouldForceRTL) {
      // Takes full effect after the app restarts.
      I18nManager.allowRTL(shouldForceRTL);
      I18nManager.forceRTL(shouldForceRTL);
    }
    Haptics.selectionAsync();
    setTimeout(() => setStep(1), 220);
  }

  function selectIntent(key: (typeof INTENT_KEYS)[number]) {
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
      <StepDots current={step} />

      {/* Step 1: Language */}
      {step === 0 && (
        <View className="flex-1">
          <Text className="text-foreground text-2xl font-semibold tracking-tight">
            {t("onboarding.language.title")}
          </Text>
          <Text className="text-muted mt-1 mb-4 text-sm">
            {t("onboarding.language.subtitle")}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <View key={lang.code} className="w-[48%] grow">
                <OptionCard
                  label={lang.nativeName}
                  selected={language === lang.code}
                  onPress={() => selectLanguage(lang.code)}
                />
              </View>
            ))}
          </View>
          <Button variant="secondary" className="mt-4" onPress={() => setStep(1)}>
            {t("common.continue")}
          </Button>
        </View>
      )}

      {/* Step 2: Intent */}
      {step === 1 && (
        <View className="flex-1">
          <Text className="text-foreground text-2xl font-semibold tracking-tight">
            {t("onboarding.intent.title")}
          </Text>
          <Text className="text-muted mt-1 mb-4 text-sm">
            {t("onboarding.intent.subtitle")}
          </Text>
          <View className="gap-2">
            {INTENT_KEYS.map((key) => (
              <OptionCard
                key={key}
                label={t(key)}
                selected={intent === key}
                onPress={() => selectIntent(key)}
              />
            ))}
          </View>
          <Button variant="ghost" className="mt-2 self-start px-2" onPress={() => setStep(0)}>
            ← {t("common.back")}
          </Button>
        </View>
      )}

      {/* Step 3: Value teaser */}
      {step === 2 && (
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-foreground text-2xl font-semibold tracking-tight">
              {t("onboarding.value.title")}
            </Text>
            <Text className="text-muted mt-1 text-sm leading-relaxed">
              {t("onboarding.value.subtitle")}
            </Text>
          </View>

          <Surface variant="secondary" className="rounded-2xl p-5">
            <Text className="text-foreground text-base font-semibold">
              {t("onboarding.value.pdf_preview_title")}
            </Text>
            <Text className="text-muted mb-3 mt-0.5 text-xs tracking-wide uppercase">
              {t("onboarding.value.pdf_preview_subtitle")}
            </Text>
            <Separator className="mb-3" />
            {[
              t("onboarding.value.pdf_preview_row_score"),
              t("onboarding.value.pdf_preview_row_inattention"),
              t("onboarding.value.pdf_preview_row_hyperactivity"),
            ].map((row) => (
              <View key={row} className="mb-2.5 flex-row items-center justify-between">
                <Text className="text-foreground/80 text-xs">{row}</Text>
                <View className="h-1.5 w-20 rounded-full bg-primary/50" />
              </View>
            ))}
          </Surface>

          <Button onPress={() => setStep(3)}>{t("common.continue")}</Button>
          <Button variant="ghost" className="mt-2 self-start px-2" onPress={() => setStep(1)}>
            ← {t("common.back")}
          </Button>
        </View>
      )}

      {/* Step 4: Pace selector */}
      {step === 3 && (
        <View className="flex-1">
          <Text className="text-foreground text-2xl font-semibold tracking-tight">
            {t("onboarding.pace.title")}
          </Text>
          <View className="mt-4 gap-3">
            <OptionCard
              label={`⚡ ${t("onboarding.pace.fast_pace")}`}
              description={t("onboarding.pace.fast_pace_desc")}
              selected={pace === "fast"}
              onPress={() => {
                setPaceState("fast");
                Haptics.selectionAsync();
              }}
            />
            <OptionCard
              label={`📋 ${t("onboarding.pace.full_list")}`}
              description={t("onboarding.pace.full_list_desc")}
              selected={pace === "list"}
              onPress={() => {
                setPaceState("list");
                Haptics.selectionAsync();
              }}
            />
          </View>
          <Button className="mt-6" onPress={() => setStep(4)}>
            {t("common.continue")}
          </Button>
          <Button variant="ghost" className="mt-2 self-start px-2" onPress={() => setStep(2)}>
            ← {t("common.back")}
          </Button>
        </View>
      )}

      {/* Step 5: Legal gate */}
      {step === 4 && (
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-foreground text-2xl font-semibold tracking-tight">
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

            <Button isDisabled={!legalAccepted} size="lg" onPress={finish}>
              {t("onboarding.legal.cta")}
            </Button>
            <Button variant="ghost" className="self-start px-2" onPress={() => setStep(3)}>
              ← {t("common.back")}
            </Button>
          </View>
        </View>
      )}
    </Container>
  );
}
