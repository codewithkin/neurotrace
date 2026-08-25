import { AnimatedProgressBar } from "@/components/assessment/animated-progress-bar";
import { ResponsePills } from "@/components/assessment/response-pills";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Button, Spinner, Surface } from "heroui-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Text, View } from "react-native";

import { PART_B_QUESTIONS } from "@/lib/asrs/questions";
import {
  ASRSResponse,
  ResponseValue,
  calculateASRSScore,
} from "@/lib/asrs/scoring";
import {
  clearResponses,
  getResponses,
  saveResponses,
  storeResult,
} from "@/lib/storage/app-storage";

export default function AssessmentPartB() {
  const { t } = useTranslation();
  const router = useRouter();

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

  function calculate() {
    // Guard: all 18 questions must be answered.
    if (responses.length < 18) return;

    setCalculating(true);
    const score = calculateASRSScore(responses);
    const result = {
      ...score,
      id: `asrs-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    storeResult(result);
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
      }
    }, 180);
  }

  if (calculating) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Surface variant="secondary" className="w-full items-center rounded-2xl p-10">
          <Text className="mb-4 text-5xl">🧠</Text>
          <Spinner size="lg" />
          <Text className="text-foreground mt-4 text-center text-base font-medium">
            {t("assessment.calculating")}
          </Text>
        </Surface>
      </View>
    );
  }

  const isLastQuestion = index === PART_B_QUESTIONS.length - 1;
  const allAnswered = responses.length >= 18;

  return (
    <View className="flex-1 bg-background px-4 pt-14">
      {/* Progress header */}
      <View className="mb-8">
        <AnimatedProgressBar
          progress={(index + 1) / PART_B_QUESTIONS.length}
        />
        <Text className="text-muted mt-2 text-xs font-medium tracking-wide uppercase">
          {t("assessment.progress", {
            current: index + 1,
            total: PART_B_QUESTIONS.length,
          })}
          {" · "}
          {t("assessment.part_b_header")}
        </Text>
      </View>

      {index === 0 && (
        <Text className="text-primary mb-4 text-center text-sm font-medium">
          {t("assessment.part_b_transition")}
        </Text>
      )}

      {/* Question card */}
      <View className="flex-1 justify-center gap-10">
        <Text className="text-foreground text-[26px] leading-9 font-semibold tracking-tight">
          {t(`assessment.questions.${question.textKey}`)}
        </Text>

        <ResponsePills
          key={question.id}
          selectedValue={selected}
          onSelect={handleSelect}
        />
      </View>

      <View className="pb-8">
        {!isLastQuestion || !allAnswered ? null : (
          <Button size="lg" className="w-full" onPress={calculate}>
            {t("assessment.calculate_cta")}
          </Button>
        )}
      </View>
    </View>
  );
}
