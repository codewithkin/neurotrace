import { useRouter } from "expo-router";
import { Button, Chip, Separator, Surface } from "heroui-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import {
  getLatestResult,
  getResponses,
  isReportUnlocked,
} from "@/lib/storage/app-storage";

const TOTAL_QUESTIONS = 18;

export default function AssessTab() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const responses = useMemo(getResponses, []);
  const latestResult = useMemo(getLatestResult, []);

  const inProgress = responses.length > 0 && responses.length < TOTAL_QUESTIONS;

  function startAssessment() {
    router.push("/assessment/part-a");
  }

  return (
    <Container className="px-4">
      <View className="py-6 gap-1">
        <Text className="text-foreground text-2xl font-semibold tracking-tight">
          {t("results.title")}
        </Text>
        <Text className="text-muted text-sm">
          WHO ASRS v1.1 · {TOTAL_QUESTIONS} {t("pdf.question")}
        </Text>
      </View>

      {/* Resume in-progress assessment */}
      {inProgress ? (
        <Surface variant="secondary" className="mb-4 rounded-2xl p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-base font-semibold">
              {t("assessment.resume_cta")}
            </Text>
            <Chip variant="secondary" color="warning" size="sm">
              <Chip.Label>
                {responses.length}/{TOTAL_QUESTIONS}
              </Chip.Label>
            </Chip>
          </View>
          <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${(responses.length / TOTAL_QUESTIONS) * 100}%` }}
            />
          </View>
          <Button size="lg" className="mt-4" onPress={startAssessment}>
            {t("assessment.resume_cta")}
          </Button>
        </Surface>
      ) : null}

      {/* Latest result summary */}
      {latestResult ? (
        <Surface variant="secondary" className="mb-4 rounded-2xl p-5">
          <Text className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
            {t("results.title")}
          </Text>
          <Chip
            variant="secondary"
            color={latestResult.isPartAPositive ? "warning" : "success"}
            size="sm"
            className="self-start"
          >
            <Chip.Label>{t(latestResult.classificationKey)}</Chip.Label>
          </Chip>

          <Separator className="my-4" />

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-foreground text-xl font-bold">
                {latestResult.partAScore}/6
              </Text>
              <Text className="text-muted mt-0.5 text-[10px] uppercase">
                Part A
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-foreground text-xl font-bold">
                {latestResult.inattentionRaw}/{latestResult.inattentionMax}
              </Text>
              <Text className="text-muted mt-0.5 text-[10px] uppercase">
                {t("history.legend_inattention")}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-foreground text-xl font-bold">
                {latestResult.hyperactivityRaw}/{latestResult.hyperactivityMax}
              </Text>
              <Text className="text-muted mt-0.5 text-[10px] uppercase">
                {t("history.legend_hyperactivity")}
              </Text>
            </View>
          </View>

          <Button
            className="mt-4"
            variant={isReportUnlocked(latestResult.id) ? "primary" : "secondary"}
            onPress={() => router.push("/report")}
          >
            {isReportUnlocked(latestResult.id)
              ? t("results.unlocked_cta")
              : t("results.reveal_cta")}
          </Button>
        </Surface>
      ) : !inProgress ? (
        /* First-time intro */
        <Surface variant="secondary" className="rounded-2xl p-5">
          <Text className="mb-2 text-4xl">📋</Text>
          <Text className="text-foreground mb-1 text-base font-semibold">
            {t("assessment.part_a_header")}
          </Text>
          <Text className="text-muted text-sm leading-relaxed">
            {t("onboarding.value.subtitle")}
          </Text>
        </Surface>
      ) : null}

      {/* Start / retake CTA */}
      <Button
        size="lg"
        className="mt-4"
        variant={inProgress || latestResult ? "secondary" : "primary"}
        onPress={startAssessment}
      >
        {latestResult || inProgress
          ? t("results.retake_cta")
          : t("common.start")}
      </Button>

      <Text className="text-muted px-2 py-6 text-center text-xs leading-relaxed">
        {t("results.disclaimer")}
      </Text>
    </Container>
  );
}
