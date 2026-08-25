/**
 * WHO ASRS v1.1 scoring engine — web port of apps/native/lib/asrs.
 * Pure functions; nothing here touches storage or the network.
 */

export const RESPONSE_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Very Often" },
] as const;

export type ResponseValue = (typeof RESPONSE_OPTIONS)[number]["value"];

export interface ASRSResponse {
  questionId: number;
  value: ResponseValue;
}

export interface ASRSQuestion {
  id: number;
  part: "A" | "B";
  text: string;
}

export const PART_A_QUESTIONS: ASRSQuestion[] = [
  {
    id: 1,
    part: "A",
    text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
  },
  {
    id: 2,
    part: "A",
    text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
  },
  {
    id: 3,
    part: "A",
    text: "How often do you have problems remembering appointments or obligations?",
  },
  {
    id: 4,
    part: "A",
    text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
  },
  {
    id: 5,
    part: "A",
    text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
  },
  {
    id: 6,
    part: "A",
    text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
  },
];

export const PART_B_QUESTIONS: ASRSQuestion[] = [
  {
    id: 7,
    part: "B",
    text: "How often do you make careless mistakes when you have to work on something boring or challenging?",
  },
  {
    id: 8,
    part: "B",
    text: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
  },
  {
    id: 9,
    part: "B",
    text: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
  },
  {
    id: 10,
    part: "B",
    text: "How often do you misplace or have difficulty finding things at home or at work?",
  },
  {
    id: 11,
    part: "B",
    text: "How often are you distracted by activity or noise around you?",
  },
  {
    id: 12,
    part: "B",
    text: "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?",
  },
  {
    id: 13,
    part: "B",
    text: "How often do you feel restless or fidgety?",
  },
  {
    id: 14,
    part: "B",
    text: "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
  },
  {
    id: 15,
    part: "B",
    text: "How often do you find yourself talking too much when you are in social situations?",
  },
  {
    id: 16,
    part: "B",
    text: "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to before they can finish them themselves?",
  },
  {
    id: 17,
    part: "B",
    text: "How often do you have difficulty waiting your turn in situations when turn taking is required?",
  },
  {
    id: 18,
    part: "B",
    text: "How often do you interrupt others when they are busy?",
  },
];

const PART_A_CRITERIA = [
  { id: 1, minThreshold: 2 }, // Sometimes+
  { id: 2, minThreshold: 2 },
  { id: 3, minThreshold: 2 },
  { id: 4, minThreshold: 3 }, // Often+
  { id: 5, minThreshold: 3 },
  { id: 6, minThreshold: 3 },
];

const INATTENTION_IDS = [1, 2, 3, 7, 8, 9, 10, 11, 12];
const HYPERACTIVITY_IDS = [4, 5, 6, 13, 14, 15, 16, 17, 18];

export interface ASRSScore {
  partAScore: number;
  isPartAPositive: boolean;
  inattentionRaw: number;
  hyperactivityRaw: number;
  inattentionMax: number;
  hyperactivityMax: number;
}

export function calculateASRSScore(responses: ASRSResponse[]): ASRSScore {
  const partAScore = PART_A_CRITERIA.filter((c) => {
    const resp = responses.find((r) => r.questionId === c.id);
    return resp && resp.value >= c.minThreshold;
  }).length;

  const sum = (ids: number[]) =>
    responses
      .filter((r) => ids.includes(r.questionId))
      .reduce((sum, r) => sum + r.value, 0);

  return {
    partAScore,
    isPartAPositive: partAScore >= 4,
    inattentionRaw: sum(INATTENTION_IDS),
    hyperactivityRaw: sum(HYPERACTIVITY_IDS),
    inattentionMax: INATTENTION_IDS.length * 4,
    hyperactivityMax: HYPERACTIVITY_IDS.length * 4,
  };
}
