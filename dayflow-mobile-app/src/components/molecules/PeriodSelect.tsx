import React from "react";
import { TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import Text from "@components/atoms/Text";
import type { TimePeriod } from "@utils/timePickerUtils";

type PeriodSelectProps = {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
};

export default function PeriodSelect({ value, onChange }: PeriodSelectProps) {
  const options: TimePeriod[] = ["AM", "PM"];

  const handlePress = async (period: TimePeriod) => {
    if (period === value) {
      return;
    }

    await Haptics.selectionAsync();
    onChange(period);
  };

  return (
    <View className="min-h-[48px] flex-row overflow-hidden rounded-xl border border-border bg-gray-50 dark:border-border-dark dark:bg-card-dark">
      {options.map((period) => {
        const isSelected = period === value;
        return (
          <TouchableOpacity
            key={period}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => void handlePress(period)}
            className={`flex-1 items-center justify-center px-3 ${
              isSelected ? "bg-primary/10" : ""
            }`}
          >
            <Text
              className={`text-base ${
                isSelected
                  ? "font-semibold text-primary"
                  : "font-medium text-gray-500 dark:text-gray-400"
              }`}
            >
              {period}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
