import type { DayOfWeek, ReminderCategory, ReminderStatus } from "@types";
import type { PillTone } from "@/ui/StatusPill";

export const DAYS: { key: DayOfWeek; short: string; letter: string }[] = [
  { key: "mon", short: "Mon", letter: "M" },
  { key: "tue", short: "Tue", letter: "T" },
  { key: "wed", short: "Wed", letter: "W" },
  { key: "thu", short: "Thu", letter: "T" },
  { key: "fri", short: "Fri", letter: "F" },
  { key: "sat", short: "Sat", letter: "S" },
  { key: "sun", short: "Sun", letter: "S" },
];

const JS_DAY_KEYS: DayOfWeek[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function todayKey(date = new Date()): DayOfWeek {
  return JS_DAY_KEYS[date.getDay()] as DayOfWeek;
}

export const REMINDER_STATUS: Record<ReminderStatus, { label: string; tone: PillTone }> = {
  upcoming: { label: "Upcoming", tone: "muted" },
  done: { label: "Done", tone: "success" },
  missed: { label: "Missed", tone: "destructive" },
  paused: { label: "Paused", tone: "progress" },
};

export const CATEGORY_OPTIONS: { value: ReminderCategory | "none"; label: string }[] = [
  { value: "none", label: "None" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "health", label: "Health" },
  { value: "fitness", label: "Fitness" },
];

export function describeDays(days: DayOfWeek[] | undefined): string {
  if (!days || days.length === 0 || days.length === 7) return "Every day";
  const weekdays: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri"];
  if (days.length === 5 && weekdays.every((day) => days.includes(day))) return "Weekdays";
  return DAYS.filter((day) => days.includes(day.key))
    .map((day) => day.short)
    .join(", ");
}
