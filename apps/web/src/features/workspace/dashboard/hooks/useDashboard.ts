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
  const projectsCount = useMemo(
    () => (data?.projects ?? []).filter((project) => isInRange(project.created_at, resolvedRange)).length,
    [data, resolvedRange],
  );
  const stats = useMemo(() => computeTaskStats(filteredTasks), [filteredTasks]);
  const chart = useMemo(() => buildCompletionChart(tasks, primaryMonth, compareMonth), [tasks, primaryMonth, compareMonth]);
  const insights = useMemo(() => computeWeeklyInsights(tasks), [tasks]);
  const sparklines = useMemo(
    () => ({
      completed: lastDaysSeries(tasks, SPARKLINE_DAYS, (task) => task.status === "done"),
      pending: lastDaysSeries(tasks, SPARKLINE_DAYS, (task) => task.status === "todo" || task.status === "in_progress"),
    }),
    [tasks],
  );

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
