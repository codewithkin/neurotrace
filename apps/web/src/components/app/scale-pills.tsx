"use client";

import { RESPONSE_OPTIONS, type ResponseValue } from "@/lib/asrs";

const PILL_STYLES = [
  "bg-blue-500 hover:bg-blue-400",
  "bg-sky-500 hover:bg-sky-400",
  "bg-indigo-500 hover:bg-indigo-400",
  "bg-violet-600 hover:bg-violet-500",
  "bg-purple-700 hover:bg-purple-600",
] as const;

export function ScalePills({
  selectedValue,
  onSelect,
}: {
  selectedValue?: ResponseValue;
  onSelect: (value: ResponseValue) => void;
}) {
  return (
    <div className="grid gap-2.5">
      {RESPONSE_OPTIONS.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`${PILL_STYLES[option.value]} rounded-xl px-5 py-3.5 text-center text-sm font-semibold text-white transition-all active:scale-[0.98] ${
              isSelected ? "ring-2 ring-white/70 ring-offset-2 ring-offset-transparent" : "opacity-90"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
