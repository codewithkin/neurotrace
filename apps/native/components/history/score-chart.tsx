import React from "react";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";

import { MONO_FONT } from "@/lib/theme";

export interface ChartSeries {
  color: string;
  /** Percentages, 0-100 — the design's axis is a percentage scale. */
  values: number[];
}

/*
 * Trend chart from designs "Light/Dark 14 History tab". The geometry is
 * the design's own 320x172 viewBox: dashed gridlines at y 16/60/104/148
 * for 100/66/33/0, series plotted between x 46 and 306, 2.5px round-joined
 * polylines and r-3.5 dots, month labels on the 168 baseline.
 */
const VIEW_W = 320;
const VIEW_H = 172;
const X_FIRST = 46;
const X_LAST = 306;
const Y_TOP = 16;
const Y_BOTTOM = 148;

const GRID = [
  { value: 100, y: 16, labelX: 0, labelY: 20 },
  { value: 66, y: 60, labelX: 6, labelY: 64 },
  { value: 33, y: 104, labelX: 6, labelY: 108 },
  { value: 0, y: 148, labelX: 12, labelY: 152 },
];

export function ScoreChart({
  series,
  labels,
  borderColor,
  mutedColor,
}: {
  series: ChartSeries[];
  /** One short month label per point. */
  labels: string[];
  borderColor: string;
  mutedColor: string;
}) {
  const count = Math.max(...series.map((s) => s.values.length), 1);

  const xFor = (i: number) =>
    count === 1 ? (X_FIRST + X_LAST) / 2 : X_FIRST + (i / (count - 1)) * (X_LAST - X_FIRST);
  const yFor = (pct: number) =>
    Y_BOTTOM - (Math.min(100, Math.max(0, pct)) / 100) * (Y_BOTTOM - Y_TOP);

  return (
    <Svg width="100%" height={undefined} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ aspectRatio: VIEW_W / VIEW_H }}>
      {GRID.map((line) => (
        <React.Fragment key={line.value}>
          <Line
            x1={30}
            x2={316}
            y1={line.y}
            y2={line.y}
            stroke={borderColor}
            strokeWidth={1}
            strokeDasharray="3 5"
          />
          <SvgText
            x={line.labelX}
            y={line.labelY}
            fill={mutedColor}
            fontSize={9}
            fontFamily={MONO_FONT}
          >
            {line.value}
          </SvgText>
        </React.Fragment>
      ))}

      {series.map((s, si) => (
        <React.Fragment key={si}>
          {s.values.length > 1 && (
            <Polyline
              points={s.values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
          {s.values.map((v, i) => (
            <Circle key={`${si}-${i}`} cx={xFor(i)} cy={yFor(v)} r={3.5} fill={s.color} />
          ))}
        </React.Fragment>
      ))}

      {labels.map((label, i) => (
        <SvgText
          key={`l-${i}`}
          x={xFor(i)}
          y={168}
          textAnchor="middle"
          fill={mutedColor}
          fontSize={9}
          fontFamily={MONO_FONT}
        >
          {label}
        </SvgText>
      ))}
    </Svg>
  );
}
