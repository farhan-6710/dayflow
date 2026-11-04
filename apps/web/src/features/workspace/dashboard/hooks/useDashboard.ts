import { useCallback, useMemo, useState } from "react";
import { subMonths } from "date-fns";

import type { MonthSelection } from "@/features/workspace/dashboard/types/components";
import {
  buildCompletionChart,
  computeTaskStats,
  computeWeeklyInsights,
  isInRange,
  lastDaysSeries,
} from "@/features/workspace/dashboard/utils/dashboardData";
import { fetchOpenActivityCounts } from "@/services/clientActivitiesService";
import { fetchProjects } from "@/services/projectsService";
import { fetchTasks } from "@/services/tasksService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useDateFilters } from "@/shared/hooks/useDateFilters";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { Task } from "@/shared/types/types";
import { parseDateValue, serializeDateValue } from "@/shared/utils/dateValue";

const SPARKLINE_DAYS = 14;

function toSelection(date: Date): MonthSelection {
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function useDashboard() {
  const { user, profile } = useAuth();
  const userId = user?.id;
  const { resolvedRange, periodLabel, dateFilterProps } = useDateFilters();
  const [primaryMonth, setPrimaryMonth] = useState(() => toSelection(new Date()));
  const [compareMonth, setCompareMonth] = useState(() => toSelection(subMonths(new Date(), 1)));

  const loader = useCallback(async () => {
    const [tasks, projects] = await Promise.all([fetchTasks(userId ?? ""), fetchProjects(userId ?? "")]);
    return { tasks, projects };
  }, [userId]);
  const { data, loading, error, reload } = useLoadData(userId ? loader : null, "Couldn't load your dashboard.");

  // A failed snapshot shouldn't take the whole dashboard down.
  const activityLoader = useCallback(() => fetchOpenActivityCounts(), []);
  const activity = useLoadData(userId ? activityLoader : null, "Couldn't load client activity.");

  const tasks = useMemo(() => data?.tasks ?? [], [data]);
  const filteredTasks = useMemo(() => tasks.filter((task) => isInRange(task.created_at, resolvedRange)), [tasks, resolvedRange]);
  const filteredProjects = useMemo(
    () => (data?.projects ?? []).filter((project) => isInRange(project.created_at, resolvedRange)),
    [data, resolvedRange],
  );
  const projectsCount = filteredProjects.length;
  const activeProjectsCount = useMemo(
    () => filteredProjects.filter((project) => project.is_active).length,
    [filteredProjects],
  );
  const stats = useMemo(() => computeTaskStats(filteredTasks), [filteredTasks]);
  const chart = useMemo(() => buildCompletionChart(tasks, primaryMonth, compareMonth), [tasks, primaryMonth, compareMonth]);
  const insights = useMemo(() => computeWeeklyInsights(tasks), [tasks]);
  const sparklines = useMemo(() => {
    const todayKey = serializeDateValue(new Date());
    const isOpen = (task: Task) => task.status === "todo" || task.status === "in_progress";
    return {
      pending: lastDaysSeries(tasks, SPARKLINE_DAYS, (task) => (isOpen(task) ? new Date(task.created_at) : null)),
      overdue: lastDaysSeries(tasks, SPARKLINE_DAYS, (task) =>
        isOpen(task) && task.due_date && task.due_date < todayKey ? (parseDateValue(task.due_date) ?? null) : null,
      ),
      projects: lastDaysSeries(data?.projects ?? [], SPARKLINE_DAYS, (project) => new Date(project.created_at)),
      completed: lastDaysSeries(tasks, SPARKLINE_DAYS, (task) => (task.status === "done" ? new Date(task.updated_at) : null)),
    };
  }, [tasks, data]);

  return {
    userEmail: user?.email,
    profile,
    loading,
    error,
    reload,
    periodLabel,
    dateFilterProps,
    stats,
    projectsCount,
    activeProjectsCount,
    sparklines,
    chart,
    primaryMonth,
    compareMonth,
    setPrimaryMonth,
    setCompareMonth,
    insights,
    activityCounts: activity.data,
    activityError: Boolean(activity.error),
  };
}
