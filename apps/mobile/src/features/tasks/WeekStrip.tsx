import { eachDayOfInterval, endOfWeek, format, isSameDay, isToday, startOfWeek } from "date-fns";
import { Pressable, View } from "react-native";

import { cn } from "@/lib/cn";
import type { Task } from "@/shared/types/types";
import { serializeDateValue } from "@/shared/utils/dateValue";
import { Text } from "@/ui/Text";

type WeekStripProps = {
  selected: Date;
  tasksByDate: Map<string, Task[]>;
  onSelect: (date: Date) => void;
};

export function WeekStrip({ selected, tasksByDate, onSelect }: WeekStripProps) {
  const days = eachDayOfInterval({ start: startOfWeek(selected), end: endOfWeek(selected) });

  return (
    <View className="flex-row gap-1 px-3">
      {days.map((day) => {
        const active = isSameDay(day, selected);
        const count = tasksByDate.get(serializeDateValue(day))?.length ?? 0;
        return (
          <Pressable
            key={day.toISOString()}
            accessibilityRole="button"
            accessibilityLabel={`${format(day, "EEEE, MMMM d")}, ${count} ${count === 1 ? "task" : "tasks"}`}
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(day)}
            className={cn("flex-1 items-center gap-0.5 rounded-xl py-2", active ? "bg-primary" : "bg-card", !active && isToday(day) && "border border-chart-1")}
          >
            <Text variant="caption" tone={active ? "inverse" : "muted"}>
              {format(day, "EEEEE")}
            </Text>
            <Text variant="subheading" tone={active ? "inverse" : "default"}>
              {format(day, "d")}
            </Text>
            <View className={cn("size-1 rounded-full", count > 0 ? "bg-chart-1" : "bg-transparent")} />
          </Pressable>
        );
      })}
    </View>
  );
}
