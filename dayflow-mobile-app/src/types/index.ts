// Core domain types
// DB stores reminder statuses (missed set from notification actions)
export type ReminderStatus = "done" | "upcoming" | "paused" | "missed";

// Frontend displays 4 statuses (missed is calculated)
export type DisplayReminderStatus = "done" | "missed" | "upcoming" | "paused";

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
  createdAt?: string; // Backend timestamp
  updatedAt?: string; // Backend timestamp
  syncState?: SyncState; // Client-only: tracks sync status for optimistic UI
  tempId?: string; // Client-only: temporary ID for optimistic adds
}

export interface ReminderHistoryItem {
  id: number;
  remindersChecked: number;
  totalReminders: number;
  date: string;
}

// Component types
export * from "./ai-assist";
export * from "./analytics";
export * from "./components";
export * from "./profile";
