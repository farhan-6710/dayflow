import { useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { TASK_STATUS } from "@/features/tasks/taskMeta";
import { HOUR_HEIGHT, TIMELINE_END_HOUR, TIMELINE_SCROLL_HOUR, TIMELINE_START_HOUR, positionTasks, untimedTasks } from "@/features/tasks/timeline";
import { formatTimeLabel } from "@/shared/constants/times";
import type { Task } from "@/shared/types/types";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "@/ui/Text";

const HOURS = Array.from({ length: TIMELINE_END_HOUR - TIMELINE_START_HOUR }, (_, index) => TIMELINE_START_HOUR + index);
const GUTTER = 60;

type DayTimelineProps = {
  tasks: Task[];
  onOpen: (task: Task) => void;
  onAddAt: (time: string) => void;
};

export function DayTimeline({ tasks, onOpen, onAddAt }: DayTimelineProps) {
  const { colors } = useTheme();
  const untimed = untimedTasks(tasks);
  const scroller = useRef<ScrollView>(null);

  return (
    <View className="flex-1">
      {untimed.length > 0 ? (
        <View className="flex-row flex-wrap items-center gap-2 border-b border-border px-4 pb-2">
          <Text variant="caption" tone="muted">
            No time
          </Text>
          {untimed.map((task) => (
            <Pressable key={task.id} accessibilityRole="button" accessibilityLabel={task.title} onPress={() => onOpen(task)} className="max-w-[70%] rounded-lg bg-muted px-2.5 py-1.5">
              <Text variant="label" numberOfLines={1}>
                {task.title}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <ScrollView
        ref={scroller}
        onLayout={() => scroller.current?.scrollTo({ y: (TIMELINE_SCROLL_HOUR - TIMELINE_START_HOUR) * HOUR_HEIGHT, animated: false })}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <View style={{ height: HOURS.length * HOUR_HEIGHT }}>
          {HOURS.map((hour, index) => {
            const label = formatTimeLabel(hour, 0);
            return (
              <Pressable
                key={hour}
                accessibilityRole="button"
                accessibilityLabel={`Add a task at ${label}`}
                onPress={() => onAddAt(label)}
                style={{ top: index * HOUR_HEIGHT, height: HOUR_HEIGHT, left: 0, right: 0, position: "absolute" }}
                className="flex-row active:bg-muted"
              >
                <Text variant="caption" tone="muted" style={{ width: GUTTER }} className="pl-4 pt-1">
                  {label.replace(":00", "")}
                </Text>
                <View className="flex-1 border-t border-border" />
              </Pressable>
            );
          })}
          <View pointerEvents="box-none" style={{ position: "absolute", top: 0, bottom: 0, left: GUTTER, right: 12 }}>
            {positionTasks(tasks).map(({ task, top, height, leftPercent, widthPercent }) => {
              const accent = colors[TASK_STATUS[task.status].color];
              return (
                <Pressable
                  key={task.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${task.title}, ${task.due_time ?? ""}, ${TASK_STATUS[task.status].label}`}
                  onPress={() => onOpen(task)}
                  style={{ position: "absolute", top: top + 1, height: height - 2, left: `${leftPercent}%`, width: `${widthPercent}%`, paddingRight: 2 }}
                >
                  <View style={{ borderLeftColor: accent, backgroundColor: `${accent}26` }} className="flex-1 overflow-hidden rounded-lg border-l-[3px] px-2 py-1">
                    <Text variant="label" numberOfLines={2}>
                      {task.title}
                    </Text>
                    <Text variant="caption" tone="muted" numberOfLines={1}>
                      {task.due_time}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
