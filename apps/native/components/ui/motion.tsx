import { useEffect } from "react";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { View, type ViewProps } from "react-native";

interface FadeSlideInProps extends ViewProps {
  /** Stagger index — each step delays the entrance by 60ms. */
  index?: number;
}

/**
 * Design-language entrance: gentle fade + slide down, optionally staggered.
 * Wraps every screen section for consistent subtle motion.
 */
export function FadeSlideIn({ index = 0, style, ...props }: FadeSlideInProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(22).stiffness(180)}
      style={style}
      {...props}
    />
  );
}

/**
 * Horizontal bar that grows from its previous width to `pct` (0-100).
 * `radius` matches the design file per surface: the report teaser's 7px
 * bars are drawn at radius 4, everything else is fully rounded.
 */
export function AnimatedBar({
  pct,
  color,
  opacity = 1,
  height = 10,
  radius = 999,
  trackColor,
}: {
  pct: number;
  color: string;
  opacity?: number;
  height?: number;
  radius?: number;
  /** Overrides the default track for bars drawn on a tinted card. */
  trackColor?: string;
}) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(150, withSpring(pct, { damping: 20, stiffness: 90 }));
  }, [pct, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    opacity,
  }));

  return (
    <View
      className={`w-full overflow-hidden ${trackColor ? "" : "bg-nt-track"}`}
      style={{ height, borderRadius: radius, backgroundColor: trackColor }}
    >
      <Animated.View
        style={[animatedStyle, { backgroundColor: color, height: "100%", borderRadius: radius }]}
      />
    </View>
  );
}
