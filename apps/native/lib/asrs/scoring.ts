export const RESPONSE_SCALE = [
  { value: 0, key: "never" },
  { value: 1, key: "rarely" },
  { value: 2, key: "sometimes" },
  { value: 3, key: "often" },
  { value: 4, key: "very_often" },
] as const;

export type ResponseValue = (typeof RESPONSE_SCALE)[number]["value"];

export interface ASRSResponse {
  questionId: number; // 1 to 18
  value: ResponseValue; // 0: Never ... 4: Very Often
}

const PART_A_CRITERIA = [
  { id: 1, minThreshold: 2 }, // Sometimes+
  { id: 2, minThreshold: 2 }, // Sometimes+
  { id: 3, minThreshold: 2 }, // Sometimes+
  { id: 4, minThreshold: 3 }, // Often+
  { id: 5, minThreshold: 3 }, // Often+
  { id: 6, minThreshold: 3 }, // Often+
] as const;

const INATTENTION_IDS = [1, 2, 3, 7, 8, 9, 10, 11, 12];
const HYPERACTIVITY_IDS = [4, 5, 6, 13, 14, 15, 16, 17, 18];

export interface ASRSScore {
  partAScore: number;
  isPartAPositive: boolean;
  inattentionRaw: number;
  hyperactivityRaw: number;
  inattentionMax: number;
  hyperactivityMax: number;
  classificationKey:
    | "results.classification.high_consistency"
    | "results.classification.low_consistency";
}

export function calculateASRSScore(responses: ASRSResponse[]): ASRSScore {
  let partAScore = 0;

  for (const criterion of PART_A_CRITERIA) {
    const resp = responses.find((r) => r.questionId === criterion.id);
    if (resp && resp.value >= criterion.minThreshold) {
      partAScore += 1;
    }
  }

  const inattentionRaw = responses
    .filter((r) => INATTENTION_IDS.includes(r.questionId))
    .reduce((sum, r) => sum + r.value, 0);

  const hyperactivityRaw = responses
    .filter((r) => HYPERACTIVITY_IDS.includes(r.questionId))
    .reduce((sum, r) => sum + r.value, 0);

  const isPartAPositive = partAScore >= 4;

  return {
    partAScore,
    isPartAPositive,
    inattentionRaw,
    hyperactivityRaw,
    inattentionMax: INATTENTION_IDS.length * 4,
    hyperactivityMax: HYPERACTIVITY_IDS.length * 4,
    classificationKey: isPartAPositive
      ? "results.classification.high_consistency"
      : "results.classification.low_consistency",
  };
}
