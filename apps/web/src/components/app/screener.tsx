"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { ProgressBar } from "@/components/app/progress-bar";
import { ResultsView } from "@/components/app/results-view";
import { ScalePills } from "@/components/app/scale-pills";
import { Wordmark } from "@/components/header";
import {
  calculateASRSScore,
  PART_A_QUESTIONS,
  PART_B_QUESTIONS,
  type ASRSResponse,
  type ASRSScore,
  type ResponseValue,
} from "@/lib/asrs";

type Phase = "questions" | "calculating" | "results";

const QUESTIONS = [...PART_A_QUESTIONS, ...PART_B_QUESTIONS];
const TOTAL = QUESTIONS.length;
const PART_A_COUNT = PART_A_QUESTIONS.length;
const STORAGE_KEY = "neurotrace.screener.v1";

/*
 * Browser screener, from "Web 2 Screener".
 *
 * Note (session 4): two changes the plan did not anticipate.
 *
 * 1. The design's footer promises "Progress is kept in this browser only",
 *    but nothing was persisted — the old copy said the opposite ("refresh
 *    to start over"). Answers now go to localStorage so the promise holds.
 * 2. There is no intro screen in the design and the landing CTA reads
 *    "Give me my score", so /app opens on question one.
 */
export function Screener() {
  const [phase, setPhase] = useState<Phase>("questions");
  const [responses, setResponses] = useState<ASRSResponse[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState<ASRSScore | null>(null);
  const [restored, setRestored] = useState(false);

  // Restore after mount so the server and first client render agree.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { responses: ASRSResponse[]; index: number };
        if (Array.isArray(saved.responses)) {
          setResponses(saved.responses);
          setIndex(Math.min(Math.max(0, saved.index ?? 0), TOTAL - 1));
        }
      }
    } catch {
      // Private mode, blocked storage, corrupt value — start clean.
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ responses, index }));
    } catch {
      // Nothing to do; the screener still works in-memory.
    }
  }, [responses, index, restored]);

  const question = QUESTIONS[index];
  const selected = responses.find((r) => r.questionId === question.id)?.value;
  const inPartA = index < PART_A_COUNT;

  function answer(value: ResponseValue) {
    const next: ASRSResponse[] = [
      ...responses.filter((r) => r.questionId !== question.id),
      { questionId: question.id, value },
    ];
    setResponses(next);

    setTimeout(() => {
      if (index < TOTAL - 1) {
        setIndex(index + 1);
        return;
      }
      setPhase("calculating");
      setTimeout(() => {
        setScore(calculateASRSScore(next));
        setPhase("results");
      }, 1500);
    }, 180);
  }

  function restart() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setResponses([]);
    setIndex(0);
    setScore(null);
    setPhase("questions");
  }

  if (phase === "results" && score) {
    return <ResultsView score={score} onRestart={restart} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-[22px] sm:px-14">
        <Wordmark className="!text-lg" />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-nt-trust">
          {phase === "calculating"
            ? `${TOTAL} of ${TOTAL} answered`
            : `Question ${index + 1} of ${TOTAL} · ${inPartA ? "core screening" : "trait profile"}`}
        </span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-14">
        <div className="w-full max-w-[720px]">
          <ProgressBar
            progress={phase === "calculating" ? 1 : (index + 1) / TOTAL}
          />

          {phase === "calculating" ? (
            <p className="mt-10 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              18 answers · WHO scoring matrix
            </p>
          ) : (
            <>
              <p className="mt-[26px] text-sm text-muted-foreground">
                {inPartA ? "Over the past six months" : "How often does this apply to you?"}
              </p>
              <h2 className="mt-4 text-[clamp(1.75rem,4vw,40px)] font-semibold leading-[1.22] tracking-[-0.03em] text-balance">
                {question.text}
              </h2>
              <div className="mt-10">
                <ScalePills
                  key={question.id}
                  selectedValue={selected}
                  onSelect={answer}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 p-6 text-[13px] text-nt-trust">
        <Check size={16} aria-hidden />
        Progress is kept in this browser only
      </div>
    </div>
  );
}
