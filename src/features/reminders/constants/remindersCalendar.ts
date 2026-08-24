export const CALENDAR_DAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export const CALENDAR_DAY_COLUMN_WIDTH = 112;
export const CALENDAR_WEEK_COLUMN_MIN_WIDTH = 168;

export const REMINDER_DAY_KEYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

export const REMINDER_DAY_OPTIONS = [
  { key: "mon", label: "Mon", initial: "M" },
  { key: "tue", label: "Tue", initial: "T" },
  { key: "wed", label: "Wed", initial: "W" },
  { key: "thu", label: "Thu", initial: "T" },
  { key: "fri", label: "Fri", initial: "F" },
  { key: "sat", label: "Sat", initial: "S" },
  { key: "sun", label: "Sun", initial: "S" },
] as const;

export const DEFAULT_REMINDER_TIME = "10:00 AM";

function formatHourLabel(hour24: number, minute: number): string {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minuteLabel = minute.toString().padStart(2, "0");
  return `${hour12}:${minuteLabel} ${period}`;
}

function buildReminderAvailableTimes(): string[] {
  const times: string[] = [];
  for (let hour = 6; hour <= 22; hour += 1) {
    times.push(formatHourLabel(hour, 0));
    if (hour < 22) {
      times.push(formatHourLabel(hour, 30));
    }
  }
  return times;
}

export const REMINDER_AVAILABLE_TIMES = buildReminderAvailableTimes();

export const REMINDERS_CALENDAR_PATH = "/calendar";
