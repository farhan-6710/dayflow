export const NOTIFICATION_PREFERENCES_STORAGE_KEY = "dayflow.notification-preferences";

export type NotificationPreferences = {
  inAppReminders: boolean;
  emailUpdates: boolean;
  desktopAlerts: boolean;
  weeklyDigest: boolean;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  inAppReminders: true,
  emailUpdates: true,
  desktopAlerts: true,
  weeklyDigest: false,
};
