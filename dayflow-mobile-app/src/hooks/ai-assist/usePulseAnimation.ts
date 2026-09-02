import { useEffect } from "react";
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { AIStatus } from "@utils/ai-assist";

/**
 * Custom hook for AI status pulse animation
 *
 * Creates pulsing scale and opacity animations based on AI status
 *
 * @param status - Current AI status (active, idle, thinking)
 * @returns Object with scale and opacity shared values
 *
 * @example
 * const { scale, opacity } = usePulseAnimation("active");
 * const pulseStyle = useAnimatedStyle(() => ({
 *   transform: [{ scale: scale.value }],
 *   opacity: opacity.value,
 * }));
 */
export const usePulseAnimation = (status: AIStatus) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    if (status === "active" || status === "thinking") {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1500 }),
          withTiming(0.8, { duration: 1500 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 500 });
      opacity.value = withTiming(0.6, { duration: 500 });
    }
  }, [status, scale, opacity]);

  return { scale, opacity };
};
