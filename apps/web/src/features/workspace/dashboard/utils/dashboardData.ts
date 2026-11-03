import { eachDayOfInterval, endOfWeek, format, getDaysInMonth, isWithinInterval, startOfDay, startOfWeek, subDays, subWeeks } from "date-fns";

import type { MonthSelection, TaskCompletionData } from "@/features/workspace/dashboard/types/components";
import type { Task } from "@/shared/types/types";
import type { DateFiltersResolvedRange } from "@/shared/utils/dateFiltersUtils";
import { parseDateValue, serializeDateValue } from "@/shared/utils/dateValue";

export function isInRange(iso: string, range: DateFiltersResolvedRange | null): boolean {
  return !range || isWithinInterval(new Date(iso), { start: range.from, end: range.to });
}

export function computeTaskStats(tasks: Task[]) {
  const todayKey = serializeDateValue(new Date());
  const completed = tasks.filter((task) => task.status === "done").length;
  const missed = tasks.filter((task) => task.status === "missed").length;
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed - missed,
    overdue: tasks.filter(
      (task) => task.status !== "done" && task.status !== "missed" && task.due_date && task.due_date < todayKey,
    ).length,
  };
}

/** Daily counts over the last `days` days, oldest first. `dateOf` returns the day an item counts on, or null to skip it. */
export function lastDaysSeries<T>(items: T[], days: number, dateOf: (item: T) => Date | null): number[] {
  const today = startOfDay(new Date());
  const counts = new Map(
    eachDayOfInterval({ start: subDays(today, days - 1), end: today }).map((day) => [serializeDateValue(day), 0]),
  );
  for (const item of items) {
    const date = dateOf(item);
    const key = date ? serializeDateValue(date) : null;
    if (key && counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.values()];
}

/** Second half of a series against the first, e.g. this week vs last. */
export function seriesDelta(series: number[]): number {
  const middle = Math.floor(series.length / 2);
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  return sum(series.slice(middle)) - sum(series.slice(0, middle));
}

function completedByDay(tasks: Task[], { year, month }: MonthSelection): Map<number, number> {
  const counts = new Map<number, number>();
  for (const task of tasks) {
    const date = new Date(task.updated_at);
    if (task.status === "done" && date.getFullYear() === year && date.getMonth() + 1 === month) {
      counts.set(date.getDate(), (counts.get(date.getDate()) ?? 0) + 1);
    }
  }
  return counts;
}

function monthDate({ year, month }: MonthSelection): Date {
  return new Date(year, month - 1, 1);
}

/** Tasks marked done per day of two months, by last-updated date (the table has no completed-at). */
export function buildCompletionChart(tasks: Task[], primary: MonthSelection, compare: MonthSelection): TaskCompletionData {
  const primaryCounts = completedByDay(tasks, primary);
  const compareCounts = completedByDay(tasks, compare);
  const days = Math.max(getDaysInMonth(monthDate(primary)), getDaysInMonth(monthDate(compare)));
  const points = Array.from({ length: days }, (_, index) => ({
    day: String(index + 1),
    primary: primaryCounts.get(index + 1) ?? 0,
    compare: compareCounts.get(index + 1) ?? 0,
  }));
  const primaryTotal = points.reduce((sum, point) => sum + point.primary, 0);
  const compareTotal = points.reduce((sum, point) => sum + point.compare, 0);

  return {
    points,
    primaryLabel: format(monthDate(primary), "MMMM yyyy"),
    compareLabel: format(monthDate(compare), "MMMM yyyy"),
    primaryTotal,
    compareTotal,
    growthPercent: compareTotal > 0 ? ((primaryTotal - compareTotal) / compareTotal) * 100 : primaryTotal > 0 ? 100 : null,
  };
}

export function computeWeeklyInsights(tasks: Task[]) {
  const now = new Date();
  const week = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
  const lastWeek = { start: subWeeks(week.start, 1), end: subWeeks(week.end, 1) };
  const done = tasks.filter((task) => task.status === "done");

  const dueThisWeek = tasks.filter((task) => {
    const due = parseDateValue(task.due_date);
    return due && isWithinInterval(due, week);
  });
  const perDay = new Map<string, number>();
  for (const task of dueThisWeek) {
    const label = format(parseDateValue(task.due_date) ?? now, "EEEE");
    perDay.set(label, (perDay.get(label) ?? 0) + 1);
  }

  return {
    completedThisWeek: done.filter((task) => isWithinInterval(new Date(task.updated_at), week)).length,
    completedLastWeek: done.filter((task) => isWithinInterval(new Date(task.updated_at), lastWeek)).length,
    dueThisWeek: dueThisWeek.length,
    busiestDay: [...perDay.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
  };
}
