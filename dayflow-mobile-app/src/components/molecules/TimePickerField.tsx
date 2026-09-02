import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PickerWheelColumn from "@components/atoms/PickerWheelColumn";
import PeriodSelect from "@components/molecules/PeriodSelect";
import QuickTimeChips from "@components/molecules/QuickTimeChips";
import Text from "@components/atoms/Text";
import { useThemeColors } from "@constants/theme";
import {
  HOUR_12_OPTIONS,
  MINUTE_OPTIONS,
} from "@constants/timePicker";
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
  showQuickTimes?: boolean;
};

function parseNumeric(value: string | number, fallback: number) {
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function TimePickerField({
  hour,
  minute,
  onChange,
  showQuickTimes = true,
}: TimePickerFieldProps) {
  const colors = useThemeColors();
  const hour24 = parseNumeric(hour, 9);
  const minuteValue = parseNumeric(minute, 0);
  const parts = useMemo(
    () => to12HourParts(hour24, minuteValue),
    [hour24, minuteValue],
  );
  const selectedLabel = formatTimeLabel(hour24, minuteValue);

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

  const handleHourChange = (index: number) => {
    emitChange(index + 1, parts.minute, parts.period);
  };

  const handleMinuteChange = (index: number) => {
    emitChange(parts.hour12, index, parts.period);
  };

  const handlePeriodChange = (period: TimePeriod) => {
    emitChange(parts.hour12, parts.minute, period);
  };

  const handleQuickSelect = (nextHour: number, nextMinute: number) => {
    onChange(nextHour, nextMinute);
  };

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

      {showQuickTimes ? (
        <QuickTimeChips
          hour={hour24}
          minute={minuteValue}
          onSelect={handleQuickSelect}
        />
      ) : null}

      <View className="flex-row items-center justify-center rounded-2xl border border-border bg-gray-50 px-2 py-3 dark:border-border-dark dark:bg-card-dark">
        <PickerWheelColumn
          items={HOUR_12_OPTIONS}
          selectedIndex={parts.hour12 - 1}
          onIndexChange={handleHourChange}
          width={64}
        />
        <Text className="mx-1 text-xl font-semibold text-gray-400">:</Text>
        <PickerWheelColumn
          items={MINUTE_OPTIONS}
          selectedIndex={parts.minute}
          onIndexChange={handleMinuteChange}
          width={64}
        />
        <View className="ml-3">
          <PeriodSelect value={parts.period} onChange={handlePeriodChange} />
        </View>
      </View>
    </View>
  );
}
