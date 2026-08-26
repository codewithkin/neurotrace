import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ChartLine, FileText, ScrollText, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "NeuroTrace — Private ADHD Self-Screener & Symptom Log",
};

/*
 * Landing page, built against designs/NeuroTrace Screens.dc.html
 * "Web 1 Landing". Spacing, type sizes and colours are the design's own
 * values; the only liberties are responsive clamps below 1280px, which the
 * static mock cannot express.
 */

const FEATURES = [
  {
    Icon: Target,
    title: "The clinical instrument",
    body: "The same six-item Part A screen and twelve trait questions used in primary care.",
  },
  {
    Icon: FileText,
    title: "A page for your doctor",
    body: "Scores, flagged answers and the source citation, ready to print or share.",
  },
  {
    Icon: ChartLine,
    title: "Track the pattern",
    body: "Re-screen monthly in the app and watch the two subscales over time.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center px-6 pt-14 text-center sm:px-14 sm:pt-[74px]">
        <span
          className="nt-rise inline-flex items-center gap-2 rounded-full bg-nt-tint px-[15px] py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
          style={{ animationDelay: "0ms" }}
        >
          <BadgeCheck size={15} aria-hidden />
          WHO ASRS v1.1
        </span>

        <h1
          className="nt-rise mt-[26px] max-w-[860px] text-[clamp(2.25rem,6.4vw,66px)] font-semibold leading-[1.04] tracking-[-0.045em]"
          style={{ animationDelay: "60ms" }}
        >
          Find out whether it is
          <br className="hidden sm:inline" /> worth asking your{" "}
          <span className="text-primary">doctor</span>
        </h1>

        <p
          className="nt-rise mt-[22px] max-w-[620px] text-lg leading-[1.6] text-nt-hero-sub"
          style={{ animationDelay: "120ms" }}
        >
          Eighteen validated questions, four minutes, and a one-page summary you can hand to a
          clinician. Nothing is uploaded and there is no account.
        </p>

        <div
          className="nt-rise mt-[34px] flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "180ms" }}
        >
          <Link
            href="/app"
            className="nt-lift flex items-center justify-center gap-[9px] rounded-[14px] bg-primary px-[26px] py-4 text-base font-semibold text-primary-foreground"
          >
            Give me my score
            <ArrowRight size={20} aria-hidden />
          </Link>
          <Link
            href="/health"
            className="nt-lift flex items-center justify-center gap-[9px] rounded-[14px] border border-nt-chrome px-[26px] py-4 text-base font-semibold text-foreground"
          >
            <ScrollText size={20} className="text-primary" aria-hidden />
            Health statement
          </Link>
        </div>

        <p
          className="nt-rise mt-[26px] font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-nt-trust"
          style={{ animationDelay: "240ms" }}
        >
          No account · no upload · free
        </p>

        <div
          id="how-it-works"
          className="mt-16 grid w-full max-w-[1040px] gap-5 pb-16 text-left md:grid-cols-3"
        >
          {FEATURES.map(({ Icon, title, body }, i) => (
            <div
              key={title}
              className="nt-rise nt-lift rounded-[20px] border border-border p-[26px]"
              style={{ animationDelay: `${300 + i * 60}ms` }}
            >
              <Icon size={28} className="text-primary" aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-[1.6] text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-card px-6 py-[22px] text-xs text-muted-foreground sm:px-14">
        NeuroTrace is a screening tool and does not provide a diagnosis. If you are in crisis,
        contact your local emergency service.
      </footer>
    </div>
  );
}
