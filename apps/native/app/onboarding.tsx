import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "@/components/container";
import {
  ArrowRightIcon,
  PrimaryButton,
  StepDots,
} from "@/components/ui/buttons";
import { AnimatedBar, FadeSlideIn } from "@/components/ui/motion";
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

/*
 * Onboarding, built against designs/NeuroTrace Screens.dc.html screens
 * "Light/Dark 01 Language" .. "05 Legal gate".
 *
 * Geometry taken literally from the design file: content column padded
 * 8px 16px 0, headings 26px/-0.03em with a 6px subtitle gap, option rows
 * 18px radius / 16px padding, selected rows carry a 1.5px violet border
 * over the tint surface. None of the five screens has a visible Back
 * control (D-011) — Android hardware back still steps backwards.
 */

const TOTAL_STEPS = 5;

/** Design: the CTA block sits 34px clear of the screen bottom. */
const BOTTOM_GAP = 34;
/** Design: step 02's "tap an option" hint sits 42px clear of the bottom. */
const HINT_GAP = 42;

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

/**
 * The designer's three pace options collapse onto two stored behaviours
 * (D-003): a single sitting runs straight through, both split options
 * resume Part B from the Assess tab. `key` drives the selected state,
 * `pace` is what gets persisted.
 */
type PaceChoice = "sitting" | "split" | "daily";

const PACES: Array<{
  key: PaceChoice;
  icon: keyof typeof Ionicons.glyphMap;
  pace: AssessmentPace;
}> = [
  { key: "sitting", icon: "flash-outline", pace: "fast" },
  { key: "split", icon: "time-outline", pace: "two_sessions" },
  { key: "daily", icon: "moon-outline", pace: "two_sessions" },
];

const LEGAL_BULLETS: Array<{
  key: "bullet1" | "bullet2" | "bullet3";
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { key: "bullet1", icon: "document-text-outline" },
  { key: "bullet2", icon: "lock-closed-outline" },
  { key: "bullet3", icon: "alert-circle-outline" },
];

/** Report-teaser bars: percentages and fill opacities are from the design. */
const TEASER_ROWS = [
  { key: "pdf_preview_row_inattention", pct: 76, opacity: 1 },
  { key: "pdf_preview_row_hyperactivity", pct: 48, opacity: 0.75 },
  { key: "pdf_preview_row_score", pct: 62, opacity: 0.55 },
] as const;

function StepHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <FadeSlideIn>
      <Text className="text-foreground text-[26px] font-semibold tracking-[-0.03em]">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-muted mt-1.5 text-sm" style={{ lineHeight: 21 }}>
          {subtitle}
        </Text>
      ) : null}
    </FadeSlideIn>
  );
}

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const accent = useThemeColor("accent");
  const accentForeground = useThemeColor("accent-foreground");
  const muted = useThemeColor("muted");

  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState(getLanguageCode() || DEFAULT_LANGUAGE);
  const [intent, setIntent] = useState<string | null>(null);
  const [paceChoice, setPaceChoice] = useState<PaceChoice>("sitting");
  const [legalAccepted, setLegalAccepted] = useState(false);

  /* The design has no Back control; Android hardware back keeps the flow
     recoverable without adding one (D-011). */
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step > 0) {
        setStep((current) => current - 1);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [step]);

  /* Container already pads by the safe-area inset, so subtract it to land
     on the design's absolute distance from the screen edge. */
  const bottomPad = Math.max(0, BOTTOM_GAP - insets.bottom);
  const hintPad = Math.max(0, HINT_GAP - insets.bottom);

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

  function selectPace(choice: PaceChoice) {
    setPaceChoice(choice);
    Haptics.selectionAsync();
  }

  function finish() {
    persistPace(PACES.find((p) => p.key === paceChoice)?.pace ?? "fast");
    setOnboardingCompleted(true);
    router.replace("/(tabs)");
  }

  return (
    <Container className="px-4" isScrollable={false}>
      <StepDots total={TOTAL_STEPS} current={step} />

      {/* Step 01 — Language */}
      {step === 0 && (
        <View className="flex-1 pt-2">
          <StepHeading
            title={t("onboarding.language.title")}
            subtitle={t("onboarding.language.subtitle")}
          />

          <View className="mt-6 flex-row flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.map((lang, i) => {
              const selected = language === lang.code;
              return (
                <FadeSlideIn key={lang.code} index={i} className="w-[48.5%] grow">
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectLanguage(lang.code)}
                    contentStyle={{ borderWidth: selected ? 1.5 : 1 }}
                    className={`h-full gap-0.5 rounded-2xl p-3.5 ${
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
                    <Text className="text-muted text-xs">{lang.englishName}</Text>
                  </PressableScale>
                </FadeSlideIn>
              );
            })}
          </View>

          <View className="mt-auto" style={{ paddingBottom: bottomPad }}>
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

      {/* Step 02 — Intent */}
      {step === 1 && (
        <View className="flex-1 pt-2">
          <StepHeading
            title={t("onboarding.intent.title")}
            subtitle={t("onboarding.intent.subtitle")}
          />

          <View className="mt-6 gap-2.5">
            {INTENTS.map((item, i) => {
              const selected = intent === item.key;
              return (
                <FadeSlideIn key={item.key} index={i}>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectIntent(item.key)}
                    contentStyle={{ borderWidth: selected ? 1.5 : 1 }}
                    className={`flex-row items-center gap-3.5 rounded-[18px] p-4 ${
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
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={20} color={accent} />
                    ) : (
                      <Ionicons name="arrow-forward" size={18} color={muted} />
                    )}
                  </PressableScale>
                </FadeSlideIn>
              );
            })}
          </View>

          <Text
            className="text-muted mt-auto self-center text-xs"
            style={{ marginBottom: hintPad }}
          >
            {t("onboarding.intent.tap_to_continue")}
          </Text>
        </View>
      )}

      {/* Step 03 — Report teaser */}
      {step === 2 && (
        <View className="flex-1 pt-2">
          <StepHeading
            title={t("onboarding.value.title")}
            subtitle={t("onboarding.value.subtitle")}
          />

          <FadeSlideIn index={1}>
            <View className="mt-[22px] rounded-[20px] border border-border bg-surface p-5">
              <Text className="text-foreground text-lg font-semibold tracking-[-0.01em]">
                {t("onboarding.value.pdf_preview_title")}
              </Text>
              <Text className="text-primary mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]">
                {t("onboarding.value.pdf_preview_subtitle")}
              </Text>
              <View className="my-4 h-px bg-border" />
              <View className="gap-3.5">
                {TEASER_ROWS.map((row) => (
                  <View key={row.key}>
                    <Text className="text-muted text-xs font-semibold">
                      {t(`onboarding.value.${row.key}`)}
                    </Text>
                    <View className="mt-[7px]">
                      <AnimatedBar
                        pct={row.pct}
                        color={accent}
                        opacity={row.opacity}
                        height={7}
                        radius={4}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn index={2}>
            <View className="mt-5 gap-3">
              <View className="flex-row items-center gap-3">
                <Ionicons name="document-text-outline" size={21} color={accent} />
                <Text className="text-muted flex-1 text-sm">
                  {t("onboarding.value.perk_export")}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Ionicons name="lock-closed-outline" size={21} color={accent} />
                <Text className="text-muted flex-1 text-sm">
                  {t("onboarding.value.perk_privacy")}
                </Text>
              </View>
            </View>
          </FadeSlideIn>

          <View className="mt-auto" style={{ paddingBottom: bottomPad }}>
            <PrimaryButton
              label={t("common.continue")}
              icon={<ArrowRightIcon />}
              onPress={() => setStep(3)}
            />
          </View>
        </View>
      )}

      {/* Step 04 — Pace */}
      {step === 3 && (
        <View className="flex-1 pt-2">
          <StepHeading
            title={t("onboarding.pace.title")}
            subtitle={t("onboarding.pace.subtitle")}
          />

          <View className="mt-6 gap-2.5">
            {PACES.map((option, i) => {
              const selected = paceChoice === option.key;
              return (
                <FadeSlideIn key={option.key} index={i}>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectPace(option.key)}
                    contentStyle={{ borderWidth: selected ? 1.5 : 1 }}
                    className={`flex-row items-start gap-3.5 rounded-[18px] p-4 ${
                      selected
                        ? "border-nt-pri-border bg-nt-tint"
                        : "border-border bg-surface"
                    }`}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={selected ? accent : muted}
                    />
                    <View className="flex-1" style={{ gap: 3 }}>
                      <Text className="text-base font-semibold text-foreground">
                        {t(`onboarding.pace.${option.key}_title`)}
                      </Text>
                      <Text
                        className="text-muted text-[13px]"
                        style={{ lineHeight: 19 }}
                      >
                        {t(`onboarding.pace.${option.key}_desc`)}
                      </Text>
                    </View>
                    {selected && (
                      <Ionicons name="checkmark-circle" size={20} color={accent} />
                    )}
                  </PressableScale>
                </FadeSlideIn>
              );
            })}
          </View>

          <View className="mt-auto" style={{ paddingBottom: bottomPad }}>
            <PrimaryButton
              label={t("common.continue")}
              icon={<ArrowRightIcon />}
              onPress={() => setStep(4)}
            />
          </View>
        </View>
      )}

      {/* Step 05 — Legal gate */}
      {step === 4 && (
        <View className="flex-1 pt-2">
          <StepHeading
            title={t("onboarding.legal.title")}
            subtitle={t("onboarding.legal.subtitle")}
          />

          <View className="mt-[26px] gap-3.5">
            {LEGAL_BULLETS.map((bullet, i) => (
              <FadeSlideIn key={bullet.key} index={i}>
                <View className="flex-row gap-3">
                  <Ionicons name={bullet.icon} size={22} color={accent} />
                  <Text
                    className="text-muted flex-1 text-sm"
                    style={{ lineHeight: 21 }}
                  >
                    <Text className="text-foreground font-bold">
                      {t(`onboarding.legal.${bullet.key}_title`)}
                    </Text>
                    {" "}
                    {t(`onboarding.legal.${bullet.key}_body`)}
                  </Text>
                </View>
              </FadeSlideIn>
            ))}
          </View>

          <View className="mt-auto" style={{ paddingBottom: bottomPad }}>
            <PressableScale
              accessibilityRole="checkbox"
              accessibilityState={{ checked: legalAccepted }}
              onPress={() => {
                setLegalAccepted((accepted) => !accepted);
                Haptics.selectionAsync();
              }}
              contentStyle={{ borderWidth: 1 }}
              className="flex-row items-start gap-3 rounded-2xl border-border bg-surface p-3.5"
            >
              <View
                className={
                  legalAccepted ? "items-center justify-center bg-accent" : "border-border"
                }
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  borderWidth: legalAccepted ? 0 : 1.5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {legalAccepted && (
                  <Ionicons name="checkmark" size={16} color={accentForeground} />
                )}
              </View>
              <Text
                className="text-foreground flex-1 text-[13px]"
                style={{ lineHeight: 19.5 }}
              >
                {t("onboarding.legal.checkbox")}
              </Text>
            </PressableScale>

            <View className="mt-3.5">
              <PrimaryButton
                label={t("onboarding.legal.cta")}
                size="lg"
                disabled={!legalAccepted}
                onPress={finish}
              />
            </View>
          </View>
        </View>
      )}
    </Container>
  );
}
