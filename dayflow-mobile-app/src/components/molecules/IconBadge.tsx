import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconBadgeProps } from "@types";

export const IconBadge: React.FC<IconBadgeProps> = ({
  iconName,
  size = 16,
  color,
  variant = "slate",
  className = "",
}) => {
  const variantClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    slate:
      "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600",
    green:
      "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
    amber:
      "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
    red: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800",
  };

  return (
    <View
      className={`w-8 h-8 rounded-lg border justify-center items-center ${variantClasses[variant]} ${className}`}
    >
      <Ionicons name={iconName} size={size} color={color} />
    </View>
  );
};
