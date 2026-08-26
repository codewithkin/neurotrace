import { useRef, useState } from "react";
import { PanResponder, View } from "react-native";

import { useNTColors } from "@/lib/theme";

/*
 * The check-in slider from "Light/Dark 12 Daily check-in": a 6px track at
 * 3px radius, a violet fill, and a 20px thumb on the ground colour with a
 * 2px violet ring.
 *
 * Hand-rolled on PanResponder rather than heroui's Slider because the
 * design's geometry has to be exact and library internals are not
 * reachable through class names — an unknown class here would fail
 * silently rather than loudly.
 */
export function MetricSlider({
  value,
  onChange,
  onCommit,
  min = 0,
  max = 10,
}: {
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
  min?: number;
  max?: number;
}) {
  const nt = useNTColors();
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => emit(e.nativeEvent.locationX),
      onPanResponderMove: (e, gesture) => emit(gesture.moveX - originRef.current),
      onPanResponderRelease: () => onCommitRef.current?.(),
    }),
  ).current;

  // Keep the responder's closures pointing at the latest props.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;
  const originRef = useRef(0);

  function emit(x: number) {
    const w = widthRef.current;
    if (w <= 0) return;
    const ratio = Math.min(1, Math.max(0, x / w));
    onChangeRef.current(Math.round(min + ratio * (max - min)));
  }

  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      className="mt-[11px] justify-center"
      style={{ height: 20 }}
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
        setWidth(e.nativeEvent.layout.width);
      }}
      // Measure the page-x origin so drags outside the track still track.
      onTouchStart={(e) => {
        originRef.current = e.nativeEvent.pageX - e.nativeEvent.locationX;
      }}
      {...responder.panHandlers}
    >
      <View
        style={{ height: 6, borderRadius: 3, backgroundColor: nt.track, overflow: "hidden" }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 3,
            backgroundColor: nt.pri,
          }}
        />
      </View>
      {width > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: (pct / 100) * width - 10,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: nt.bg,
            borderWidth: 2,
            borderColor: nt.pri,
          }}
        />
      )}
    </View>
  );
}
