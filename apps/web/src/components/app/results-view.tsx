"use client";

import { AlertCircle, CheckCircle2, Printer, Smartphone } from "lucide-react";

import { Wordmark } from "@/components/header";
import type { ASRSScore } from "@/lib/asrs";

/*
 * Result page, from "Web 3 Result".
 *
 * Permanently dark regardless of site theme (D-009), so the colours are
 * the design's literal dark values rather than the light site's tokens.
 * Printing renders the plain white summary below instead.
 */
const DARK = {
  ground: "#0b0a0f",
  ink: "#f4f2fa",
  muted: "#9a95ac",
  border: "#282534",
  card: "#17151f",
  track: "#252231",
  accent: "#8b5cf6",
  amberBg: "#3a2c0a",
  amberFg: "#fbbf24",
  greenBg: "#0e2a18",
  greenFg: "#4ade80",
};

/** Deep link first, store listing if nothing handles the scheme. */
const APP_SCHEME = "neurotrace://";
const STORE_URL =
  "https://play.google.com/store/apps/details?id=com.codewithkin.neurotrace";

const BARS = [
  { key: "inattention", gradient: "linear-gradient(90deg,#6d42e8,#a855f7)" },
  { key: "hyperactivity", gradient: "linear-gradient(90deg,#6d42e8,#8b5cf6)" },
  { key: "partA", gradient: "linear-gradient(90deg,#4f46e5,#7c3aed)" },
] as const;

export function ResultsView({
  score,
  onRestart,
}: {
  score: ASRSScore;
  onRestart: () => void;
}) {
  const inattentionPct = Math.round(
    (score.inattentionRaw / Math.max(1, score.inattentionMax)) * 100,
  );
  const hyperactivityPct = Math.round(
    (score.hyperactivityRaw / Math.max(1, score.hyperactivityMax)) * 100,
  );
  const partAPct = Math.round((score.partAScore / 6) * 100);

  const rows = [
    { label: "Inattention", value: `${inattentionPct}%`, pct: inattentionPct, ...BARS[0] },
    { label: "Hyperactivity", value: `${hyperactivityPct}%`, pct: hyperactivityPct, ...BARS[1] },
    { label: "Part A screen", value: `${score.partAScore} / 6`, pct: partAPct, ...BARS[2] },
  ];

  const classification = score.isPartAPositive
    ? "Symptoms consistent with ADHD"
    : "Symptoms below the screening threshold";
  const dateLabel = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  function continueInApp() {
    const fallback = window.setTimeout(() => {
      window.location.href = STORE_URL;
    }, 900);
    window.addEventListener(
      "pagehide",
      () => window.clearTimeout(fallback),
      { once: true },
    );
    window.location.href = APP_SCHEME;
  }

  return (
    <>
      <div
        className="flex flex-1 flex-col print:hidden"
        style={{ backgroundColor: DARK.ground, color: DARK.ink }}
      >
        <header
          className="flex items-center justify-between px-6 py-[22px] sm:px-14"
          style={{ borderBottom: `1px solid ${DARK.border}` }}
        >
          <Wordmark className="!text-lg" style={{ color: DARK.ink }} accentColor={DARK.accent} />
          <span
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: DARK.muted }}
          >
            18 of 18 answered
          </span>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-14">
          <div className="w-full max-w-[760px] text-center">
            <span
              className="inline-flex items-center gap-[9px] rounded-full px-5 py-[11px] text-base font-semibold"
              style={{
                backgroundColor: score.isPartAPositive ? DARK.amberBg : DARK.greenBg,
                color: score.isPartAPositive ? DARK.amberFg : DARK.greenFg,
              }}
            >
              {score.isPartAPositive ? (
                <AlertCircle size={20} aria-hidden />
              ) : (
                <CheckCircle2 size={20} aria-hidden />
              )}
              {classification}
            </span>
            <p className="mt-3.5 text-[13px]" style={{ color: DARK.muted }}>
              A positive screen is not a diagnosis. Bring this summary to a clinician.
            </p>

            <div
              className="mt-[34px] rounded-[24px] px-9 py-[34px] text-left"
              style={{ backgroundColor: DARK.card, border: `1px solid ${DARK.border}` }}
            >
              <div
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: DARK.muted }}
              >
                Trait breakdown
              </div>
              <div className="mt-[26px] grid gap-6">
                {rows.map((row) => (
                  <div key={row.key}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold">{row.label}</span>
                      <span className="font-mono text-[17px] font-semibold">{row.value}</span>
                    </div>
                    <div
                      className="mt-[11px] h-3 overflow-hidden rounded-[6px]"
                      style={{ backgroundColor: DARK.track }}
                    >
                      <div
                        className="h-full rounded-[6px]"
                        style={{ width: `${row.pct}%`, background: row.gradient }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.print()}
                className="nt-lift flex items-center justify-center gap-[9px] rounded-[14px] px-[26px] py-4 text-base font-semibold"
                style={{ backgroundColor: DARK.accent, color: DARK.ground }}
              >
                <Printer size={20} aria-hidden />
                Print my summary
              </button>
              <button
                type="button"
                onClick={continueInApp}
                className="nt-lift flex items-center justify-center gap-[9px] rounded-[14px] px-[26px] py-4 text-base font-semibold"
                style={{ border: `1px solid ${DARK.border}`, color: DARK.ink }}
              >
                <Smartphone size={20} style={{ color: DARK.accent }} aria-hidden />
                Continue in the app
              </button>
            </div>

            <button
              type="button"
              onClick={onRestart}
              className="mt-4 px-4 py-3 text-sm font-semibold"
              style={{ color: DARK.muted }}
            >
              Start over
            </button>
          </div>
        </div>

        <div
          className="px-6 py-[22px] text-xs sm:px-14"
          style={{ borderTop: `1px solid ${DARK.border}`, color: DARK.muted }}
        >
          Instrument: WHO Adult ADHD Self-Report Scale (ASRS-v1.1). Print output renders as a
          plain white document regardless of theme.
        </div>
      </div>

      {/* Print-only doctor summary: white paper, ink type, no chrome. */}
      <div className="hidden print:block">
        <header className="border-b-2 border-violet-600 pb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest">NeuroTrace</p>
          <h1 className="text-xl font-bold">ASRS v1.1 Screening Summary</h1>
          <p className="text-xs">
            {dateLabel} · self-administered · Instrument: WHO Adult ADHD Self-Report Scale
            (ASRS-v1.1)
          </p>
        </header>
        <section className="mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wide">Result</h2>
          <p className="mt-2 text-sm font-semibold">{classification}</p>
          <table className="mt-3 w-full border-collapse text-xs">
            <tbody>
              <tr className="border-b">
                <td className="py-1.5 font-medium">Part A screen</td>
                <td className="py-1.5 text-right">{score.partAScore} / 6</td>
              </tr>
              <tr className="border-b">
                <td className="py-1.5 font-medium">Inattention</td>
                <td className="py-1.5 text-right">
                  {score.inattentionRaw} / {score.inattentionMax} ({inattentionPct}%)
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-1.5 font-medium">Hyperactivity</td>
                <td className="py-1.5 text-right">
                  {score.hyperactivityRaw} / {score.hyperactivityMax} ({hyperactivityPct}%)
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs">
            Part A threshold rule: {score.partAScore} of 6 items met the screening threshold
            (4+ indicates a positive screen).
          </p>
        </section>
        <footer className="mt-8 border-t pt-3 text-[10px] leading-relaxed">
          Source: World Health Organization Adult ADHD Self-Report Scale (ASRS-v1.1) Symptom
          Checklist. Kessler RC et al., 2005. Screening instrument; not a diagnostic tool.
        </footer>
      </div>
    </>
  );
}
