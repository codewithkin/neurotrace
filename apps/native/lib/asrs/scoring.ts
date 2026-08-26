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

/**
 * Part A screening thresholds from the WHO ASRS v1.1 scoring grid: items 1-3
 * count from "Sometimes", items 4-6 from "Often". An item at or above its
 * threshold is "flagged" (the shaded box on the paper instrument).
 */
export const PART_A_CRITERIA = [
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

/** Part A items whose answer lands in the shaded range, in question order. */
export function getFlaggedPartAResponses(
  responses: ASRSResponse[],
): ASRSResponse[] {
  return PART_A_CRITERIA.flatMap((criterion) => {
    const response = responses.find((r) => r.questionId === criterion.id);
    return response && response.value >= criterion.minThreshold ? [response] : [];
  });
}

/**
 * Part B has no shaded boxes on the paper instrument, so "flagged" there
 * means answered Often or Very often. The design's report lists items from
 * both parts (D-014), which the Part-A-only rule could not produce.
 */
const PART_B_FLAG_THRESHOLD = 3;

/** Every response worth listing on the doctor's report, in question order. */
export function getFlaggedResponses(responses: ASRSResponse[]): ASRSResponse[] {
  const partA = new Set<number>(PART_A_CRITERIA.map((c) => c.id));
  return [...responses]
    .filter((r) => {
      const criterion = PART_A_CRITERIA.find((c) => c.id === r.questionId);
      if (criterion) return r.value >= criterion.minThreshold;
      return !partA.has(r.questionId) && r.value >= PART_B_FLAG_THRESHOLD;
    })
    .sort((a, b) => a.questionId - b.questionId);
}

/** How many of the six Part A items are flagged. */
export function countFlaggedPartA(responses: ASRSResponse[]): number {
  return getFlaggedPartAResponses(responses).length;
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
