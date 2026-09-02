import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SelectField from "@components/molecules/SelectField";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";
import { HOUR_12_OPTIONS, MINUTE_OPTIONS } from "@constants/timePicker";
import {
  formatTimeLabel,
  to12HourParts,
  to24Hour,
  type TimePeriod,
} from "@utils/timePickerUtils";

type TimePickerFieldProps = {
  hour: string | number;
  minute: string | number;
  onChange: (hour: number, minute: number) => void;
};

const PERIOD_OPTIONS: TimePeriod[] = ["AM", "PM"];

function parseNumeric(value: string | number, fallback: number) {
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function TimePickerField({
  hour,
  minute,
  onChange,
}: TimePickerFieldProps) {
  const colors = useThemeColors();
  const hour24 = parseNumeric(hour, 9);
  const minuteValue = parseNumeric(minute, 0);
  const parts = useMemo(
    () => to12HourParts(hour24, minuteValue),
    [hour24, minuteValue],
  );
  const selectedLabel = formatTimeLabel(hour24, minuteValue);
  const minuteLabel = String(parts.minute).padStart(2, "0");

  const emitChange = useCallback(
    (nextHour12: number, nextMinute: number, nextPeriod: TimePeriod) => {
      const { hour: nextHour24, minute: nextMinuteValue } = to24Hour(
        nextHour12,
        nextMinute,
        nextPeriod,
      );
      onChange(nextHour24, nextMinuteValue);
    },
    [onChange],
  );

  return (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color={colors.gray} />
          <Text className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Time
          </Text>
        </View>
        <Text className="text-sm font-semibold text-primary">{selectedLabel}</Text>
      </View>

      <View className="flex-row items-end gap-2">
        <SelectField
          label="Hour"
          value={String(parts.hour12)}
          options={HOUR_12_OPTIONS}
          onChange={(nextHour) =>
            emitChange(Number.parseInt(nextHour, 10), parts.minute, parts.period)
          }
          accessibilityLabel="Hour"
        />
        <SelectField
          label="Minute"
          value={minuteLabel}
          options={MINUTE_OPTIONS}
          onChange={(nextMinute) =>
            emitChange(parts.hour12, Number.parseInt(nextMinute, 10), parts.period)
          }
          accessibilityLabel="Minute"
        />
        <SelectField
          label="AM/PM"
          value={parts.period}
          options={PERIOD_OPTIONS}
          onChange={(period) =>
            emitChange(parts.hour12, parts.minute, period as TimePeriod)
          }
          accessibilityLabel="AM or PM"
        />
      </View>
    </View>
  );
}
