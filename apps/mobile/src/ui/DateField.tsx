import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn";
import { parseDateValue, serializeDateValue } from "@/shared/utils/dateValue";
import { useTheme } from "@/theme/ThemeProvider";
import { IconButton } from "@/ui/IconButton";
import { Text } from "@/ui/Text";

type DateFieldProps = {
  label: string;
  /** `yyyy-MM-dd`. */
  value: string | null;
  onChange: (value: string | null) => void;
  clearable?: boolean;
  placeholder?: string;
};

/** Opens a month grid in place, so it works inside a sheet without stacking modals. */
export function DateField({ label, value, onChange, clearable, placeholder = "Choose a date" }: DateFieldProps) {
  const { colors } = useTheme();
  const selected = parseDateValue(value);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(selected ?? new Date()));

  const days = eachDayOfInterval({ start: startOfWeek(month), end: endOfWeek(endOfMonth(month)) });
  const weekdays = Array.from({ length: 7 }, (_, index) => format(addDays(startOfWeek(month), index), "EEEEE"));

  return (
    <View className="gap-1.5">
      <Text variant="label">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected ? format(selected, "EEEE, MMMM d, yyyy") : "not set"}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((current) => !current)}
        className={cn("h-12 flex-row items-center gap-2.5 rounded-xl border bg-card px-3.5", open ? "border-ring" : "border-input")}
      >
        <CalendarDays size={18} color={colors["muted-foreground"]} />
        <Text tone={selected ? "default" : "muted"} className="flex-1">
          {selected ? format(selected, "EEE, MMM d, yyyy") : placeholder}
        </Text>
        {clearable && selected ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`Clear ${label}`} hitSlop={10} onPress={() => onChange(null)}>
            <Text variant="label" tone="muted" className="underline">
              Clear
            </Text>
          </Pressable>
        ) : null}
      </Pressable>
      {open ? (
        <View className="rounded-xl border border-border bg-card p-2">
          <View className="flex-row items-center justify-between">
            <IconButton icon={ChevronLeft} label="Previous month" onPress={() => setMonth(addMonths(month, -1))} />
            <Text variant="subheading">{format(month, "MMMM yyyy")}</Text>
            <IconButton icon={ChevronRight} label="Next month" onPress={() => setMonth(addMonths(month, 1))} />
          </View>
          <View className="flex-row">
            {weekdays.map((day, index) => (
              <Text key={index} variant="caption" tone="muted" className="flex-1 pb-1 text-center">
                {day}
              </Text>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {days.map((day) => {
              const isSelected = Boolean(selected && isSameDay(day, selected));
              return (
                <Pressable
                  key={day.toISOString()}
                  accessibilityRole="button"
                  accessibilityLabel={format(day, "EEEE, MMMM d")}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    onChange(serializeDateValue(day));
                    setOpen(false);
                  }}
                  style={{ width: `${100 / 7}%` }}
                  className="h-10 items-center justify-center"
                >
                  <View className={cn("size-9 items-center justify-center rounded-full", isSelected && "bg-primary", !isSelected && isToday(day) && "border border-chart-1")}>
                    <Text tone={isSelected ? "inverse" : isSameMonth(day, month) ? "default" : "muted"}>{format(day, "d")}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}
