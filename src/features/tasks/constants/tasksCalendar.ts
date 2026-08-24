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

export const DEFAULT_TASK_TIME = "10:00 AM";

function formatHourLabel(hour24: number, minute: number): string {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minuteLabel = minute.toString().padStart(2, "0");
  return `${hour12}:${minuteLabel} ${period}`;
}

function buildTaskAvailableTimes(): string[] {
  const times: string[] = [];
  for (let hour = 6; hour <= 22; hour += 1) {
    times.push(formatHourLabel(hour, 0));
    if (hour < 22) {
      times.push(formatHourLabel(hour, 30));
    }
  }
  return times;
}

export const TASK_AVAILABLE_TIMES = buildTaskAvailableTimes();

