import {
  eachWeekOfInterval,
  endOfMonth,
  format,
  getDate,
  startOfMonth,
} from "date-fns";

import type { Week } from "@/features/reminders/types/types";
import type { ReminderDayKey } from "@/services/remindersService";

export function toCalendarParts(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
  };
}

export function isSameCalendarDay(
  a: Date,
  year: number,
  month: number,
  date: number,
) {
  return (
    a.getFullYear() === year &&
    a.getMonth() + 1 === month &&
    a.getDate() === date
  );
}

export function getDayLabel(year: number, month: number, date: number): string {
  return format(new Date(year, month - 1, date), "EEE");
}

export function buildMonthWeeks(year: number, month: number): Week[] {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(monthStart);
  const monthName = format(monthStart, "MMMM");

  const weekStarts = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 },
  );

  return weekStarts.map((weekStart, weekIndex) => {
    const dates = Array.from({ length: 7 }, (_, dayIndex) => {
      const cellDate = new Date(weekStart);
      cellDate.setDate(cellDate.getDate() + dayIndex);

      if (
        cellDate.getFullYear() !== year ||
        cellDate.getMonth() !== month - 1
      ) {
        return 0;
      }

      return getDate(cellDate);
    });

    const validDates = dates.filter((value) => value > 0);
    const range =
      validDates.length > 0
        ? `${monthName} ${validDates[0]} to ${monthName} ${validDates.at(-1)}`
        : "";

    return {
      label: `Week ${weekIndex + 1}`,
      range,
      dates,
    };
  });
}

export function formatMonthDayLabel(
  year: number,
  month: number,
  date: number,
): string {
  return format(new Date(year, month - 1, date), "MMMM d");
}

const JS_DAY_TO_KEY: ReminderDayKey[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export function getDayKeyForDate(year: number, month: number, date: number): ReminderDayKey {
  return JS_DAY_TO_KEY[new Date(year, month - 1, date).getDay()];
}

export function compareReminderTimes(a: string, b: string): number {
  return parseTimeToMinutes(a) - parseTimeToMinutes(b);
}

export function parseTimeToMinutes(time: string): number {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;

  let hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

export function isReminderActiveToday(
  isDisabled: boolean,
  disabledUntil: string | null,
): boolean {
  if (!isDisabled) return true;
  if (!disabledUntil) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const until = new Date(`${disabledUntil}T00:00:00`);
  return today > until;
}

export function buildCalendarDateSearchParams(
  date: Date,
  current: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(current);
  const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  next.set("date", value);
  return next;
}

export function parseCalendarDateFromSearchParams(
  searchParams: URLSearchParams,
): Date | null {
  const raw = searchParams.get("date");
  if (!raw) return null;

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}
