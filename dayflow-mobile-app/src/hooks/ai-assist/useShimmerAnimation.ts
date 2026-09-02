import { useEffect } from "react";
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/**
 * Custom hook for shimmer animation effect
 *
 * Creates a repeating shimmer animation that oscillates between 0 and 1
 *
 * @returns Shared value for shimmer animation (0-1)
 *
 * @example
 * const shimmer = useShimmerAnimation();
 * const shimmerStyle = useAnimatedStyle(() => ({
 *   opacity: shimmer.value * 0.3,
 * }));
 */
export const useShimmerAnimation = () => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
  }, [shimmer]);

  return shimmer;
};
