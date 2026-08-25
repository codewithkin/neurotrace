import React from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";

export interface ChartSeries {
  color: string;
  /** Values normalized to the same scale (e.g. raw subscale scores). */
  values: number[];
}

/**
 * Minimal dependency-free SVG line chart for score trends.
 */
export function ScoreChart({
  series,
  maxValue,
  labels,
  width = 320,
  height = 160,
}: {
  series: ChartSeries[];
  maxValue: number;
  labels?: string[];
  width?: number;
  height?: number;
}) {
  const padLeft = 28;
  const padBottom = 22;
  const padTop = 10;
  const padRight = 10;

  const count = Math.max(...series.map((s) => s.values.length), 1);
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const xFor = (i: number) =>
    padLeft + (count === 1 ? innerW / 2 : (i / (count - 1)) * innerW);
  const yFor = (v: number) =>
    padTop + innerH - (Math.min(v, maxValue) / maxValue) * innerH;

  const gridValues = [0, maxValue / 2, maxValue];

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {gridValues.map((gv) => (
          <React.Fragment key={gv}>
            <Line
              x1={padLeft}
              x2={width - padRight}
              y1={yFor(gv)}
              y2={yFor(gv)}
              stroke="#8884"
              strokeWidth={0.5}
            />
            <SvgText x={2} y={yFor(gv) + 3} fontSize={8} fill="#888">
              {Math.round(gv)}
            </SvgText>
          </React.Fragment>
        ))}

        {series.map((s, si) => {
          const points = s.values
            .map((v, i) => `${xFor(i)},${yFor(v)}`)
            .join(" ");
          return (
            <React.Fragment key={si}>
              <Polyline
                points={points}
                fill="none"
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.values.map((v, i) => (
                <Circle
                  key={`${si}-${i}`}
                  cx={xFor(i)}
                  cy={yFor(v)}
                  r={3}
                  fill={s.color}
                />
              ))}
            </React.Fragment>
          );
        })}

        {labels?.map((label, i) =>
          label ? (
            <SvgText
              key={`l-${i}`}
              x={xFor(i)}
              y={height - 6}
              fontSize={7.5}
              fill="#888"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          ) : null,
        )}
      </Svg>
    </View>
  );
}
