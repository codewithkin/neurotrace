"use client";

import { Check } from "lucide-react";

import { RESPONSE_OPTIONS, type ResponseValue } from "@/lib/asrs";

/*
 * Frequency scale from "Web 2 Screener": the 0-4 ramp at .92, 20px/26px
 * padding, 16px radius, 17px/600 white label and a mono numeral at .75.
 * The selected pill goes to full opacity and gains the design's double
 * ring — 3px of page white, then 3px of ink.
 *
 * The radius is written literally: packages/ui offsets shadcn's radius
 * scale, so `rounded-2xl` is 20px here, not the design's 16px.
 */
const RAMP = ["#2563eb", "#0ea5e9", "#4f46e5", "#7c3aed", "#9333ea"] as const;

export function ScalePills({
  selectedValue,
  onSelect,
}: {
  selectedValue?: ResponseValue;
  onSelect: (value: ResponseValue) => void;
}) {
  return (
    <div className="grid gap-3">
      {RESPONSE_OPTIONS.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            aria-pressed={isSelected}
            className="flex items-center justify-between rounded-[16px] px-[26px] py-5 text-[17px] font-semibold text-white transition-all active:scale-[0.99]"
            style={{
              backgroundColor: RAMP[option.value],
              opacity: isSelected ? 1 : 0.92,
              boxShadow: isSelected
                ? "0 0 0 3px #ffffff, 0 0 0 6px #15121d"
                : undefined,
            }}
          >
            {option.label}
            {isSelected ? (
              <Check size={20} aria-hidden />
            ) : (
              <span className="font-mono text-xs font-semibold opacity-75">
                {option.value}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
