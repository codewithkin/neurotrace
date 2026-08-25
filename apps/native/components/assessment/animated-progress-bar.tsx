import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function AnimatedProgressBar({ progress }: { progress: number }) {
  const sharedProgress = useSharedValue(progress);

  useEffect(() => {
    sharedProgress.value = withTiming(progress, { duration: 250 });
  }, [progress, sharedProgress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${sharedProgress.value * 100}%`,
  }));

  return (
    <View className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <Animated.View
        style={fillStyle}
        className="h-full rounded-full bg-primary"
      />
    </View>
  );
}
