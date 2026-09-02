import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import Text from "@components/atoms/Text";
import { REMINDER_QUICK_TIMES } from "@constants/timePicker";
import { parseTimeLabel } from "@utils/timePickerUtils";

type QuickTimeChipsProps = {
  hour: number;
  minute: number;
  onSelect: (hour: number, minute: number) => void;
};

export default function QuickTimeChips({
  hour,
  minute,
  onSelect,
}: QuickTimeChipsProps) {
  const handleSelect = async (label: string) => {
    const parsed = parseTimeLabel(label);
    if (!parsed || (parsed.hour === hour && parsed.minute === minute)) {
      return;
    }

    await Haptics.selectionAsync();
    onSelect(parsed.hour, parsed.minute);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
      className="mb-3"
    >
      {REMINDER_QUICK_TIMES.map((time) => {
        const parsed = parseTimeLabel(time);
        const isSelected =
          parsed?.hour === hour && parsed?.minute === minute;
        return (
          <TouchableOpacity
            key={time}
            activeOpacity={0.85}
            onPress={() => void handleSelect(time)}
            className={`rounded-full border px-3 py-2 ${
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border bg-white/90 dark:border-border-dark dark:bg-white/5"
            }`}
          >
            <Text
              className={`text-xs ${
                isSelected
                  ? "font-semibold text-primary"
                  : "font-medium text-gray-600 dark:text-gray-300"
              }`}
            >
              {time}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
