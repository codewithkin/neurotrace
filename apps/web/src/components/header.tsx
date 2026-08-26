import Link from "next/link";

/*
 * Site header, from designs/NeuroTrace Screens.dc.html "Web 1 Landing":
 * 26px/56px padding over a 1px #eae7f2 rule, 20px/700/-0.02em wordmark
 * with "Trace" in violet, 34px-gapped 14px/500 links and a violet CTA
 * pill (11px/20px, radius 12).
 */

const LINKS = [
  { to: "/#how-it-works", label: "How it works" },
  { to: "/health", label: "The science" },
  { to: "/privacy", label: "Privacy" },
] as const;

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`text-xl font-bold tracking-[-0.02em] text-foreground ${className}`}
    >
      Neuro<span className="text-primary">Trace</span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-[26px] sm:px-14">
        <Wordmark />
        <nav className="flex items-center gap-5 sm:gap-[34px]">
          <span className="hidden items-center gap-[34px] text-sm font-medium text-muted-foreground md:flex">
            {LINKS.map(({ to, label }) => (
              <Link key={to} href={to} className="transition-colors hover:text-foreground">
                {label}
              </Link>
            ))}
          </span>
          <Link
            href="/app"
            className="nt-lift rounded-[12px] bg-primary px-5 py-[11px] text-sm font-semibold text-primary-foreground"
          >
            Start the screener
          </Link>
        </nav>
      </div>
    </header>
  );
}
