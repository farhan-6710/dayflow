import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

interface BlobProps {
  colorOne: string;
  colorTwo: string;
  positionX: number;
  positionY: number;
  size: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function BlobComponent({
  colorOne,
  colorTwo,
  positionX,
  positionY,
  size,
}: BlobProps) {
  // Animation values for morphing effect
  const morphAnim = useRef(new Animated.Value(0)).current;
  const morph2Anim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Main morph animation with unpredictable speed variations
    Animated.loop(
      Animated.sequence([
        Animated.timing(morphAnim, {
          toValue: 0.25,
          duration: 1500, // Fast
          useNativeDriver: true,
        }),
        Animated.timing(morphAnim, {
          toValue: 0.5,
          duration: 2800, // Slow
          useNativeDriver: true,
        }),
        Animated.timing(morphAnim, {
          toValue: 0.75,
          duration: 1200, // Fast
          useNativeDriver: true,
        }),
        Animated.timing(morphAnim, {
          toValue: 1,
          duration: 2500, // Slow
          useNativeDriver: true,
        }),
        Animated.timing(morphAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Secondary morph animation with different unpredictable speeds (reverse)
    Animated.loop(
      Animated.sequence([
        Animated.timing(morph2Anim, {
          toValue: 0.25,
          duration: 2200, // Slow
          useNativeDriver: true,
        }),
        Animated.timing(morph2Anim, {
          toValue: 0.5,
          duration: 1600, // Fast
          useNativeDriver: true,
        }),
        Animated.timing(morph2Anim, {
          toValue: 0.75,
          duration: 3000, // Very slow
          useNativeDriver: true,
        }),
        Animated.timing(morph2Anim, {
          toValue: 1,
          duration: 1400, // Fast
          useNativeDriver: true,
        }),
        Animated.timing(morph2Anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for base blur layer (continuous)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [morphAnim, morph2Anim, pulseAnim]);

  // Interpolate rotation for main blob (0° → 90° → 180° → 270° → 360°)
  const rotation = morphAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ["0deg", "90deg", "180deg", "270deg", "360deg"],
  });

  // Interpolate scale for main blob
  const scale = morphAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 1.1, 0.95, 1.05, 1],
  });

  // Interpolate rotation for secondary blob (reverse)
  const rotation2 = morph2Anim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ["0deg", "-90deg", "-180deg", "-270deg", "-360deg"],
  });

  // Interpolate scale for secondary blob
  const scale2 = morph2Anim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 1.1, 0.95, 1.05, 1],
  });

  const viewBoxSize = 200;
  const center = viewBoxSize / 2;

  // Blob shape paths using cubic bezier curves to simulate border-radius percentages
  // Shape 1: 30% 70% 70% 30% / 30% 30% 70% 70%
  const blobPath1 = `
    M ${center * 0.3}, ${center * 0.3}
    C ${center * 0.7}, ${center * 0.1}, ${center * 1.3}, ${center * 0.3}, ${
    center * 1.7
  }, ${center * 0.7}
    C ${center * 1.9}, ${center * 1.3}, ${center * 1.7}, ${center * 1.7}, ${
    center * 1.3
  }, ${center * 1.7}
    C ${center * 0.7}, ${center * 1.9}, ${center * 0.3}, ${center * 1.7}, ${
    center * 0.3
  }, ${center * 1.3}
    C ${center * 0.1}, ${center * 0.7}, ${center * 0.1}, ${center * 0.7}, ${
    center * 0.3
  }, ${center * 0.3}
    Z
  `;

  // Shape 2: 60% 40% 30% 70% / 60% 30% 70% 40%
  const blobPath2 = `
    M ${center * 0.4}, ${center * 0.4}
    C ${center * 1.0}, ${center * 0.2}, ${center * 1.4}, ${center * 0.4}, ${
    center * 1.6
  }, ${center * 0.7}
    C ${center * 1.8}, ${center * 1.1}, ${center * 1.6}, ${center * 1.6}, ${
    center * 1.3
  }, ${center * 1.7}
    C ${center * 0.9}, ${center * 1.8}, ${center * 0.4}, ${center * 1.7}, ${
    center * 0.3
  }, ${center * 1.3}
    C ${center * 0.2}, ${center * 0.9}, ${center * 0.2}, ${center * 0.6}, ${
    center * 0.4
  }, ${center * 0.4}
    Z
  `;

  return (
    <Animated.View
      style={[
        styles.blobContainer,
        {
          width: size,
          height: size,
          left: positionX,
          top: positionY,
          opacity: 1,
        },
      ]}
    >
      {/* Base pulsing circular blur */}
      <Animated.View
        style={[
          styles.baseBlur,
          {
            transform: [{ scale: pulseAnim }],
            opacity: 0.7,
          },
        ]}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        >
          <Defs>
            <SvgLinearGradient id="baseGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={colorOne} stopOpacity="1" />
              <Stop offset="0.5" stopColor={colorTwo} stopOpacity="1" />
              <Stop offset="1" stopColor={colorOne} stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Path
            d={`M 0,${center} C 0,${center * 0.4} ${
              center * 0.4
            },0 ${center},0 C ${center * 1.6},0 ${viewBoxSize},${
              center * 0.4
            } ${viewBoxSize},${center} C ${viewBoxSize},${center * 1.6} ${
              center * 1.6
            },${viewBoxSize} ${center},${viewBoxSize} C ${
              center * 0.4
            },${viewBoxSize} 0,${center * 1.6} 0,${center} Z`}
            fill="url(#baseGradient)"
          />
        </Svg>
      </Animated.View>

      {/* Primary morphing blob */}
      <Animated.View
        style={[
          styles.morphBlob,
          {
            transform: [{ rotate: rotation }, { scale }],
            opacity: 0.8,
          },
        ]}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        >
          <Defs>
            <SvgLinearGradient id="morph1Gradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colorOne} stopOpacity="1" />
              <Stop offset="0.5" stopColor={colorTwo} stopOpacity="1" />
              <Stop offset="1" stopColor={colorOne} stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Path d={blobPath1} fill="url(#morph1Gradient)" />
        </Svg>
      </Animated.View>

      {/* Secondary morphing blob (reverse) */}
      <Animated.View
        style={[
          styles.morphBlob,
          {
            transform: [{ rotate: rotation2 }, { scale: scale2 }],
            opacity: 0.6,
          },
        ]}
      >
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        >
          <Defs>
            <SvgLinearGradient id="morph2Gradient" x1="1" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colorTwo} stopOpacity="1" />
              <Stop offset="0.5" stopColor={colorOne} stopOpacity="1" />
              <Stop offset="1" stopColor={colorTwo} stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <Path d={blobPath2} fill="url(#morph2Gradient)" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  blobContainer: {
    position: "absolute",
  },
  baseBlur: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  morphBlob: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
