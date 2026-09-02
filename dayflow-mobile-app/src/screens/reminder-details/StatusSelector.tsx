import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import Text from "@components/atoms/Text";
import { ReminderStatus } from "@types";

interface StatusSelectorProps {
  currentStatus: ReminderStatus;
  onStatusChange: (status: ReminderStatus) => void;
}

export default function StatusSelector({
  currentStatus,
  onStatusChange,
}: StatusSelectorProps) {
  const colors = useThemeColors();

  // Only allow toggling between done and missed for completed reminders
  const completedStatuses: ReminderStatus[] = ["done", "missed"];

  // Helper to get status display info
  const getStatusInfo = (status: ReminderStatus) => {
    switch (status) {
      case "done":
        return {
          selectedBg: "bg-emerald-100 dark:bg-emerald-900/30",
          selectedBorder: "border-emerald-600",
          selectedText: "text-emerald-600",
          unselectedBg: "bg-gray-100 dark:bg-gray-800",
          unselectedBorder: "border-gray-300 dark:border-gray-700",
          unselectedText: "text-gray-700 dark:text-gray-300",
          label: "Done",
        };
      case "missed":
        return {
          selectedBg: "bg-red-100 dark:bg-red-900/30",
          selectedBorder: "border-red-600",
          selectedText: "text-red-600",
          unselectedBg: "bg-gray-100 dark:bg-gray-800",
          unselectedBorder: "border-gray-300 dark:border-gray-700",
          unselectedText: "text-gray-700 dark:text-gray-300",
          label: "Missed",
        };
      default:
        return {
          selectedBg: "bg-gray-900/30",
          selectedBorder: "border-gray-600",
          selectedText: "text-gray-600",
          unselectedBg: "bg-gray-100 dark:bg-gray-800",
          unselectedBorder: "border-gray-300 dark:border-gray-700",
          unselectedText: "text-gray-700 dark:text-gray-300",
          label: status,
        };
    }
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="flag-outline" size={16} color={colors.gray} />
        <Text className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Status
        </Text>
      </View>
      <View className="flex-row gap-2 flex-wrap">
        {completedStatuses.map((status) => {
          const statusInfo = getStatusInfo(status);
          const isSelected = currentStatus === status;

          return (
            <TouchableOpacity
              key={status}
              onPress={() => onStatusChange(status)}
              className={`px-4 py-3 rounded-full border-2 ${
                isSelected
                  ? `${statusInfo.selectedBg} ${statusInfo.selectedBorder}`
                  : `${statusInfo.unselectedBg} ${statusInfo.unselectedBorder}`
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isSelected
                    ? statusInfo.selectedText
                    : statusInfo.unselectedText
                }`}
              >
                {statusInfo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
