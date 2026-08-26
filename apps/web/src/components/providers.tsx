"use client";

import { Toaster } from "@neurotrace/ui/components/sonner";

import { ThemeProvider } from "./theme-provider";

/*
 * The three web designs are light-only; /app/result paints its own dark
 * ground instead of following a site theme (D-009). The theme is therefore
 * forced to light rather than following the OS, and the header carries no
 * mode toggle.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
      {children}
      <Toaster richColors />
    </ThemeProvider>
  );
}
