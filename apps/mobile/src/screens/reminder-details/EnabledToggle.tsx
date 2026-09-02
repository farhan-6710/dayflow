import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "@components/atoms/Text";
import ToggleButton from "@components/atoms/ToggleButton";
import { ReminderStatus } from "@types";

interface EnabledToggleProps {
  status: ReminderStatus;
  onToggle: (newStatus: ReminderStatus) => void;
}

export default function EnabledToggle({
  status,
  onToggle,
}: EnabledToggleProps) {
  const colors = useThemeColors();
  const isPaused = status === "paused";

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Ionicons name="power-outline" size={16} color={colors.gray} />
          <Text className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Reminder Enabled
          </Text>
        </View>
        <ToggleButton
          value={!isPaused}
          onToggle={() => onToggle(isPaused ? "upcoming" : "paused")}
          size="medium"
          hapticsFeedback={true}
        />
      </View>
    </View>
  );
}
