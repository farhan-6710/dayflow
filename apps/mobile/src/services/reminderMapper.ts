import type {
  DayOfWeek,
  Reminder,
  ReminderCategory,
  ReminderStatus,
} from "@types";

export type SupabaseReminderRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  reminder_time: string;
  days_of_week: string[];
  is_disabled: boolean;
  disabled_until: string | null;
  status: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
};

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function parseReminderTime(time: string): {
  hour: number;
  minute: number;
  displayTime: string;
} {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return { hour: 9, minute: 0, displayTime: "9:00 AM" };
  }

  let hour = Number.parseInt(match[1]!, 10);
  const minute = Number.parseInt(match[2]!, 10);
  const period = match[3]!.toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const displayHour = hour % 12 || 12;
  const displayTime = `${displayHour}:${pad(minute)} ${hour >= 12 ? "PM" : "AM"}`;

  return { hour, minute, displayTime };
}

export function formatReminderTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${pad(minute)} ${period}`;
}

function mapStatus(row: SupabaseReminderRow): ReminderStatus {
  if (
    row.status === "done" ||
    row.status === "paused" ||
    row.status === "upcoming" ||
    row.status === "missed"
  ) {
    return row.status;
  }

  if (row.is_disabled) {
    return "paused";
  }

  return "upcoming";
}

function mapCategory(value: string | null): ReminderCategory | undefined {
  if (
    value === "health" ||
    value === "fitness" ||
    value === "work" ||
    value === "personal"
  ) {
    return value;
  }

  return undefined;
}

export function mapRowToReminder(row: SupabaseReminderRow): Reminder {
  const { hour, minute, displayTime } = parseReminderTime(row.reminder_time);

  return {
    id: row.id,
    name: row.title,
    description: row.description ?? undefined,
    hour,
    minute,
    displayTime,
    status: mapStatus(row),
    category: mapCategory(row.category),
    repeatDays: row.days_of_week as DayOfWeek[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapReminderToInsert(
  userId: string,
  reminder: Omit<Reminder, "id" | "createdAt" | "updatedAt">,
) {
  const status = reminder.status ?? "upcoming";

  return {
    user_id: userId,
    title: reminder.name,
    description: reminder.description ?? null,
    reminder_time: reminder.displayTime ?? formatReminderTime(reminder.hour, reminder.minute),
    days_of_week: reminder.repeatDays ?? [],
    is_disabled: status === "paused",
    disabled_until: null,
    status,
    category: reminder.category ?? null,
  };
}

export function mapReminderToUpdate(updates: Partial<Reminder>) {
  const payload: Record<string, unknown> = {};

  if (updates.name !== undefined) payload.title = updates.name;
  if (updates.description !== undefined) payload.description = updates.description ?? null;
  if (updates.displayTime !== undefined) payload.reminder_time = updates.displayTime;
  if (updates.hour !== undefined || updates.minute !== undefined) {
    const hour = updates.hour ?? 9;
    const minute = updates.minute ?? 0;
    payload.reminder_time = formatReminderTime(hour, minute);
  }
  if (updates.repeatDays !== undefined) payload.days_of_week = updates.repeatDays;
  if (updates.category !== undefined) payload.category = updates.category ?? null;

  if (updates.status !== undefined) {
    payload.status = updates.status === "missed" ? "missed" : updates.status;
    payload.is_disabled = updates.status === "paused";
  }

  return payload;
}
