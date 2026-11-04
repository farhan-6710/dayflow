import Notifications from "@notifications/expoNotifications";
import { router } from "expo-router";
import { registerForPushNotificationsAsync } from "./registerForPushNotificationsAsync";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { updateReminderRequest } from "@redux/slices/remindersSlice";
import { store } from "@redux/store";
import { REMINDER_NOTIFICATION_CATEGORY } from "@notifications/constants";
import type { ReminderStatus } from "@types";

const LOG_PREFIX = "[ReminderNotification]";

export const setupNotifications = async (): Promise<{
  token: string | null;
  status: string;
}> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();

    let token: string | null = null;
    if (status === "granted") {
      token = await registerForPushNotificationsAsync();
    }

    return { token, status };
  } catch (error) {
    console.error(`${LOG_PREFIX} setup failed:`, error);
    throw error;
  }
};

export const registerNotificationCategories = async () => {
  await Notifications.setNotificationCategoryAsync(REMINDER_NOTIFICATION_CATEGORY, [
    {
      identifier: "action_missed",
      buttonTitle: "Missed",
      options: { opensAppToForeground: false },
    },
    {
      identifier: "action_done",
      buttonTitle: "Done",
      options: { opensAppToForeground: false },
    },
  ]);
};

export const createNotificationReceivedListener = () => {
  return Notifications.addNotificationReceivedListener((notification) => {
    const { title, data } = notification.request.content;
    console.log(`${LOG_PREFIX} received`, {
      title,
      reminderId: data?.reminderId,
    });
  });
};

function applyReminderStatusFromNotification(
  reminderId: string,
  status: ReminderStatus,
  toast: { type: "success" | "info" | "error"; title: string; message: string },
) {
  store.dispatch(updateReminderRequest({ id: reminderId, updates: { status } }));
  Toast.show({
    type: toast.type,
    text1: toast.title,
    text2: toast.message,
  });
}

export const createNotificationResponseListener = () => {
  return Notifications.addNotificationResponseReceivedListener(
    async (response) => {
      const actionId = response.actionIdentifier;
      const notificationId = response.notification.request.identifier;
      const notificationData = response.notification.request.content.data;
      const reminderId = notificationData?.reminderId as string | undefined;

      console.log(`${LOG_PREFIX} invoked`, {
        actionId,
        reminderId,
      });

      if (!reminderId) {
        console.warn(`${LOG_PREFIX} missing reminderId in notification data`);
      }

      if (actionId === "action_missed") {
        if (reminderId) {
          applyReminderStatusFromNotification(reminderId, "missed", {
            type: "info",
            title: "Marked as Missed",
            message: "Reminder has been marked as missed",
          });
        }

        await Notifications.dismissNotificationAsync(notificationId);
        return;
      }

      if (actionId === "action_done") {
        if (reminderId) {
          applyReminderStatusFromNotification(reminderId, "done", {
            type: "success",
            title: "Marked as Done",
            message: "Great job completing your reminder!",
          });
        }

        await Notifications.dismissNotificationAsync(notificationId);
        return;
      }

      if (reminderId) {
        try {
          router.push(`/reminder-details/${reminderId}` as any);
        } catch (error) {
          console.error(`${LOG_PREFIX} navigation failed:`, error);
        }
      }
    },
  );
};

export const copyTokenToClipboard = async (expoPushToken: string | null) => {
  if (expoPushToken) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(expoPushToken);
    Alert.alert("Copied!", "Expo push token has been copied to clipboard");
  }
};
