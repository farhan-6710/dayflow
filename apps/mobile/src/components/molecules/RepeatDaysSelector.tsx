import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@constants/theme";
import { DAYS_OF_WEEK } from "@constants/reminders";
import Text from "../atoms/Text";
import { DayOfWeek } from "@types";

interface RepeatDaysSelectorProps {
  selectedDays: DayOfWeek[];
  onDayToggle: (day: DayOfWeek) => void;
}

export default function RepeatDaysSelector({
  selectedDays,
  onDayToggle,
}: RepeatDaysSelectorProps) {
  const colors = useThemeColors();

  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="repeat-outline" size={16} color={colors.gray} />
        <Text className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Repeat Days
        </Text>
      </View>
      <View className="flex-row gap-2 flex-wrap">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDays?.includes(day);
          return (
            <TouchableOpacity
              key={day}
              onPress={() => onDayToggle(day)}
              activeOpacity={0.7}
              style={{
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.backgroundTwo,
                borderColor: isSelected ? colors.primary : colors.border,
              }}
              className={`w-10 h-10 rounded-full items-center justify-center border ${
                !isSelected
                  ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  : ""
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? "text-white" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {day.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
