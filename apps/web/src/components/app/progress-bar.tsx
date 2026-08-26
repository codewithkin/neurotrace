"use client";

/** Screener progress bar: the design's 8px track at 4px radius. */
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded" style={{ backgroundColor: "#ecebf3" }}>
      <div
        className="h-full rounded bg-primary transition-all duration-300"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}
