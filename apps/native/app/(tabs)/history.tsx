import { Button, Chip, Surface } from "heroui-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import {
  ChartSeries,
  ScoreChart,
} from "@/components/history/score-chart";
import { getResultHistory } from "@/lib/storage/app-storage";

type TrendStatus = "stable" | "improving" | "elevated";

function computeTrend(values: number[]): TrendStatus {
  if (values.length < 2) return "stable";
  const prev = values[values.length - 2];
  const last = values[values.length - 1];
  const delta = last - prev;
  if (delta > 3) return "elevated";
  if (delta < -3) return "improving";
  return "stable";
}

export default function HistoryTab() {
  const { t } = useTranslation();
  const router = useRouter();

  const history = useMemo(getResultHistory, []);

  const inattentionSeries: ChartSeries = {
    color: "#7c3aed",
    values: history.map((r) => r.inattentionRaw),
  };
  const hyperactivitySeries: ChartSeries = {
    color: "#f59e0b",
    values: history.map((r) => r.hyperactivityRaw),
  };

  const dateLabels = history.map((r) =>
    new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(
      new Date(r.completedAt),
    ),
  );

  const trend = computeTrend(history.map((r) => r.inattentionRaw));
  const trendColor: "danger" | "success" | "default" =
    trend === "elevated" ? "danger" : trend === "improving" ? "success" : "default";

  return (
    <Container className="px-4">
      <View className="py-6 mb-2 gap-1">
        <Text className="text-foreground text-2xl font-semibold tracking-tight">
          {t("history.title")}
        </Text>
      </View>

      {history.length === 0 ? (
        <Surface variant="secondary" className="items-center rounded-2xl p-8">
          <Text className="mb-4 text-4xl">📈</Text>
          <Text className="text-muted text-center text-sm leading-relaxed">
            {t("history.no_data")}
          </Text>
          <Button
            className="mt-5"
            onPress={() => router.push("/assessment/part-a")}
          >
            {t("common.start")}
          </Button>
        </Surface>
      ) : (
        <>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-muted text-xs font-medium tracking-wide uppercase">
              {t("history.assessment_trends")}
            </Text>
            <Chip variant="secondary" color={trendColor} size="sm">
              <Chip.Label>{t(`history.${trend}`)}</Chip.Label>
            </Chip>
          </View>

          <Surface variant="secondary" className="rounded-2xl p-4">
            <ScoreChart
              series={[inattentionSeries, hyperactivitySeries]}
              maxValue={36}
              labels={dateLabels}
            />
            {/* Legend */}
            <View className="mt-3 flex-row items-center justify-center gap-5">
              <View className="flex-row items-center gap-1.5">
                <View className="h-2 w-2 rounded-full bg-[#7c3aed]" />
                <Text className="text-muted text-xs">
                  {t("history.legend_inattention")}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                <Text className="text-muted text-xs">
                  {t("history.legend_hyperactivity")}
                </Text>
              </View>
            </View>
          </Surface>

          <Button
            size="lg"
            className="mt-6"
            onPress={() => router.push("/assessment/part-a")}
          >
            {t("history.monthly_reassessment_cta")}
          </Button>
        </>
      )}
    </Container>
  );
}
