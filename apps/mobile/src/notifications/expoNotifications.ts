import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

/**
 * Expo Go on Android throws if `expo-notifications` is imported, because the
 * package registers a push-token listener at module load (SDK 53+).
 * Use this wrapper everywhere instead of importing `expo-notifications` directly.
 */
type NotificationsModule = typeof import("expo-notifications");

export type NotificationSubscription = { remove: () => void };

const noopSubscription: NotificationSubscription = { remove: () => {} };

function createExpoGoAndroidShim(): NotificationsModule {
  if (__DEV__) {
    console.warn(
      "[DayFlow] Remote push and full notification APIs are unavailable in Expo Go on Android. Use a development or preview build for reminders/push.",
    );
  }

  return {
    setNotificationHandler: () => {},
    setNotificationChannelAsync: async () => null,
    AndroidImportance: {
      UNKNOWN: 0,
      NONE: 1,
      MIN: 2,
      LOW: 3,
      DEFAULT: 4,
      HIGH: 5,
      MAX: 6,
    },
    SchedulableTriggerInputTypes: {
      CALENDAR: "calendar",
      DAILY: "daily",
      WEEKLY: "weekly",
      YEARLY: "yearly",
      DATE: "date",
      TIME_INTERVAL: "timeInterval",
    },
    getAllScheduledNotificationsAsync: async () => [],
    cancelScheduledNotificationAsync: async () => {},
    cancelAllScheduledNotificationsAsync: async () => {},
    scheduleNotificationAsync: async () => "",
    requestPermissionsAsync: async () => ({
      status: "undetermined",
      granted: false,
      canAskAgain: true,
      expires: "never",
    }),
    getPermissionsAsync: async () => ({
      status: "undetermined",
      granted: false,
      canAskAgain: true,
      expires: "never",
    }),
    setNotificationCategoryAsync: async () => null,
    addNotificationReceivedListener: () => noopSubscription,
    addNotificationResponseReceivedListener: () => noopSubscription,
    dismissNotificationAsync: async () => {},
    getExpoPushTokenAsync: async () => {
      throw new Error(
        "Push notifications require a development or preview build on Android (not Expo Go).",
      );
    },
  } as unknown as NotificationsModule;
}

const Notifications: NotificationsModule =
  isRunningInExpoGo() && Platform.OS === "android"
    ? createExpoGoAndroidShim()
    : (require("expo-notifications") as NotificationsModule);

export default Notifications;
