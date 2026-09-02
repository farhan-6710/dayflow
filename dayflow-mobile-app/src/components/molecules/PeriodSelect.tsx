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
    <View className="overflow-hidden rounded-xl border border-border bg-gray-50 dark:border-border-dark dark:bg-card-dark">
      {options.map((period, index) => {
        const isSelected = period === value;
        return (
          <TouchableOpacity
            key={period}
            activeOpacity={0.8}
            onPress={() => void handlePress(period)}
            className={`px-4 py-3 ${
              index === 0 ? "" : "border-t border-border dark:border-border-dark"
            } ${isSelected ? "bg-primary/10" : ""}`}
          >
            <Text
              className={`text-center text-base ${
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
