import type { UserSettingKey, UserSettings } from "@/shared/types/types";

/** Matches the column defaults in migration 040: a user with no row gets these. */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  page_transitions: true,
  in_app_reminders: true,
  email_updates: true,
  desktop_alerts: true,
  weekly_digest: false,
};

/**
 * Last settings loaded from the database, mirrored per browser so the first-load
 * transition can respect them before the request returns.
 */
export const USER_SETTINGS_MIRROR_KEY = "dayflow.user-settings";

type SettingCopy = {
  label: string;
  description: string;
  /** Toast description once switched on, then off. */
  onDetail: string;
  offDetail: string;
};

export const USER_SETTING_COPY: Record<UserSettingKey, SettingCopy> = {
  page_transitions: {
    label: "Page transitions",
    description: "Play the shutter animation when DayFlow opens and between pages.",
    onDetail: "DayFlow will animate when it opens and between pages.",
    offDetail: "Pages now open instantly, without the shutter animation.",
  },
  in_app_reminders: {
    label: "In-app reminders",
    description: "Show reminder alerts while you are signed in to DayFlow.",
    onDetail: "Reminder alerts will show while you are signed in.",
    offDetail: "Reminder alerts won't show in the app.",
  },
  email_updates: {
    label: "Email updates",
    description: "Receive task and reminder emails at your account address.",
    onDetail: "Task and reminder emails will go to your account address.",
    offDetail: "You won't get task and reminder emails.",
  },
  desktop_alerts: {
    label: "Desktop notifications",
    description: "Allow browser alerts for due reminders in this tab.",
    onDetail: "Due reminders can raise browser alerts.",
    offDetail: "Due reminders won't raise browser alerts.",
  },
  weekly_digest: {
    label: "Weekly digest",
    description: "A Monday summary of open tasks and upcoming reminders.",
    onDetail: "You'll get a summary every Monday.",
    offDetail: "The Monday summary is off.",
  },
};

export const NOTIFICATION_SETTING_KEYS: UserSettingKey[] = [
  "in_app_reminders",
  "email_updates",
  "desktop_alerts",
  "weekly_digest",
];
