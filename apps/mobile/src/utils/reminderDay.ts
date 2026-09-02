import type { DayOfWeek, Reminder, ReminderStatus } from "@types";

const DAY_KEYS: DayOfWeek[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function formatLocalDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateStr: string, amount: number): string {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() + amount);
  return formatLocalDate(date);
}

/** Dates after `start` and before `end` (both YYYY-MM-DD). */
export function datesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  let cursor = addDays(start, 1);
  while (cursor < end) {
    dates.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return dates;
}

export function msUntilNextMidnight(now = new Date()): number {
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return nextMidnight.getTime() - now.getTime();
}

export function repeatsOn(
  reminder: Pick<Reminder, "repeatDays">,
  date: Date,
): boolean {
  const days = reminder.repeatDays;
  if (!days || days.length === 0) {
    return true;
  }
  return days.includes(DAY_KEYS[date.getDay()]!);
}

export function hasReminderTimePassed(
  reminder: Pick<Reminder, "hour" | "minute">,
  now = new Date(),
): boolean {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const scheduledMinutes = reminder.hour * 60 + reminder.minute;
  return nowMinutes > scheduledMinutes;
}

/**
 * Status from the schedule. Paused stays paused. Done stays done if the
 * time has already passed. Otherwise: future → upcoming, past → missed.
 */
export function statusForSchedule(
  reminder: Pick<Reminder, "hour" | "minute" | "repeatDays" | "status">,
  now = new Date(),
): ReminderStatus {
  if (reminder.status === "paused") {
    return "paused";
  }

  const dueNow =
    repeatsOn(reminder, now) && hasReminderTimePassed(reminder, now);
  if (!dueNow) {
    return "upcoming";
  }

  return reminder.status === "done" ? "done" : "missed";
}

export function initialReminderStatus(
  reminder: Pick<Reminder, "hour" | "minute" | "repeatDays">,
  now = new Date(),
): "upcoming" | "missed" {
  const status = statusForSchedule({ ...reminder, status: "upcoming" }, now);
  return status === "missed" ? "missed" : "upcoming";
}

export function formatHistoryDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
