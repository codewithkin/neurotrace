import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { ChartSeries, ScoreChart } from "@/components/history/score-chart";
import { BadgeChip, SectionLabel } from "@/components/ui/atoms";
import { PrimaryButton } from "@/components/ui/buttons";
import { FadeSlideIn } from "@/components/ui/motion";
import { CHART_AMBER, useNTColors } from "@/lib/theme";
import { getResultHistory } from "@/lib/storage/app-storage";

type TrendStatus = "stable" | "improving" | "elevated";

function computeTrend(values: number[]): TrendStatus {
  if (values.length < 2) return "stable";
  const delta = values[values.length - 1] - values[values.length - 2];
  if (delta > 8) return "elevated";
  if (delta < -8) return "improving";
  return "stable";
}

/*
 * History, from designs "Light/Dark 14 History tab". Series are
 * percentages rather than raw 0-36 scores, because the design's axis is
 * 0-100 and the session rows quote the same numbers.
 */
export default function HistoryTab() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const nt = useNTColors();

  const history = useMemo(getResultHistory, []);

  const points = history.map((r) => ({
    id: r.id,
    completedAt: r.completedAt,
    isPartAPositive: r.isPartAPositive,
    inattention: Math.round((r.inattentionRaw / Math.max(1, r.inattentionMax)) * 100),
    hyperactivity: Math.round(
      (r.hyperactivityRaw / Math.max(1, r.hyperactivityMax)) * 100,
    ),
  }));

  const inattentionSeries: ChartSeries = {
    color: nt.pri,
    values: points.map((p) => p.inattention),
  };
  const hyperactivitySeries: ChartSeries = {
    color: CHART_AMBER,
    values: points.map((p) => p.hyperactivity),
  };

  const monthLabels = points.map((p) =>
    new Intl.DateTimeFormat(i18n.language, { month: "short" }).format(
      new Date(p.completedAt),
    ),
  );

  const trend = computeTrend(points.map((p) => p.inattention));

  return (
    <Container className="px-4 pt-[26px]">
      <FadeSlideIn>
        <Text className="text-foreground text-[28px] font-semibold tracking-[-0.03em]">
          {t("history.title")}
        </Text>
      </FadeSlideIn>

      {points.length === 0 ? (
        <FadeSlideIn index={1}>
          <View className="mt-[22px] items-center rounded-[20px] border border-border bg-surface p-8">
            <Text className="text-muted text-center text-sm" style={{ lineHeight: 21 }}>
              {t("history.no_data")}
            </Text>
            <View className="mt-5 w-full">
              <PrimaryButton
                label={t("common.start")}
                onPress={() => router.push("/assessment/part-a")}
              />
            </View>
          </View>
        </FadeSlideIn>
      ) : (
        <>
          <FadeSlideIn index={1}>
            <View className="mt-[22px] flex-row items-center justify-between">
              <SectionLabel className="tracking-[0.14em]">
                {t("history.six_month_trend")}
              </SectionLabel>
              <BadgeChip
                size="sm"
                tone={trend === "elevated" ? "amber" : "green"}
                icon="analytics-outline"
                label={t(`history.${trend}`)}
              />
            </View>

            <View
              className="mt-3 rounded-[20px] border border-border bg-surface"
              style={{ paddingVertical: 18, paddingHorizontal: 16 }}
            >
              <ScoreChart
                series={[inattentionSeries, hyperactivitySeries]}
                labels={monthLabels}
                borderColor={nt.border}
                mutedColor={nt.muted}
              />
              <View className="mt-3.5 flex-row justify-center" style={{ gap: 18 }}>
                <LegendItem color={nt.pri} label={t("history.legend_inattention")} />
                <LegendItem color={CHART_AMBER} label={t("history.legend_hyperactivity")} />
              </View>
            </View>
          </FadeSlideIn>

          <FadeSlideIn index={2}>
            <View className="mt-5">
              <SectionLabel className="tracking-[0.14em]">
                {t("history.sessions")}
              </SectionLabel>
            </View>
            <View className="mt-2.5 gap-2">
              {[...points].reverse().map((point) => (
                <View
                  key={point.id}
                  className="flex-row items-center gap-3 rounded-2xl border border-border p-3.5"
                >
                  <View className="flex-1">
                    <Text className="text-foreground text-sm font-semibold">
                      {new Intl.DateTimeFormat(i18n.language, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(point.completedAt))}
                    </Text>
                    <Text className="text-muted mt-0.5 text-xs">
                      {t("history.session_sub", {
                        inattention: point.inattention,
                        hyperactivity: point.hyperactivity,
                      })}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: point.isPartAPositive ? nt.amberFg : nt.greenFg,
                    }}
                  />
                </View>
              ))}
            </View>
          </FadeSlideIn>

          <View className="mt-auto pb-[18px] pt-6">
            <PrimaryButton
              label={t("history.reassess_now")}
              onPress={() => router.push("/assessment/part-a")}
            />
          </View>
        </>
      )}
    </Container>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-[7px]">
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text className="text-muted text-xs">{label}</Text>
    </View>
  );
}
