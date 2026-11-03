import { startOfDay } from "date-fns";

import type { Reminder, ReminderDayKey } from "@/shared/types/types";
import { parseDateValue } from "@/shared/utils/dateValue";

export const REMINDER_DAYS: { key: ReminderDayKey; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

/** date-fns / Date `getDay()` order, Sunday first. */
const DAY_KEYS_BY_INDEX: ReminderDayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function dayKeyForDate(date: Date): ReminderDayKey {
  return DAY_KEYS_BY_INDEX[date.getDay()] ?? "mon";
}

/** Minutes since midnight for stored times like "10:00 AM"; null if unreadable. */
export function parseTimeToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) {
    return null;
  }
  const hour = Number(match[1]) % 12 + (match[3]?.toUpperCase() === "PM" ? 12 : 0);
  return hour * 60 + Number(match[2]);
}

/** Off indefinitely, or off until the end of `disabled_until`. */
export function isReminderActive(reminder: Reminder, today = new Date()): boolean {
  if (!reminder.is_disabled) {
    return true;
  }
  const until = parseDateValue(reminder.disabled_until);
  return Boolean(until && startOfDay(today) > until);
}

export function byTime(a: Reminder, b: Reminder): number {
  return (parseTimeToMinutes(a.reminder_time) ?? 0) - (parseTimeToMinutes(b.reminder_time) ?? 0);
}
