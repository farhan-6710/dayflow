// Core domain types
export type ReminderStatus = "done" | "upcoming" | "paused" | "missed";
export type OccurrenceStatus = "done" | "missed";
export type DisplayReminderStatus = ReminderStatus;

export type DayOfWeek = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type ReminderCategory = "health" | "fitness" | "work" | "personal";

export type SyncState = "synced" | "saving" | "deleting" | "failed";

export interface Reminder {
  id: string;
  name: string;
  description?: string;
  hour: number;
  minute: number;
  displayTime: string;
  status: ReminderStatus;
  category?: ReminderCategory; // Optional grouping until backend sync
  repeatDays?: DayOfWeek[]; // Days when reminder should repeat
  disabledUntil?: string | null; // Paused until this date, then active again
  createdAt?: string; // Backend timestamp
  updatedAt?: string; // Backend timestamp
  syncState?: SyncState; // Client-only: tracks sync status for optimistic UI
  tempId?: string; // Client-only: temporary ID for optimistic adds
}

export interface ReminderOccurrence {
  reminderId: string;
  occurrenceDate: string;
  status: OccurrenceStatus;
  category?: ReminderCategory;
}

export interface ReminderHistoryItem {
  id: string;
  remindersChecked: number;
  totalReminders: number;
  date: string;
}
