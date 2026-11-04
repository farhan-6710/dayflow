import { useQuery } from "@tanstack/react-query";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { useRouter } from "expo-router";
import { Bell, CalendarClock, CircleCheck, Hourglass, Layers } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { useAuth, useUserId } from "@/features/auth/AuthProvider";
import { sortByOrder } from "@/features/tasks/taskMeta";
import { TaskListCard } from "@/features/tasks/TaskListCard";
import { useTasks } from "@/features/tasks/useTasks";
import { useTaskSheets } from "@/features/tasks/useTaskSheets";
import { CompletionChart } from "@/features/today/CompletionChart";
import { computeTaskStats, computeWeeklyInsights, isInRange, lastDaysSeries, seriesDelta } from "@/features/today/dashboardData";
import { SummaryCard } from "@/features/today/SummaryCard";
import { TimeTrackerCard } from "@/features/today/TimeTrackerCard";
import { TodoCard } from "@/features/today/TodoCard";
import { useRefresh } from "@/lib/query";
import { fetchOpenActivityCounts } from "@/services/clientActivitiesService";
import { countUnreadNotifications } from "@/services/notificationsService";
import { fetchProjects } from "@/services/projectsService";
import { DATE_FILTER_PERIODS, dateFilterLabel, resolveDateRange, type DateFilterState } from "@/shared/utils/dateFilters";
import { parseDateValue, serializeDateValue } from "@/shared/utils/dateValue";
import { getGreeting } from "@/shared/utils/greeting";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "@/ui/Button";
import { Chip } from "@/ui/Chip";
import { DateField } from "@/ui/DateField";
import { ErrorState } from "@/ui/ErrorState";
import { Fab } from "@/ui/Fab";
import { IconButton } from "@/ui/IconButton";
import { ListSkeleton } from "@/ui/ListSkeleton";
import { Screen, TabHeader } from "@/ui/Screen";
import { SectionHeader } from "@/ui/SectionHeader";
import { Sheet } from "@/ui/Sheet";
import { Skeleton } from "@/ui/Skeleton";
import { StatTile } from "@/ui/StatTile";
import { EmptyState } from "@/ui/EmptyState";
import { Text } from "@/ui/Text";

const SERIES_DAYS = 14;

function trend(series: number[], upIsGood: boolean) {
  const delta = seriesDelta(series);
  return { label: `${delta > 0 ? "+" : ""}${delta} vs last week`, good: delta === 0 || delta > 0 === upIsGood };
}

export default function TodayScreen() {
  const router = useRouter();
  const userId = useUserId();
  const { firstName } = useAuth();
  const { colors } = useTheme();
  const tasksQuery = useTasks();
  const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: () => fetchProjects(userId) });
  const activityQuery = useQuery({ queryKey: ["activity-counts"], queryFn: fetchOpenActivityCounts });
  const unreadQuery = useQuery({ queryKey: ["notifications"], queryFn: () => countUnreadNotifications(userId), select: (count) => count });
  const refresh = useRefresh(tasksQuery, projectsQuery, activityQuery, unreadQuery);
  const { sheets, openDetails, openEdit, openNew } = useTaskSheets();
  const [filter, setFilter] = useState<DateFilterState>({ mode: "all" });
  const [rangeOpen, setRangeOpen] = useState(false);
  const [rangeFrom, setRangeFrom] = useState<string | null>(null);
  const [rangeTo, setRangeTo] = useState<string | null>(null);

  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);
  const projects = useMemo(() => projectsQuery.data ?? [], [projectsQuery.data]);
  const range = resolveDateRange(filter);
  const filteredTasks = tasks.filter((task) => isInRange(task.created_at, range));
  const filteredProjects = projects.filter((project) => isInRange(project.created_at, range));
  const stats = computeTaskStats(filteredTasks);
  const insights = useMemo(() => computeWeeklyInsights(tasks), [tasks]);
  const todayKey = serializeDateValue(new Date());

  const series = useMemo(() => {
    const isOpen = (status: string) => status === "todo" || status === "in_progress";
    return {
      pending: lastDaysSeries(tasks, SERIES_DAYS, (task) => (isOpen(task.status) ? parseISO(task.created_at) : null)),
      overdue: lastDaysSeries(tasks, SERIES_DAYS, (task) => (isOpen(task.status) && task.due_date && task.due_date < todayKey ? (parseDateValue(task.due_date) ?? null) : null)),
      projects: lastDaysSeries(projects, SERIES_DAYS, (project) => parseISO(project.created_at)),
      completed: lastDaysSeries(tasks, SERIES_DAYS, (task) => (task.status === "done" ? parseISO(task.updated_at) : null)),
    };
  }, [tasks, projects, todayKey]);

  const dueToday = sortByOrder(tasks.filter((task) => task.due_date === todayKey));
  const period = filter.mode === "all" ? "all time" : dateFilterLabel(filter).toLowerCase();

  useEffect(() => {
    if (rangeOpen && filter.mode === "range") {
      setRangeFrom(serializeDateValue(filter.from));
      setRangeTo(serializeDateValue(filter.to));
    }
  }, [rangeOpen, filter]);

  const fromDate = parseDateValue(rangeFrom);
  const toDate = parseDateValue(rangeTo);
  const rangeValid = Boolean(fromDate && toDate && !isAfter(fromDate, toDate) && !isBefore(toDate, fromDate));

  return (
    <Screen>
      <TabHeader
        title={getGreeting()}
        subtitle={`${firstName} · ${format(new Date(), "EEEE, MMMM d")}`}
        right={<IconButton icon={Bell} label="Notifications" badge={unreadQuery.data} onPress={() => router.push("/notifications")} />}
      />
      <ScrollView
        refreshControl={<RefreshControl {...refresh} tintColor={colors["muted-foreground"]} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96, gap: 20 }}
      >
        {tasksQuery.isError && !tasksQuery.data ? <ErrorState onRetry={() => void tasksQuery.refetch()} /> : null}

        <View className="gap-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2" style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
            <Chip label="All" selected={filter.mode === "all"} onPress={() => setFilter({ mode: "all" })} />
            {DATE_FILTER_PERIODS.map((item) => (
              <Chip key={item.id} label={item.label} selected={filter.mode === "period" && filter.period === item.id} onPress={() => setFilter({ mode: "period", period: item.id })} />
            ))}
            <Chip label={filter.mode === "range" ? dateFilterLabel(filter) : "Custom"} selected={filter.mode === "range"} onPress={() => setRangeOpen(true)} />
          </ScrollView>
          {!tasksQuery.data && !tasksQuery.isError ? (
            <View className="flex-row flex-wrap gap-3">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-32 flex-1 basis-[44%] rounded-2xl" />
              ))}
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-3">
              <StatTile label="Pending tasks" value={`${stats.pending}/${stats.total}`} trend={trend(series.pending, false)} icon={Hourglass} onPress={() => router.navigate("/calendar")} />
              <StatTile label="Overdue tasks" value={`${stats.overdue}/${stats.total}`} trend={trend(series.overdue, false)} icon={CalendarClock} onPress={() => router.navigate("/calendar")} />
              <StatTile
                label="Active projects"
                value={`${filteredProjects.filter((project) => project.is_active).length}/${filteredProjects.length}`}
                trend={trend(series.projects, true)}
                icon={Layers}
                onPress={() => router.navigate("/projects")}
              />
              <StatTile label="Completed tasks" value={`${stats.completed}/${stats.total}`} trend={trend(series.completed, true)} icon={CircleCheck} onPress={() => router.navigate("/calendar")} />
            </View>
          )}
          <Text variant="caption" tone="muted">
            {`Counts for ${period}`}
          </Text>
        </View>

        <View className="gap-2">
          <SectionHeader title="Due today" actionLabel="Calendar" onAction={() => router.navigate("/calendar")} />
          {!tasksQuery.data ? (
            tasksQuery.isError ? null : <ListSkeleton rows={2} />
          ) : dueToday.length > 0 ? (
            <TaskListCard tasks={dueToday} onOpen={openDetails} onEdit={openEdit} />
          ) : (
            <View className="rounded-2xl border border-border bg-card">
              <EmptyState art="tasks" title="Nothing due today" description="Add a task or enjoy the clear day." />
            </View>
          )}
        </View>

        <TimeTrackerCard />
        <TodoCard />
        {tasksQuery.data ? <CompletionChart tasks={tasks} /> : <Skeleton className="h-64 w-full rounded-2xl" />}
        <SummaryCard
          title="Weekly insights"
          actionLabel="View tasks"
          onAction={() => router.navigate("/calendar")}
          rows={[
            { label: "Completed this week", value: insights.completedThisWeek },
            { label: "Completed last week", value: insights.completedLastWeek },
            { label: "Due this week", value: insights.dueThisWeek },
            { label: "Busiest day", value: insights.busiestDay ?? "None yet" },
          ]}
        />
        <SummaryCard
          title="Activity snapshot"
          actionLabel="View clients"
          onAction={() => router.navigate("/clients")}
          rows={[
            { label: "Open client tasks", value: activityQuery.data?.tasks ?? "–" },
            { label: "Open meetings", value: activityQuery.data?.meetings ?? "–" },
            { label: "Open calls", value: activityQuery.data?.calls ?? "–" },
          ]}
        />
      </ScrollView>
      <Fab label="New task" onPress={() => openNew(todayKey)} />
      {sheets}
      <Sheet
        open={rangeOpen}
        onClose={() => setRangeOpen(false)}
        title="Custom range"
        footer={
          <Button
            label="Apply"
            disabled={!rangeValid}
            onPress={() => {
              if (fromDate && toDate) setFilter({ mode: "range", from: fromDate, to: toDate });
              setRangeOpen(false);
            }}
          />
        }
      >
        <DateField label="From" value={rangeFrom} onChange={setRangeFrom} />
        <DateField label="To" value={rangeTo} onChange={setRangeTo} />
      </Sheet>
    </Screen>
  );
}
