"use client";

import { Button } from "@neurotrace/ui/components/button";
import { useState } from "react";

import type { ASRSScore } from "@/lib/asrs";

function ScoreBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-foreground text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-xs tabular-nums">
          {value} / {max}
        </span>
      </div>
      <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: `rgba(124, 58, 237, ${0.35 + (pct / 100) * 0.65})`,
          }}
        />
      </div>
    </div>
  );
}

export function ResultsView({
  score,
  onRestart,
}: {
  score: ASRSScore;
  onRestart: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  const classification = score.isPartAPositive
    ? "Significant trait consistency detected"
    : "Low trait consistency detected";
  const dateLabel = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <>
      {/* Screen-only interactive view */}
      <div className="print:hidden">
        {!revealed ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="bg-card w-full max-w-md rounded-2xl border p-10">
              <span className="text-5xl">🧠</span>
              <h2 className="text-foreground mt-4 text-xl font-semibold">
                Your Focus Profile is ready
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                18 of 18 questions answered. Everything below is computed on
                this device and never uploaded.
              </p>
              <Button
                size="lg"
                className="mt-6 w-full cursor-pointer"
                onClick={() => setRevealed(true)}
              >
                Give me my score
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border p-6">
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold ${
                  score.isPartAPositive
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {classification}
              </span>
              <div className="mt-6 space-y-5">
                <ScoreBar
                  label="Inattention Subscale"
                  value={score.inattentionRaw}
                  max={score.inattentionMax}
                />
                <ScoreBar
                  label="Hyperactivity Subscale"
                  value={score.hyperactivityRaw}
                  max={score.hyperactivityMax}
                />
                <ScoreBar label="Part A Core Score" value={score.partAScore} max={6} />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={() => window.print()}
              >
                Print / Save as PDF
              </Button>
              <Button
                variant="ghost"
                className="flex-1 cursor-pointer"
                onClick={onRestart}
              >
                Retake Assessment
              </Button>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              This is an educational self-screening result based on the WHO ASRS
              v1.1. It is not a medical diagnosis.
            </p>
          </div>
        )}
      </div>

      {/* Print-only doctor summary */}
      <div className="hidden print:block">
        <header className="border-b-2 border-violet-600 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest">
            NeuroTrace
          </p>
          <h1 className="text-xl font-bold">Doctor&apos;s Summary Report</h1>
          <p className="text-xs">
            Date: {dateLabel} · Instrument: WHO Adult ADHD Self-Report Scale
            (ASRS v1.1)
          </p>
        </header>
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Result</h2>
          <p className="mt-2 text-sm font-semibold">{classification}</p>
          <table className="mt-3 w-full border-collapse text-xs">
            <tbody>
              <tr className="border-b">
                <td className="py-1.5 font-medium">Part A Core Score</td>
                <td className="py-1.5 text-right">{score.partAScore} / 6</td>
              </tr>
              <tr className="border-b">
                <td className="py-1.5 font-medium">Inattention Subscale</td>
                <td className="py-1.5 text-right">
                  {score.inattentionRaw} / {score.inattentionMax}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1.5 font-medium">Hyperactivity Subscale</td>
                <td className="py-1.5 text-right">
                  {score.hyperactivityRaw} / {score.hyperactivityMax}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs">
            Part A threshold rule: {score.partAScore} of 6 items met the
            screening threshold (4+ indicates high trait consistency).
          </p>
        </section>
        <footer className="mt-8 border-t pt-3 text-[10px] leading-relaxed">
          Source: World Health Organization Adult ADHD Self-Report Scale (ASRS
          v1.1) Symptom Checklist (Kessler et al., 2005). This document is an
          educational self-report summary generated client-side by NeuroTrace
          and does not constitute a clinical diagnosis.
        </footer>
      </div>
    </>
  );
}
