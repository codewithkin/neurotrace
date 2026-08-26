export type Subscale = "inattention" | "hyperactivity";

export interface ASRSQuestion {
  id: number; // 1 to 18
  part: "A" | "B";
  subscale: Subscale;
  /** i18n key under `assessment.questions` */
  textKey: string;
}

/**
 * WHO ASRS v1.1 item map.
 * Part A = items 1-6 (core screener). Part B = items 7-18.
 * Inattention subscale: 1,2,3,7,8,9,10,11,12. Hyperactivity: 4,5,6,13-18.
 */
export const ASRS_QUESTIONS: ASRSQuestion[] = [
  { id: 1, part: "A", subscale: "inattention", textKey: "q1" },
  { id: 2, part: "A", subscale: "inattention", textKey: "q2" },
  { id: 3, part: "A", subscale: "inattention", textKey: "q3" },
  { id: 4, part: "A", subscale: "hyperactivity", textKey: "q4" },
  { id: 5, part: "A", subscale: "hyperactivity", textKey: "q5" },
  { id: 6, part: "A", subscale: "hyperactivity", textKey: "q6" },
  { id: 7, part: "B", subscale: "inattention", textKey: "q7" },
  { id: 8, part: "B", subscale: "inattention", textKey: "q8" },
  { id: 9, part: "B", subscale: "inattention", textKey: "q9" },
  { id: 10, part: "B", subscale: "inattention", textKey: "q10" },
  { id: 11, part: "B", subscale: "inattention", textKey: "q11" },
  { id: 12, part: "B", subscale: "inattention", textKey: "q12" },
  { id: 13, part: "B", subscale: "hyperactivity", textKey: "q13" },
  { id: 14, part: "B", subscale: "hyperactivity", textKey: "q14" },
  { id: 15, part: "B", subscale: "hyperactivity", textKey: "q15" },
  { id: 16, part: "B", subscale: "hyperactivity", textKey: "q16" },
  { id: 17, part: "B", subscale: "hyperactivity", textKey: "q17" },
  { id: 18, part: "B", subscale: "hyperactivity", textKey: "q18" },
];

export const PART_A_QUESTIONS = ASRS_QUESTIONS.filter((q) => q.part === "A");
export const PART_B_QUESTIONS = ASRS_QUESTIONS.filter((q) => q.part === "B");

/**
 * Short symptom labels for the doctor's report and the PDF matrix
 * (i18n keys under `pdf.symptoms`).
 *
 * Note (session 4): this map was misaligned with the question bank — item 1
 * ("trouble wrapping up the final details of a project") was labelled
 * "careless mistakes", item 4 ("avoid or delay a task that requires a lot
 * of thought") was labelled "difficulty finishing tasks", and so on down
 * the list. Every label on a clinician-facing page was describing the
 * wrong item. Realigned against the ASRS v1.1 item texts above.
 */
export const ASRS_SYMPTOM_KEYS: Record<number, string> = {
  1: "finishing_tasks",
  2: "disorganization",
  3: "forgetfulness",
  4: "avoiding_sustained_effort",
  5: "fidgeting",
  6: "feeling_restless",
  7: "careless_mistakes",
  8: "difficulty_concentrating",
  9: "listening_difficulty",
  10: "losing_things",
  11: "easily_distracted",
  12: "leaving_seat",
  13: "restless_hands",
  14: "difficulty_relaxing",
  15: "talks_excessively",
  16: "interrupting",
  17: "impatience",
  18: "intruding_on_others",
};
