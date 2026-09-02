import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  iconSize?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
  children?: ReactNode;
}

export default function Button({
  onPress,
  title,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  iconSize,
  className = "",
  style,
  fullWidth = false,
  children,
}: ButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  // Size configurations
  const sizeClasses = {
    small: "py-2 px-4",
    medium: "py-3 px-6",
    large: "py-3.5 px-8",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const defaultIconSize = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const activityIndicatorClasses = {
    small: "w-5 h-5",
    medium: "w-6 h-6",
    large: "w-7 h-7",
  };

  // Variant configurations
  const getVariantClasses = () => {
    if (isDisabled) {
      return "bg-gray-400 dark:bg-gray-600";
    }

    switch (variant) {
      case "primary":
        return "bg-primary dark:bg-primary-dark";
      case "secondary":
        return "bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark";
      case "danger":
        return "bg-red-500 dark:bg-red-600";
      case "success":
        return "bg-emerald-500 dark:bg-emerald-600";
      case "outline":
        return "bg-transparent border-2 border-border dark:border-border-dark";
      default:
        return "bg-primary dark:bg-primary-dark";
    }
  };

  const getTextColorClass = () => {
    if (isDisabled) {
      return "text-white";
    }

    switch (variant) {
      case "primary":
      case "danger":
      case "success":
        return "text-white";
      case "secondary":
        return "text-foreground dark:text-foreground-dark";
      case "outline":
        return "text-foreground dark:text-foreground-dark";
      default:
        return "text-white";
    }
  };

  const getIconColor = () => {
    if (isDisabled) {
      return "#FFFFFF";
    }

    switch (variant) {
      case "primary":
      case "danger":
      case "success":
        return "#FFFFFF";
      case "secondary":
        return "#374151"; // gray-700
      case "outline":
        return "#1F2937"; // foreground
      default:
        return "#FFFFFF";
    }
  };

  const getShadowStyle = (): StyleProp<ViewStyle> => {
    if (isDisabled) {
      return {};
    }

    if (variant === "secondary") {
      return {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      };
    }

    if (variant === "outline") {
      return {};
    }

    const shadowColors = {
      primary: colors.primary,
      danger: colors.error,
      success: colors.success,
      secondary: "transparent",
      outline: "transparent",
    };

    return {
      shadowColor: shadowColors[variant],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${getVariantClasses()} ${
        sizeClasses[size]
      } rounded-xl items-center justify-center flex-row ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      style={[getShadowStyle(), style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          className={activityIndicatorClasses[size]}
          color={getIconColor()}
        />
      ) : (
        children ?? (
          <View className="flex-row items-center justify-center gap-2">
            {icon && iconPosition === "left" && (
              <Ionicons
                name={icon}
                size={iconSize || defaultIconSize[size]}
                color={getIconColor()}
              />
            )}
            <Text
              className={`${getTextColorClass()} ${
                textSizeClasses[size]
              } font-semibold`}
            >
              {title}
            </Text>
            {icon && iconPosition === "right" && (
              <Ionicons
                name={icon}
                size={iconSize || defaultIconSize[size]}
                color={getIconColor()}
              />
            )}
          </View>
        )
      )}
    </TouchableOpacity>
  );
}
