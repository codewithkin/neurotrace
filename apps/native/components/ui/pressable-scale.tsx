import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { type PropsWithChildren } from "react";

/**
 * Subtle press feedback: scales down to 0.97 and back, per the design
 * language's tactile pill/card interactions.
 *
 * `contentStyle` lands on the inner animated view. Use it for values the
 * class layer cannot express exactly (1.5px selected borders, 17px CTA
 * padding) rather than inventing arbitrary classes, which fail silently.
 */
export function PressableScale({
  children,
  className,
  contentStyle,
  ...props
}: PropsWithChildren<
  PressableProps & { className?: string; contentStyle?: StyleProp<ViewStyle> }
>) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={(e) => {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 18, stiffness: 280 });
        props.onPressOut?.(e);
      }}
      {...props}
    >
      <Animated.View style={[animatedStyle, contentStyle]} className={className}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
