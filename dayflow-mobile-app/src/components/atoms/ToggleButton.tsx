import React, { useState, useEffect } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
import { useThemeColors } from "@constants/theme";
import * as Haptics from "expo-haptics";

interface ToggleButtonProps {
  value?: boolean; // Controlled mode
  initialValue?: boolean; // Uncontrolled mode
  onToggle?: (value: boolean) => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  hapticsFeedback?: boolean;
}

export default function ToggleButton({
  value,
  initialValue = true,
  onToggle,
  size = "medium",
  disabled = false,
  hapticsFeedback = false,
}: ToggleButtonProps) {
  const colors = useThemeColors();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(initialValue);
  const currentValue = isControlled ? value : internalValue;

  const [animatedValue] = useState(new Animated.Value(currentValue ? 1 : 0));

  // Sync animation with controlled value changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: currentValue ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [currentValue]);

  const sizeConfig = {
    small: { width: 40, height: 24, thumbSize: 16, padding: 4 },
    medium: { width: 50, height: 28, thumbSize: 20, padding: 4 },
    large: { width: 60, height: 32, thumbSize: 24, padding: 4 },
  };

  const config = sizeConfig[size];

  const toggleSwitch = async () => {
    if (disabled) return;
    if (hapticsFeedback) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newValue = !currentValue;

    if (!isControlled) {
      setInternalValue(newValue);
    }

    onToggle?.(newValue);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.width - config.thumbSize - config.padding * 2],
  });

  const backgroundColor = currentValue ? colors.primary : colors.border;

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      disabled={disabled}
      activeOpacity={0.8}
      className={`
        rounded-full justify-center
        ${disabled ? "opacity-50" : ""}
      `}
      style={{
        width: config.width,
        height: config.height,
        backgroundColor,
        padding: config.padding,
      }}
    >
      <Animated.View
        className="rounded-full bg-white shadow-md"
        style={{
          width: config.thumbSize,
          height: config.thumbSize,
          transform: [{ translateX }],
        }}
      />
    </TouchableOpacity>
  );
}
