import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { registerForPushNotificationsAsync } from "./registerForPushNotificationsAsync";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { updateReminderRequest } from "@redux/slices/remindersSlice";
import { store } from "@redux/store";
import type { ReminderStatus } from "@types";

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
    console.error("Error setting up notifications:", error);
    throw error;
  }
};

export const registerNotificationCategories = async () => {
  // Set up notification category with action buttons
  await Notifications.setNotificationCategoryAsync("custom_category", [
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
    console.log("🔔 Notification Received: ", notification);
  });
};

function applyReminderStatusFromNotification(
  reminderId: string,
  status: ReminderStatus,
  toast: { type: "success" | "info" | "error"; title: string; message: string },
) {
  // Optimistic Redux update — saga syncs to Supabase in the background.
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
      console.log(
        "🔔 Notification Response: ",
        JSON.stringify(response, null, 2),
        JSON.stringify(response.notification.request.content.data, null, 2)
      );

      // Handle action button responses
      const actionId = response.actionIdentifier;
      const notificationId = response.notification.request.identifier;
      const notificationData = response.notification.request.content.data;
      const reminderId = notificationData?.reminderId as string | undefined;

      if (!reminderId) {
        console.warn("⚠️ No reminderId found in notification data");
      }

      if (actionId === "action_missed") {
        console.log("❌ User marked reminder as missed");

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
        console.log("✅ User marked reminder as done");

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

      // Handle default notification tap (no action button pressed)
      // Navigate to reminder details if tapped without action button
      if (reminderId) {
        try {
          router.push(`/reminder/${reminderId}` as any);
        } catch (error) {
          console.error("Navigation error:", error);
        }
      }
    }
  );
};

export const copyTokenToClipboard = async (expoPushToken: string | null) => {
  if (expoPushToken) {
    // Trigger haptic feedback first
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Copy to clipboard
    await Clipboard.setStringAsync(expoPushToken);

    // Show success alert
    Alert.alert("Copied!", "Expo push token has been copied to clipboard");
  }
};
