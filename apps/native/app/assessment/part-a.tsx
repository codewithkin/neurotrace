import { AnimatedProgressBar } from "@/components/assessment/animated-progress-bar";
import { ResponsePills } from "@/components/assessment/response-pills";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Button, Surface } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Text, View } from "react-native";

import { PART_A_QUESTIONS } from "@/lib/asrs/questions";
import {
  ASRSResponse,
  ResponseValue,
} from "@/lib/asrs/scoring";
import {
  getResponses,
  saveResponses,
} from "@/lib/storage/app-storage";

export default function AssessmentPartA() {
  const { t } = useTranslation();
  const router = useRouter();

  const savedResponses = useRef<ASRSResponse[]>(getResponses()).current;
  const [index, setIndex] = useState(() => {
    const firstUnanswered = PART_A_QUESTIONS.findIndex(
      (q) => !savedResponses.some((r) => r.questionId === q.id),
    );
    return firstUnanswered === -1 ? PART_A_QUESTIONS.length - 1 : firstUnanswered;
  });
  const [responses, setResponses] = useState<ASRSResponse[]>(savedResponses);
  const [showMilestone, setShowMilestone] = useState(false);

  const question = PART_A_QUESTIONS[index];
  const selected = responses.find((r) => r.questionId === question.id)?.value;

  // Block hardware back to keep the flow linear.
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
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
        setShowMilestone(true);
      }
    }, 180);
  }

  if (showMilestone) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Surface variant="secondary" className="w-full items-center rounded-2xl p-8">
          <Text className="mb-3 text-5xl">🎯</Text>
          <Text className="text-foreground text-center text-xl font-semibold">
            {t("assessment.milestone_badge")}
          </Text>
          <Button
            size="lg"
            className="mt-6 w-full"
            onPress={() => router.push("/assessment/part-b")}
          >
            {t("common.continue")}
          </Button>
        </Surface>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-14">
      {/* Progress header */}
      <View className="mb-8">
        <AnimatedProgressBar
          progress={(index + 1) / PART_A_QUESTIONS.length}
        />
        <Text className="text-muted mt-2 text-xs font-medium tracking-wide uppercase">
          {t("assessment.progress", {
            current: index + 1,
            total: PART_A_QUESTIONS.length,
          })}
          {" · "}
          {t("assessment.part_a_header")}
        </Text>
      </View>

      {/* Question card */}
      <View className="flex-1 justify-center gap-10">
        <Text className="text-muted text-sm leading-relaxed">
          {t("assessment.part_a_intro")}
        </Text>
        <Text className="text-foreground text-[26px] leading-9 font-semibold tracking-tight">
          {t(`assessment.questions.${question.textKey}`)}
        </Text>

        <ResponsePills
          key={question.id}
          selectedValue={selected}
          onSelect={handleSelect}
        />
      </View>

      <Text className="text-muted pb-6 text-center text-xs">
        {t("assessment.answers_saved")}
      </Text>
    </View>
  );
}
