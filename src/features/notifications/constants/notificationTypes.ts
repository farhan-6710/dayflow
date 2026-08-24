export const NOTIFICATION_TYPES = ["reminder", "task"] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_STATUSES = ["unread", "read"] as const;

export const NOTIFICATION_TYPE_LABELS = {
  reminder: "Reminders",
  task: "Tasks",
} as const;

export const NOTIFICATIONS_UPDATED_EVENT = "notifications-updated";

export const reminderNotificationsDirectoryConfig = {
  title: "Reminders",
  description: "In-app alerts when a scheduled reminder time is reached.",
  gridClass: "grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,0.8fr)_auto]",
  columns: [
    { label: "TITLE" },
    { label: "MESSAGE" },
    { label: "SENT" },
    { label: "ACTIONS", align: "right" as const },
  ],
  emptyMessage: "No unread reminder notifications.",
} as const;

export const taskNotificationsDirectoryConfig = {
  title: "Tasks",
  description: "Task-related alerts for your personal workspace.",
  gridClass: "grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,0.8fr)_auto]",
  columns: [
    { label: "TITLE" },
    { label: "MESSAGE" },
    { label: "SENT" },
    { label: "ACTIONS", align: "right" as const },
  ],
  emptyMessage: "No unread task notifications.",
} as const;
