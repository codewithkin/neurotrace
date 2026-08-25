import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NeuroTrace — Private ADHD Self-Screener & Symptom Log",
};

const FEATURES = [
  {
    title: "Official ASRS v1.1 Screener",
    body: "An 18-question self-report assessment grounded in the WHO Adult ADHD Self-Report Scale — completed in under 3 minutes.",
  },
  {
    title: "Doctor-Ready PDF Report",
    body: "Your answers are organised into a structured summary with score matrix and citations, ready to hand to your doctor or therapist.",
  },
  {
    title: "10-Second Daily Focus Log",
    body: "Track focus, brain fog, executive friction, mood and medication adherence with simple sliders — zero typing required.",
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6">
      {/* Hero */}
      <section className="py-20 text-center sm:py-28">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Neuro
          <span className="bg-gradient-to-r from-violet-500 to-purple-700 bg-clip-text text-transparent">
            Trace
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-relaxed">
          A private, local-first ADHD self-screener and daily focus log for
          adults. Your answers, scores and logs never leave your device.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/health"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center rounded-lg px-6 text-sm font-medium transition-colors"
          >
            Read the Health Statement
          </Link>
          <Link
            href="/privacy"
            className="border-input hover:bg-accent inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
        <p className="text-muted-foreground mt-6 font-mono text-xs uppercase tracking-widest">
          WHO ASRS v1.1 · Local-first · No account
        </p>
      </section>

      {/* Features */}
      <section className="grid gap-4 pb-24 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-card rounded-xl border p-5">
            <h2 className="text-foreground text-sm font-semibold">{f.title}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {f.body}
            </p>
          </div>
        ))}
      </section>

      {/* Disclaimer */}
      <section className="pb-20">
        <p className="text-muted-foreground border-t pt-8 text-center text-xs leading-relaxed">
          NeuroTrace is an educational self-report checklist based on the WHO
          ASRS v1.1 framework. It is not a medical diagnostic test, clinical
          evaluation, or health advice. Always consult a qualified medical
          professional.
        </p>
      </section>
    </main>
  );
}
