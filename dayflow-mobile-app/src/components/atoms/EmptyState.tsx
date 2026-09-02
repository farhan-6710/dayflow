import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "./Text";

interface EmptyStateProps {
  icon?: string;
  title?: string;
  subtitle?: string;
}

export default function EmptyState({
  icon = "calendar-outline",
  title = "No reminder selected",
  subtitle = "Tap on a reminder to view and edit details",
}: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View className="flex-1 justify-center items-center p-6">
      <Ionicons name={icon as any} size={64} color={colors.gray} />
      <Text className="text-foreground dark:text-foreground-dark text-lg mt-4">
        {title}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
        {subtitle}
      </Text>
    </View>
  );
}
