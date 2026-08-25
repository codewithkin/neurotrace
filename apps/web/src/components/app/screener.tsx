"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ProgressBar } from "@/components/app/progress-bar";
import { ResultsView } from "@/components/app/results-view";
import { ScalePills } from "@/components/app/scale-pills";
import {
  calculateASRSScore,
  PART_A_QUESTIONS,
  PART_B_QUESTIONS,
  type ASRSResponse,
  type ASRSScore,
  type ResponseValue,
} from "@/lib/asrs";

type Phase = "intro" | "partA" | "partB" | "calculating" | "results";

export function Screener() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [responses, setResponses] = useState<ASRSResponse[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState<ASRSScore | null>(null);

  const partA = PART_A_QUESTIONS;
  const partB = PART_B_QUESTIONS;

  const activeQuestion =
    phase === "partA" ? partA[index] : phase === "partB" ? partB[index] : null;
  const selected =
    activeQuestion
      ? responses.find((r) => r.questionId === activeQuestion.id)?.value
      : undefined;

  const answeredCount = responses.length;
  const totalCount = partA.length + partB.length;
  const overallProgress = useMemo(
    () => Math.min(answeredCount / totalCount, 1),
    [answeredCount, totalCount],
  );

  function start() {
    setResponses([]);
    setScore(null);
    setIndex(0);
    setPhase("partA");
  }

  function answer(value: ResponseValue) {
    if (!activeQuestion) return;
    const next: ASRSResponse[] = [
      ...responses.filter((r) => r.questionId !== activeQuestion.id),
      { questionId: activeQuestion.id, value },
    ];
    setResponses(next);

    setTimeout(() => {
      if (phase === "partA") {
        if (index < partA.length - 1) {
          setIndex(index + 1);
        } else {
          setPhase("partB");
          setIndex(0);
        }
      } else if (phase === "partB") {
        if (index < partB.length - 1) {
          setIndex(index + 1);
        } else {
          setPhase("calculating");
          setTimeout(() => {
            setScore(calculateASRSScore(next));
            setPhase("results");
          }, 1500);
        }
      }
    }, 180);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6">
      {/* Screen-only chrome */}
      <div className="print:hidden">
        {(phase === "partA" || phase === "partB" || phase === "calculating") && (
          <div className="pt-10">
            <ProgressBar progress={overallProgress} />
            <p className="text-muted-foreground mt-3 font-mono text-xs uppercase tracking-wide">
              Question{" "}
              {phase === "partA"
                ? `${index + 1} of ${partA.length} · Core Screening`
                : phase === "partB"
                  ? `${index + 1} of ${partB.length} · Severity & Frequency`
                  : ""}
            </p>
          </div>
        )}

        {phase === "intro" && (
          <section className="py-20 text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              ASRS v1.1 Self-Screener
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg leading-relaxed">
              18 quick questions based on the WHO Adult ADHD Self-Report Scale.
              Takes under 3 minutes — answers are processed entirely in this
              browser tab and never stored or uploaded.
            </p>
            <button
              type="button"
              onClick={start}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex h-12 items-center rounded-xl px-8 text-sm font-semibold transition-colors"
            >
              Start the screener
            </button>
          </section>
        )}

        {(phase === "partA" || phase === "partB") && activeQuestion && (
          <section className="py-12">
            <p className="text-muted-foreground mb-6 font-medium tracking-wide uppercase">
              {phase === "partA" ? "" : "Just 12 quick traits left — you're doing great!"}
            </p>
            <h2 className="text-2xl leading-relaxed font-semibold tracking-tight sm:text-[26px]">
              {activeQuestion.text}
            </h2>
            <div className="mt-8">
              <ScalePills
                key={activeQuestion.id}
                selectedValue={selected}
                onSelect={answer}
              />
            </div>
            <p className="text-muted-foreground mt-6 text-center text-xs">
              Answers are not saved anywhere — refresh to start over.
            </p>
          </section>
        )}

        {phase === "calculating" && (
          <section className="flex flex-col items-center py-24 text-center">
            <span className="animate-pulse text-5xl">🧠</span>
            <p className="text-muted-foreground mt-4 text-sm font-medium">
              Analyzing your responses…
            </p>
          </section>
        )}

        {phase === "results" && score && (
          <section className="py-12">
            <ResultsView score={score} onRestart={() => setPhase("intro")} />
          </section>
        )}
      </div>
    </main>
  );
}
