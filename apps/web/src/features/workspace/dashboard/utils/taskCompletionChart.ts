import { format, getDaysInMonth } from "date-fns";

import type {
  TaskCompletionChartData,
  TaskCompletionChartPoint,
} from "@/features/workspace/dashboard/types/taskCompletionChart";
import type { Task } from "@/services/tasksService";

function localDateParts(iso: string): { year: number; month: number; day: number } | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function countCompletedByDay(tasks: Task[], year: number, month: number): Map<number, number> {
  const counts = new Map<number, number>();

  for (const task of tasks) {
    if (task.status !== "done") continue;
    const parts = localDateParts(task.updated_at);
    if (!parts || parts.year !== year || parts.month !== month) continue;
    counts.set(parts.day, (counts.get(parts.day) ?? 0) + 1);
  }

  return counts;
}

export function defaultTaskCompletionMonths(): {
  primary: { year: number; month: number };
  compare: { year: number; month: number };
} {
  const now = new Date();
  const primary = { year: now.getFullYear(), month: now.getMonth() + 1 };
  const compareDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return {
    primary,
    compare: { year: compareDate.getFullYear(), month: compareDate.getMonth() + 1 },
  };
}

export function buildTaskCompletionChart(
  tasks: Task[],
  currentYear: number,
  currentMonth: number,
  previousYear: number,
  previousMonth: number,
): TaskCompletionChartData {
  const currentDate = new Date(currentYear, currentMonth - 1, 1);
  const previousDate = new Date(previousYear, previousMonth - 1, 1);
  const dayCount = Math.max(getDaysInMonth(currentDate), getDaysInMonth(previousDate));
  const currentByDay = countCompletedByDay(tasks, currentYear, currentMonth);
  const previousByDay = countCompletedByDay(tasks, previousYear, previousMonth);

  const points: TaskCompletionChartPoint[] = [];
  let currentTotal = 0;
  let previousTotal = 0;

  for (let day = 1; day <= dayCount; day += 1) {
    const currentMonthCount = currentByDay.get(day) ?? 0;
    const previousMonthCount = previousByDay.get(day) ?? 0;
    currentTotal += currentMonthCount;
    previousTotal += previousMonthCount;
    points.push({
      day: String(day),
      currentMonth: currentMonthCount,
      previousMonth: previousMonthCount,
    });
  }

  let growthPercent: number | null = null;
  if (previousTotal > 0) {
    growthPercent = ((currentTotal - previousTotal) / previousTotal) * 100;
  } else if (currentTotal > 0) {
    growthPercent = 100;
  }

  return {
    points,
    currentMonthLabel: format(currentDate, "MMMM yyyy"),
    previousMonthLabel: format(previousDate, "MMMM yyyy"),
    currentTotal,
    previousTotal,
    growthPercent,
  };
}

export function lastNDaySparkline(tasks: Task[], days: number, predicate: (task: Task) => boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets = Array.from({ length: days }, () => 0);

  for (const task of tasks) {
    if (!predicate(task)) continue;
    const stamp = new Date(task.updated_at);
    if (Number.isNaN(stamp.getTime())) continue;
    stamp.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - stamp.getTime()) / 86_400_000);
    if (diff < 0 || diff >= days) continue;
    buckets[days - 1 - diff] += 1;
  }

  return buckets.map((value) => ({ value }));
}
