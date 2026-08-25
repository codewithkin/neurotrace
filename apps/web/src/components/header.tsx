"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "./mode-toggle";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/app", label: "Screener" },
  { to: "/health", label: "Health" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
] as const;

function Wordmark() {
  return (
    <Link href="/" className="group flex items-baseline gap-0.5">
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Neuro
      </span>
      <span className="bg-gradient-to-r from-violet-500 to-purple-700 bg-clip-text text-lg font-semibold tracking-tight text-transparent">
        Trace
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-6">
        <Wordmark />
        <nav className="flex items-center gap-5">
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === to
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
