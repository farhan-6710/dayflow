/**
 * @deprecated Use TimePickerField instead.
 * Kept as a thin adapter for any legacy imports.
 */
import React from "react";
import TimePickerField from "./TimePickerField";

interface TimeInputFieldsProps {
  hour: string | number;
  minute: string | number;
  onTimeChange: (type: "hour" | "minute", value: string) => void;
  onTimeBlur?: (type: "hour" | "minute") => void;
}

export default function TimeInputFields({
  hour,
  minute,
  onTimeChange,
}: TimeInputFieldsProps) {
  const hourNum =
    typeof hour === "number" ? hour : Number.parseInt(hour, 10) || 0;
  const minuteNum =
    typeof minute === "number" ? minute : Number.parseInt(minute, 10) || 0;

  return (
    <TimePickerField
      hour={hourNum}
      minute={minuteNum}
      onChange={(nextHour, nextMinute) => {
        onTimeChange("hour", nextHour.toString());
        onTimeChange("minute", nextMinute.toString());
      }}
    />
  );
}
