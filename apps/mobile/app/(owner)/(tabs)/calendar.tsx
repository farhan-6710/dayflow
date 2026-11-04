import { addDays, addMonths, addWeeks, eachDayOfInterval, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";

import { DayTimeline } from "@/features/tasks/DayTimeline";
import { MonthGrid } from "@/features/tasks/MonthGrid";
import { TASK_STATUS, sortByOrder } from "@/features/tasks/taskMeta";
import { TaskListCard } from "@/features/tasks/TaskListCard";
import { useTaskActions, useTasks } from "@/features/tasks/useTasks";
import { useTaskSheets } from "@/features/tasks/useTaskSheets";
import { WeekStrip } from "@/features/tasks/WeekStrip";
import { useRefresh } from "@/lib/query";
import type { Task, TaskStatus } from "@/shared/types/types";
import { serializeDateValue } from "@/shared/utils/dateValue";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { EmptyState } from "@/ui/EmptyState";
import { ErrorState } from "@/ui/ErrorState";
import { Fab } from "@/ui/Fab";
import { IconButton } from "@/ui/IconButton";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { Screen } from "@/ui/Screen";
import { SectionHeader } from "@/ui/SectionHeader";
import { SegmentedTabs } from "@/ui/SegmentedTabs";
import { Skeleton } from "@/ui/Skeleton";
import { Text } from "@/ui/Text";

type CalendarView = "month" | "week" | "day";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

export default function CalendarScreen() {
  const { colors } = useTheme();
  const tasksQuery = useTasks();
  const { saveOrder } = useTaskActions();
  const { sheets, openDetails, openEdit, openNew } = useTaskSheets();
  const refresh = useRefresh(tasksQuery);
  const [view, setView] = useState<CalendarView>("month");
  const [selected, setSelected] = useState(() => new Date());
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [reordering, setReordering] = useState(false);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of sortByOrder(tasksQuery.data ?? [])) {
      if (!task.due_date) continue;
      map.set(task.due_date, [...(map.get(task.due_date) ?? []), task]);
    }
    return map;
  }, [tasksQuery.data]);

  const selectedKey = serializeDateValue(selected);
  const dayTasks = tasksByDate.get(selectedKey) ?? [];
  const weekDays = eachDayOfInterval({ start: startOfWeek(selected), end: endOfWeek(selected) });
  const today = new Date();

  function page(direction: -1 | 1) {
    if (view === "month") setMonth(addMonths(month, direction));
    else if (view === "week") setSelected(addWeeks(selected, direction));
    else setSelected(addDays(selected, direction));
  }

  function select(date: Date) {
    setSelected(date);
    setMonth(startOfMonth(date));
    setReordering(false);
  }

  function goToday() {
    setSelected(today);
    setMonth(startOfMonth(today));
  }

  function move(task: Task, direction: -1 | 1) {
    const ids = dayTasks.map((item) => item.id);
    const from = ids.indexOf(task.id);
    const to = from + direction;
    const moved = ids[to];
    if (to < 0 || moved === undefined) return;
    ids[to] = task.id;
    ids[from] = moved;
    saveOrder(ids);
  }

  const title =
    view === "month"
      ? format(month, "MMMM yyyy")
      : view === "week"
        ? `${format(weekDays[0] ?? selected, "MMM d")} – ${format(weekDays[6] ?? selected, "MMM d")}`
        : format(selected, "EEE, MMM d");

  const dayList = (
    <View className="gap-2 px-4 pt-4">
      <SectionHeader
        title={isSameDay(selected, today) ? "Today" : format(selected, "EEEE, MMM d")}
        actionLabel={dayTasks.length > 1 ? (reordering ? "Done" : "Reorder") : undefined}
        onAction={() => setReordering(!reordering)}
      />
      {dayTasks.length > 0 ? (
        <TaskListCard tasks={dayTasks} onOpen={openDetails} onEdit={openEdit} onMove={reordering ? move : undefined} />
      ) : (
        <EmptyState art="tasks" title="Nothing due" description="Add a task for this day." actionLabel="Add task" onAction={() => openNew(selectedKey)} />
      )}
    </View>
  );

  let body;
  if (tasksQuery.isError && !tasksQuery.data) {
    body = <ErrorState onRetry={() => void tasksQuery.refetch()} />;
  } else if (!tasksQuery.data) {
    body = (
      <View className="gap-3 px-4">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <ListSkeleton rows={2} />
      </View>
    );
  } else if (view === "day") {
    body = (
      <>
        <WeekStrip selected={selected} tasksByDate={tasksByDate} onSelect={select} />
        <View className="mt-3 flex-1">
          <DayTimeline tasks={dayTasks} onOpen={openDetails} onAddAt={(time) => openNew(selectedKey, time)} />
        </View>
      </>
    );
  } else {
    body = (
      <ScrollView
        refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        {view === "month" ? (
          <>
            <MonthGrid month={month} selected={selected} tasksByDate={tasksByDate} onSelect={select} />
            <View className="flex-row flex-wrap justify-center gap-x-4 gap-y-1 px-4 pt-2">
              {(Object.keys(TASK_STATUS) as TaskStatus[]).map((status) => (
                <View key={status} className="flex-row items-center gap-1.5">
                  <View style={{ backgroundColor: colors[TASK_STATUS[status].color] }} className="size-2 rounded-full" />
                  <Text variant="caption" tone="muted">
                    {TASK_STATUS[status].label}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <WeekStrip selected={selected} tasksByDate={tasksByDate} onSelect={select} />
        )}
        {dayList}
      </ScrollView>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center gap-1 px-2 pb-2 pt-2">
        <IconButton icon={ChevronLeft} label="Previous" onPress={() => page(-1)} />
        <Pressable accessibilityRole="header" className="flex-1 items-center">
          <Text variant="heading" numberOfLines={1}>
            {title}
          </Text>
        </Pressable>
        <IconButton icon={ChevronRight} label="Next" onPress={() => page(1)} />
        <Button label="Today" size="sm" variant="outline" onPress={goToday} />
      </View>
      <View className="px-4 pb-3">
        <SegmentedTabs tabs={VIEWS} value={view} onChange={setView} />
      </View>
      {body}
      <Fab label="New task" onPress={() => openNew(selectedKey)} />
      {sheets}
    </Screen>
  );
}
