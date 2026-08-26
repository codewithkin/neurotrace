import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AssessmentProgressHeader } from "@/components/assessment/progress-header";
import { ResponsePills } from "@/components/assessment/response-pills";
import { Container } from "@/components/container";
import { FadeSlideIn } from "@/components/ui/motion";
import { PART_B_QUESTIONS } from "@/lib/asrs/questions";
import {
  ASRSResponse,
  ResponseValue,
  calculateASRSScore,
} from "@/lib/asrs/scoring";
import { MONO_FONT } from "@/lib/theme";
import {
  clearResponses,
  getResponses,
  saveResponses,
  storeResult,
} from "@/lib/storage/app-storage";

const TOTAL_QUESTIONS = 18;
const PART_A_COUNT = 6;

/*
 * Part B, from designs "Light/Dark 08 Part B question", and the
 * interstitial from "09 Calculating".
 *
 * Note (session 4): the plan called for an explicit Calculate CTA on the
 * last question. The rest of the instrument auto-advances and the design
 * shows no such control, so answering item 18 goes straight to the
 * interstitial. The CTA survives only as a fallback for a resumed session
 * that still has gaps, which the linear flow should never produce.
 */
export default function AssessmentPartB() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const accent = useThemeColor("accent");
  const muted = useThemeColor("muted");

  const [index, setIndex] = useState(() => {
    const saved = getResponses();
    const firstUnanswered = PART_B_QUESTIONS.findIndex(
      (q) => !saved.some((r) => r.questionId === q.id),
    );
    return firstUnanswered === -1 ? PART_B_QUESTIONS.length - 1 : firstUnanswered;
  });
  const [responses, setResponses] = useState<ASRSResponse[]>(getResponses());
  const [calculating, setCalculating] = useState(false);

  const question = PART_B_QUESTIONS[index];
  const selected = responses.find((r) => r.questionId === question.id)?.value;

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => subscription.remove();
  }, []);

  function calculate(finalResponses: ASRSResponse[]) {
    if (finalResponses.length < TOTAL_QUESTIONS) return;

    setCalculating(true);
    const score = calculateASRSScore(finalResponses);
    storeResult({
      ...score,
      id: `asrs-${Date.now()}`,
      completedAt: new Date().toISOString(),
      responses: finalResponses,
    });
    clearResponses();

    setTimeout(() => {
      setCalculating(false);
      router.replace("/results");
    }, 2000);
  }

  function handleSelect(value: ResponseValue) {
    const next = [
      ...responses.filter((r) => r.questionId !== question.id),
      { questionId: question.id, value },
    ];
    setResponses(next);
    saveResponses(next);

    setTimeout(() => {
      if (index < PART_B_QUESTIONS.length - 1) {
        setIndex(index + 1);
        Haptics.selectionAsync();
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        calculate(next);
      }
    }, 180);
  }

  if (calculating) {
    return (
      <Container className="px-4" isScrollable={false}>
        <View className="flex-1 justify-center">
          <FadeSlideIn>
            <View className="w-full items-center rounded-3xl border border-border bg-surface px-6 py-11">
              <View className="h-[78px] w-[78px] items-center justify-center rounded-[26px] bg-nt-tint">
                <Ionicons name="pulse-outline" size={40} color={accent} />
              </View>

              <View className="mt-7">
                <CalculatingSpinner accent={accent} />
              </View>

              <Text className="text-foreground mt-6 text-center text-[21px] font-semibold tracking-[-0.02em]">
                {t("assessment.calculating")}
              </Text>
              <Text
                className="text-muted mt-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{ fontFamily: MONO_FONT }}
              >
                {t("assessment.calculating_sub")}
              </Text>
            </View>
          </FadeSlideIn>
        </View>

        <Text
          className="text-muted text-center text-xs"
          style={{ paddingBottom: Math.max(0, 46 - insets.bottom) }}
        >
          {t("assessment.calculating_footnote")}
        </Text>
      </Container>
    );
  }

  const globalNumber = PART_A_COUNT + index + 1;
  const traitsLeft = TOTAL_QUESTIONS - globalNumber + 1;

  return (
    <Container className="px-4" isScrollable={false}>
      <AssessmentProgressHeader
        pct={(globalNumber / TOTAL_QUESTIONS) * 100}
        label={`${t("assessment.progress_short", {
          current: globalNumber,
          total: TOTAL_QUESTIONS,
        })} · ${t("assessment.section_traits")}`}
      />

      <Animated.View
        key={question.id}
        entering={FadeIn.duration(220)}
        className="flex-1 justify-center"
        style={{ gap: 34 }}
      >
        <FadeSlideIn>
          <Text className="text-primary text-center text-sm font-semibold">
            {t("assessment.traits_left", { count: traitsLeft })}
          </Text>
          <Text
            className="text-foreground mt-[18px] text-[26px] font-semibold tracking-[-0.02em]"
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

/**
 * The design's 34px ring: a 3px track circle whose top edge is the brand
 * violet, rotating once every 0.9s (linear).
 */
function CalculatingSpinner({ accent }: { accent: string }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      className="border-nt-track"
      style={[
        style,
        {
          width: 34,
          height: 34,
          borderRadius: 17,
          borderWidth: 3,
          borderTopColor: accent,
        },
      ]}
    />
  );
}
