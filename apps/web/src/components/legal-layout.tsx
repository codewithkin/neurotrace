import Link from "next/link";

/*
 * Shared chrome for the legal pages (/privacy, /terms, /health), adapted from
 * the static-wave and excuseless web apps so all projects' legal pages stay
 * structurally identical.
 */

export function LegalPage({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <header className="border-b py-8">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-3 font-mono text-xs">
          Effective {effectiveDate}
        </p>
      </header>

      <div className="py-12">{children}</div>

      <footer className="border-t py-8 font-mono text-xs text-muted-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} NeuroTrace</span>
          <span className="flex gap-5">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/health" className="hover:text-foreground">
              Health Statement
            </Link>
          </span>
        </div>
      </footer>
    </main>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="text-muted-foreground mt-4 space-y-4 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i} className="list-disc marker:text-primary">
          {item}
        </li>
      ))}
    </ul>
  );
}
