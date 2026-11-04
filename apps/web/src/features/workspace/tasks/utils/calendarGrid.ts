import { addDays, eachDayOfInterval, endOfWeek, format, isSameMonth, isSameYear, startOfMonth, startOfWeek } from "date-fns";

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Always six weeks, Sunday first, so the grid never changes height between months. */
export function buildMonthDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month));
  return eachDayOfInterval({ start, end: addDays(start, 41) });
}

export function buildWeekDays(cursor: Date): Date[] {
  return eachDayOfInterval({ start: startOfWeek(cursor), end: endOfWeek(cursor) });
}

/** e.g. "25 – 31 Oct 2026". */
export function formatWeekTitle(cursor: Date): string {
  const start = startOfWeek(cursor);
  const end = endOfWeek(cursor);
  if (isSameMonth(start, end)) {
    return `${format(start, "d")} – ${format(end, "d MMM yyyy")}`;
  }
  if (isSameYear(start, end)) {
    return `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`;
  }
  return `${format(start, "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`;
}
