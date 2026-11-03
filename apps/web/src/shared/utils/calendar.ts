import { addDays, eachWeekOfInterval, endOfMonth, startOfMonth } from "date-fns";

/** The Monday-first weeks that cover `month`, as full dates. */
export function buildMonthWeeks(month: Date): Date[][] {
  const weekStarts = eachWeekOfInterval(
    { start: startOfMonth(month), end: endOfMonth(month) },
    { weekStartsOn: 1 },
  );
  return weekStarts.map((weekStart) => Array.from({ length: 7 }, (_, day) => addDays(weekStart, day)));
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
