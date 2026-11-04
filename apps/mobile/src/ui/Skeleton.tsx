import { useEffect, useRef } from "react";
import { Animated, Platform, type ViewProps } from "react-native";

import { cn } from "@/lib/cn";

/** A pulsing block. Screens compose these into the shape of their real layout. */
export function Skeleton({ className, ...props }: ViewProps) {
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== "web";
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver }),
        Animated.timing(opacity, { toValue: 0.55, duration: 750, useNativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={{ opacity }} className={cn("rounded-lg bg-muted", className)} {...props} />;
}
