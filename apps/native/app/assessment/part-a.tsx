import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { AssessmentProgressHeader } from "@/components/assessment/progress-header";
import { ResponsePills } from "@/components/assessment/response-pills";
import { Container } from "@/components/container";
import {
  ArrowRightIcon,
  GhostButton,
  PrimaryButton,
} from "@/components/ui/buttons";
import { FadeSlideIn } from "@/components/ui/motion";
import { PART_A_QUESTIONS } from "@/lib/asrs/questions";
import {
  ASRSResponse,
  ResponseValue,
  countFlaggedPartA,
} from "@/lib/asrs/scoring";
import { MONO_FONT } from "@/lib/theme";
import { getPace, getResponses, saveResponses } from "@/lib/storage/app-storage";

const TOTAL_QUESTIONS = 18;

/*
 * Part A, from designs "Light/Dark 06 Part A question", and the milestone
 * card from "07 Milestone".
 *
 * Note (session 4): the design's progress bar widths are inconsistent —
 * 17% at "Question 1 of 6", but 33% at "6 of 6" on the milestone and 50%
 * at "Question 9 of 18" in Part B. Only global-progress-out-of-18 is
 * monotonic and matches two of the three screens, so the bar is n/18
 * everywhere. The labels are the design's own, verbatim.
 */
export default function AssessmentPartA() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const accent = useThemeColor("accent");
  const muted = useThemeColor("muted");

  const savedResponses = useRef<ASRSResponse[]>(getResponses()).current;
  const startedAt = useRef(Date.now()).current;

  const [index, setIndex] = useState(() => {
    const firstUnanswered = PART_A_QUESTIONS.findIndex(
      (q) => !savedResponses.some((r) => r.questionId === q.id),
    );
    return firstUnanswered === -1 ? PART_A_QUESTIONS.length - 1 : firstUnanswered;
  });
  const [responses, setResponses] = useState<ASRSResponse[]>(savedResponses);
  const [showMilestone, setShowMilestone] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const question = PART_A_QUESTIONS[index];
  const selected = responses.find((r) => r.questionId === question.id)?.value;

  // Block hardware back to keep the flow linear.
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

  function handleSelect(value: ResponseValue) {
    const next = [
      ...responses.filter((r) => r.questionId !== question.id),
      { questionId: question.id, value },
    ];
    setResponses(next);
    saveResponses(next); // auto-save locally

    setTimeout(() => {
      if (index < PART_A_QUESTIONS.length - 1) {
        setIndex(index + 1);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setElapsedMs(Date.now() - startedAt);
        setShowMilestone(true);
      }
    }, 180);
  }

  if (showMilestone) {
    const flagged = countFlaggedPartA(responses);
    const totalSeconds = Math.max(1, Math.round(elapsedMs / 1000));
    const splitPace = getPace() === "two_sessions";

    return (
      <Container className="px-4" isScrollable={false}>
        <AssessmentProgressHeader
          dimmed
          pct={(PART_A_QUESTIONS.length / TOTAL_QUESTIONS) * 100}
          label={`${t("assessment.section_part_a_complete")} · ${t("assessment.progress_short", {
            current: PART_A_QUESTIONS.length,
            total: PART_A_QUESTIONS.length,
          })}`}
        />

        <View className="flex-1 justify-center">
          <FadeSlideIn>
            <View className="w-full items-center rounded-3xl border border-border bg-surface px-6 py-8">
              <Animated.View
                entering={ZoomIn.springify().damping(13).stiffness(160)}
                className="h-[74px] w-[74px] items-center justify-center rounded-3xl bg-nt-tint"
              >
                <Ionicons name="locate-outline" size={38} color={accent} />
              </Animated.View>

              <Text className="text-foreground mt-[22px] text-center text-2xl font-semibold tracking-[-0.02em]">
                {splitPace
                  ? t("assessment.milestone.break_title")
                  : t("assessment.milestone.title")}
              </Text>
              <Text
                className="text-muted mt-2.5 text-center text-sm"
                style={{ lineHeight: 22 }}
              >
                {splitPace
                  ? t("assessment.milestone.break_desc")
                  : t("assessment.milestone.desc", { flagged })}
              </Text>

              <View className="mb-[26px] mt-[22px] flex-row justify-center gap-2">
                <MilestoneChip
                  label={t("assessment.milestone.flagged_chip", { count: flagged })}
                />
                <MilestoneChip
                  label={t("assessment.milestone.duration", {
                    minutes: Math.floor(totalSeconds / 60),
                    seconds: totalSeconds % 60,
                  })}
                />
              </View>

              <View className="w-full">
                <PrimaryButton
                  label={
                    splitPace
                      ? t("assessment.milestone.continue_now")
                      : t("assessment.milestone.continue")
                  }
                  icon={<ArrowRightIcon />}
                  onPress={() => router.replace("/assessment/part-b")}
                />
                {splitPace && (
                  <GhostButton
                    label={t("assessment.milestone.break_cta")}
                    onPress={() => router.replace("/(tabs)/assess")}
                  />
                )}
              </View>
            </View>
          </FadeSlideIn>
        </View>

        <Text
          className="text-muted text-center text-xs"
          style={{ paddingBottom: Math.max(0, 46 - insets.bottom) }}
        >
          {t("assessment.milestone.progress_saved")}
        </Text>
      </Container>
    );
  }

  const questionNumber = index + 1;

  return (
    <Container className="px-4" isScrollable={false}>
      <AssessmentProgressHeader
        pct={(questionNumber / TOTAL_QUESTIONS) * 100}
        label={`${t("assessment.progress_short", {
          current: questionNumber,
          total: PART_A_QUESTIONS.length,
        })} · ${t("assessment.section_core")}`}
      />

      <Animated.View
        key={question.id}
        entering={FadeIn.duration(220)}
        className="flex-1 justify-center"
        style={{ gap: 38 }}
      >
        <FadeSlideIn>
          <Text className="text-muted text-[13px]">
            {t("assessment.timeframe")}
          </Text>
          <Text
            className="text-foreground mt-3.5 text-[26px] font-semibold tracking-[-0.02em]"
            style={{ lineHeight: 36 }}
          >
            {t(`assessment.questions.${question.textKey}`)}
          </Text>
        </FadeSlideIn>

        <FadeSlideIn index={1}>
          <ResponsePills selectedValue={selected} onSelect={handleSelect} />
        </FadeSlideIn>
      </Animated.View>

      <View
        className="flex-row items-center justify-center gap-[7px]"
        style={{ paddingBottom: Math.max(0, 40 - insets.bottom) }}
      >
        <Ionicons name="checkmark" size={15} color={muted} />
        <Text className="text-muted text-xs">{t("assessment.answers_saved")}</Text>
      </View>
    </Container>
  );
}

/** Mono caps chip on the milestone card (design: 7px/12px, radius 10). */
function MilestoneChip({ label }: { label: string }) {
  return (
    <View
      className="rounded-[10px] border border-border bg-background"
      style={{ paddingVertical: 7, paddingHorizontal: 12 }}
    >
      <Text
        className="text-muted text-[11px] font-semibold uppercase tracking-[0.1em]"
        style={{ fontFamily: MONO_FONT }}
      >
        {label}
      </Text>
    </View>
  );
}
