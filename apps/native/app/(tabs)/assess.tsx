import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, View } from "react-native";

import { Container } from "@/components/container";
import { BadgeChip, SectionLabel } from "@/components/ui/atoms";
import { ArrowRightIcon, OutlineButton, PrimaryButton } from "@/components/ui/buttons";
import { AnimatedBar, FadeSlideIn } from "@/components/ui/motion";
import { MONO_FONT, useNTColors } from "@/lib/theme";
import {
  getLatestResult,
  getResponses,
} from "@/lib/storage/app-storage";

const TOTAL_QUESTIONS = 18;
const PART_A_COUNT = 6;

/*
 * Assess hub, from designs "Light/Dark 13 Assess tab": the violet resume
 * card on tint with a 1.5px border, the last-completed card with its
 * three-column stat strip, and a fresh-start outline button pinned to the
 * bottom over the screening disclaimer.
 */
export default function AssessTab() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const nt = useNTColors();

  const responses = useMemo(getResponses, []);
  const latestResult = useMemo(getLatestResult, []);

  const answered = responses.length;
  const inProgress = answered > 0 && answered < TOTAL_QUESTIONS;
  const resumeInPartB = answered >= PART_A_COUNT;

  function resume() {
    router.push(resumeInPartB ? "/assessment/part-b" : "/assessment/part-a");
  }

  function startFresh() {
    if (!inProgress) {
      router.push("/assessment/part-a");
      return;
    }
    Alert.alert(t("assessment.start_fresh"), t("assessment.start_fresh_confirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("assessment.start_fresh"),
        style: "destructive",
        onPress: () => router.push("/assessment/part-a"),
      },
    ]);
  }

  return (
    <Container className="px-4 pt-[26px]">
      <FadeSlideIn>
        <Text className="text-foreground text-[28px] font-semibold tracking-[-0.03em]">
          {t("results.title")}
        </Text>
        <Text
          className="text-muted mt-[7px] text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ fontFamily: MONO_FONT }}
        >
          {t("assessment.instrument_line")}
        </Text>
      </FadeSlideIn>

      {inProgress && (
        <FadeSlideIn index={1}>
          <View
            className="mt-[22px] rounded-[20px] bg-nt-tint p-[18px]"
            style={{ borderWidth: 1.5, borderColor: nt.priBorder }}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-foreground text-base font-semibold">
                {resumeInPartB
                  ? t("assessment.in_progress_part_b")
                  : t("assessment.in_progress_part_a")}
              </Text>
              <View
                className="rounded-full bg-accent"
                style={{ paddingVertical: 5, paddingHorizontal: 10 }}
              >
                <Text
                  className="text-[11px] font-semibold text-white"
                  style={{ fontFamily: MONO_FONT }}
                >
                  {answered} / {TOTAL_QUESTIONS}
                </Text>
              </View>
            </View>

            <View className="mt-3.5">
              <AnimatedBar
                pct={(answered / TOTAL_QUESTIONS) * 100}
                color={nt.pri}
                height={8}
                radius={4}
                trackColor={nt.tintTrack}
              />
            </View>

            <View className="mt-4">
              <PrimaryButton
                label={t("assessment.resume_cta")}
                icon={<ArrowRightIcon />}
                onPress={resume}
              />
            </View>
          </View>
        </FadeSlideIn>
      )}

      {latestResult && (
        <FadeSlideIn index={2}>
          <View className="mt-3.5 rounded-[20px] border border-border bg-surface p-[18px]">
            <View className="flex-row items-center justify-between">
              <SectionLabel className="tracking-[0.14em]">
                {t("assessment.last_completed")}
              </SectionLabel>
              <Text className="text-muted text-xs">
                {new Intl.DateTimeFormat(i18n.language, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(latestResult.completedAt))}
              </Text>
            </View>

            <View className="mt-3">
              <BadgeChip
                tone={latestResult.isPartAPositive ? "amber" : "green"}
                icon={latestResult.isPartAPositive ? "alert-circle" : "checkmark-circle"}
                label={t(
                  latestResult.isPartAPositive
                    ? "results.classification.high_short"
                    : "results.classification.low_short",
                )}
              />
            </View>

            <View className="my-4 h-px bg-border" />

            <View className="flex-row">
              <StatCell
                value={String(
                  Math.round(
                    (latestResult.inattentionRaw /
                      Math.max(1, latestResult.inattentionMax)) * 100,
                  ),
                )}
                label={t("results.stat_inatt")}
              />
              <StatCell
                bordered
                value={String(
                  Math.round(
                    (latestResult.hyperactivityRaw /
                      Math.max(1, latestResult.hyperactivityMax)) * 100,
                  ),
                )}
                label={t("results.stat_hyper")}
              />
              <StatCell
                value={`${latestResult.partAScore}/6`}
                label={t("results.stat_part_a")}
              />
            </View>

            <View className="mt-4">
              <OutlineButton
                label={t("assessment.view_report")}
                icon={<Ionicons name="document-text-outline" size={18} color={nt.pri} />}
                onPress={() => router.push("/results")}
              />
            </View>
          </View>
        </FadeSlideIn>
      )}

      <View className="mt-auto pb-[18px] pt-6">
        <OutlineButton label={t("assessment.start_fresh")} onPress={startFresh} />
        <Text
          className="text-muted mt-3 text-center text-[11px]"
          style={{ lineHeight: 16.5 }}
        >
          {t("assessment.tab_disclaimer")}
        </Text>
      </View>
    </Container>
  );
}

function StatCell({
  value,
  label,
  bordered = false,
}: {
  value: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <View
      className={`flex-1 items-center ${bordered ? "border-x border-border" : ""}`}
    >
      <Text className="text-foreground text-2xl font-bold tracking-[-0.02em]">
        {value}
      </Text>
      <Text className="text-muted mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
        {label}
      </Text>
    </View>
  );
}
