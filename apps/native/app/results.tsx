import { Container } from "@/components/container";
import { CrossPromoCard } from "@/components/cross-promo/cross-promo-card";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Button, Chip, Surface } from "heroui-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import {
  getLatestResult,
  isReportUnlocked,
  unlockReport,
} from "@/lib/storage/app-storage";

function ScoreBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-foreground text-sm font-medium">{label}</Text>
        <Text className="text-muted text-xs">
          {value} / {max}
        </Text>
      </View>
      <View className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <View
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: `rgba(124, 58, 237, ${0.35 + (pct / 100) * 0.65})`,
          }}
        />
      </View>
    </View>
  );
}

export default function Results() {
  const { t } = useTranslation();
  const router = useRouter();

  const result = getLatestResult();
  useEffect(() => {
    if (!result) router.replace("/assessment/part-a");
  }, [result, router]);

  if (!result) return null;

  const unlocked = isReportUnlocked(result.id);

  async function handleUnlockCta() {
    if (unlocked) {
      router.push("/report");
      return;
    }
    // Rewarded-ad flow is wired in the ads service.
    const { showPdfUnlockAd } = await import("@/lib/ads/rewarded");
    const rewarded = await showPdfUnlockAd();
    if (rewarded && result) {
      unlockReport(result.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  return (
    <Container className="px-4 pt-12">
      {/* Classification badge */}
      <View className="items-center py-6">
        <Chip
          variant="secondary"
          color={result.isPartAPositive ? "warning" : "success"}
          size="lg"
          className="mb-2"
        >
          <Chip.Label>{t(result.classificationKey)}</Chip.Label>
        </Chip>
        <Text className="text-muted mt-2 px-6 text-center text-xs leading-relaxed">
          {t("results.disclaimer")}
        </Text>
      </View>

      {/* Subscale spectrums */}
      <Surface variant="secondary" className="rounded-2xl p-5">
        <Text className="text-foreground mb-4 text-sm font-semibold tracking-wide uppercase">
          {t("results.trait_breakdown_title")}
        </Text>
        <View className="gap-5">
          <ScoreBar
            label={t("results.inattention_label")}
            value={result.inattentionRaw}
            max={result.inattentionMax}
          />
          <ScoreBar
            label={t("results.hyperactivity_label")}
            value={result.hyperactivityRaw}
            max={result.hyperactivityMax}
          />
          <ScoreBar
            label={t("results.part_a_label")}
            value={result.partAScore}
            max={6}
          />
        </View>
      </Surface>

      {/* Internal funnel to companion app */}
      <CrossPromoCard className="mb-4" />

      {/* CTAs */}
      <View className="gap-3 pb-8">
        <Button size="lg" onPress={handleUnlockCta}>
          {unlocked ? t("results.unlocked_cta") : t("results.unlock_cta")}
        </Button>
        <Button
          variant="ghost"
          onPress={() => router.replace("/assessment/part-a")}
        >
          {t("results.retake_cta")}
        </Button>
      </View>
    </Container>
  );
}
