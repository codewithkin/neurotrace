import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "@/components/container";
import { CrossPromoCard } from "@/components/cross-promo/cross-promo-card";
import { BadgeChip, MonoValue, SectionLabel } from "@/components/ui/atoms";
import { AccentIcon, GhostButton, PrimaryButton } from "@/components/ui/buttons";
import { AnimatedBar, FadeSlideIn } from "@/components/ui/motion";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ADS_ENABLED } from "@/lib/ads/config";
import { useNTColors } from "@/lib/theme";
import {
  getLatestResult,
  isReportUnlocked,
  unlockReport,
} from "@/lib/storage/app-storage";

/*
 * Results, from designs "Light/Dark 10 Results": status chip over an
 * 11px disclaimer, a trait-breakdown card whose three bars step down in
 * opacity (1 / .72 / .55), the re-screen hint row, then the reveal CTA
 * and a ghost retake.
 *
 * Note (session 4): the design has no cross-promo card. Plan 02 T05 says
 * to keep it, so it sits between the hint row and the CTAs — the only
 * place it does not disturb the design's own rhythm.
 */
export default function Results() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const nt = useNTColors();

  const result = getLatestResult();
  useEffect(() => {
    if (!result) router.replace("/assessment/part-a");
  }, [result, router]);

  if (!result) return null;

  const unlocked = isReportUnlocked(result.id);
  const inattentionPct = Math.round(
    (result.inattentionRaw / Math.max(1, result.inattentionMax)) * 100,
  );
  const hyperactivityPct = Math.round(
    (result.hyperactivityRaw / Math.max(1, result.hyperactivityMax)) * 100,
  );
  const partAPct = Math.round((result.partAScore / 6) * 100);

  async function handleUnlockCta() {
    if (!result || unlocked) {
      router.push("/report");
      return;
    }
    if (ADS_ENABLED) {
      // Rewarded-ad flow is wired in the ads service.
      const { showPdfUnlockAd } = await import("@/lib/ads/rewarded");
      const rewarded = await showPdfUnlockAd();
      if (!rewarded) return;
    }
    // V1.0 (ads disabled): the reveal button unlocks the report directly.
    unlockReport(result.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return (
    <Container className="px-4 pt-6">
      <FadeSlideIn>
        <View className="items-center pb-[22px]">
          <BadgeChip
            size="lg"
            tone={result.isPartAPositive ? "amber" : "green"}
            icon={result.isPartAPositive ? "alert-circle" : "checkmark-circle"}
            label={t(result.classificationKey)}
          />
          <Text
            className="text-muted mt-3 text-center text-[11px]"
            style={{ lineHeight: 16.5 }}
          >
            {t("results.screen_disclaimer")}
          </Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn index={1}>
        <View className="rounded-[20px] border border-border bg-surface p-5">
          <SectionLabel>{t("results.trait_breakdown_title")}</SectionLabel>
          <View className="mt-5 gap-5">
            <TraitRow
              label={t("results.inattention_short")}
              value={`${inattentionPct}%`}
              pct={inattentionPct}
              opacity={1}
              color={nt.pri}
            />
            <TraitRow
              label={t("results.hyperactivity_short")}
              value={`${hyperactivityPct}%`}
              pct={hyperactivityPct}
              opacity={0.72}
              color={nt.pri}
            />
            <TraitRow
              label={t("results.part_a_short")}
              value={`${result.partAScore} / 6`}
              pct={partAPct}
              opacity={0.55}
              color={nt.pri}
            />
          </View>
        </View>
      </FadeSlideIn>

      <FadeSlideIn index={2}>
        <PressableScale
          accessibilityRole="button"
          onPress={() => router.replace("/(tabs)/history")}
          className="mt-3.5 flex-row items-center gap-3 rounded-2xl border border-border"
          contentStyle={{ paddingVertical: 14, paddingHorizontal: 16 }}
        >
          <Ionicons name="stats-chart-outline" size={22} color={nt.pri} />
          <Text className="text-muted flex-1 text-[13px]" style={{ lineHeight: 19 }}>
            {t("results.rescreen_hint")}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={nt.muted} />
        </PressableScale>
      </FadeSlideIn>

      {/* Internal funnel to the companion app (plan 02 T05 keeps this). */}
      <CrossPromoCard className="mt-3.5" />

      <View
        className="mt-auto"
        style={{ paddingTop: 24, paddingBottom: Math.max(0, 34 - insets.bottom) }}
      >
        <PrimaryButton
          size="lg"
          label={
            unlocked
              ? t("results.unlocked_cta")
              : ADS_ENABLED
                ? t("results.unlock_cta")
                : t("results.reveal_cta")
          }
          icon={<AccentIcon name="document-text-outline" />}
          iconPosition="leading"
          onPress={handleUnlockCta}
        />
        <View className="mt-2.5">
          <GhostButton
            label={t("results.retake_cta")}
            onPress={() => router.replace("/assessment/part-a")}
          />
        </View>
      </View>
    </Container>
  );
}

function TraitRow({
  label,
  value,
  pct,
  opacity,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  opacity: number;
  color: string;
}) {
  return (
    <View>
      <View className="flex-row items-baseline justify-between">
        <Text className="text-foreground text-sm font-semibold">{label}</Text>
        <MonoValue className="text-[15px]">{value}</MonoValue>
      </View>
      <View className="mt-[9px]">
        <AnimatedBar pct={pct} color={color} opacity={opacity} height={10} radius={5} />
      </View>
    </View>
  );
}
