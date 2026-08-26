import type { Metadata } from "next";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "NeuroTrace — Private ADHD Self-Screener & Symptom Log",
  description:
    "Private ADHD self-screener & daily focus log. Generate doctor-ready PDF reports. 100% local, no account.",
};

/*
 * The design's type is the platform system stack (-apple-system / SF Pro
 * Text / system-ui), set on --font-sans in index.css, so no web font is
 * downloaded here.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div className="flex min-h-svh flex-col">
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
