import { addDays, eachDayOfInterval, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import { Pressable, View } from "react-native";

import { TASK_STATUS } from "@/features/tasks/taskMeta";
import { cn } from "@/lib/cn";
import type { Task } from "@/shared/types/types";
import { serializeDateValue } from "@/shared/utils/dateValue";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

type MonthGridProps = {
  month: Date;
  selected: Date;
  tasksByDate: Map<string, Task[]>;
  onSelect: (date: Date) => void;
};

/** A compact month: dots show what's due, and the selected day's tasks sit below. */
export function MonthGrid({ month, selected, tasksByDate, onSelect }: MonthGridProps) {
  const { colors } = useTheme();
  const start = startOfWeek(startOfMonth(month));
  const days = eachDayOfInterval({ start, end: addDays(start, 41) });

  return (
    <View className="px-3">
      <View className="flex-row">
        {WEEKDAYS.map((day, index) => (
          <Text key={index} variant="caption" tone="muted" className="flex-1 pb-1 text-center">
            {day}
          </Text>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {days.map((day) => {
          const tasks = tasksByDate.get(serializeDateValue(day)) ?? [];
          const isSelected = isSameDay(day, selected);
          return (
            <Pressable
              key={day.toISOString()}
              accessibilityRole="button"
              accessibilityLabel={`${format(day, "EEEE, MMMM d")}, ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(day)}
              style={{ width: `${100 / 7}%` }}
              className="h-11 items-center justify-center"
            >
              <View className={cn("size-8 items-center justify-center rounded-full", isSelected && "bg-primary", !isSelected && isToday(day) && "border border-chart-1")}>
                <Text variant="label" tone={isSelected ? "inverse" : isSameMonth(day, month) ? "default" : "muted"}>
                  {format(day, "d")}
                </Text>
              </View>
              <View className="h-1.5 flex-row gap-0.5">
                {tasks.slice(0, 3).map((task) => (
                  <View key={task.id} style={{ backgroundColor: colors[TASK_STATUS[task.status].color] }} className="size-1 rounded-full" />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
