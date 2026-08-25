import type { Metadata } from "next";

import { Screener } from "@/components/app/screener";

export const metadata: Metadata = {
  title: "ASRS v1.1 Self-Screener — NeuroTrace",
  description:
    "Take the WHO ASRS v1.1 self-screening in your browser. Free, private, nothing stored.",
};

export default function AppPage() {
  return <Screener />;
}
