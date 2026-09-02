import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { registerForPushNotificationsAsync } from "./registerForPushNotificationsAsync";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import { reminderAPI } from "@services";
import Toast from "react-native-toast-message";

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
        // Handle Missed action
        console.log("❌ User marked reminder as missed");

        if (reminderId) {
          try {
            await reminderAPI.update(reminderId, { status: "missed" });
            Toast.show({
              type: "info",
              text1: "Marked as Missed",
              text2: "Reminder has been marked as missed",
            });
          } catch (error) {
            console.error("Failed to update reminder status:", error);
            Toast.show({
              type: "error",
              text1: "Update Failed",
              text2: "Could not update reminder status",
            });
          }
        }

        // Dismiss the notification after marking as missed
        await Notifications.dismissNotificationAsync(notificationId);
        console.log("📱 Notification dismissed after marking as missed");
        return; // Don't navigate
      } else if (actionId === "action_done") {
        // Handle Done action
        console.log("✅ User marked reminder as done");

        if (reminderId) {
          try {
            await reminderAPI.update(reminderId, { status: "done" });
            Toast.show({
              type: "success",
              text1: "Marked as Done",
              text2: "Great job completing your reminder!",
            });
          } catch (error) {
            console.error("Failed to update reminder status:", error);
            Toast.show({
              type: "error",
              text1: "Update Failed",
              text2: "Could not update reminder status",
            });
          }
        }

        // Dismiss the notification after marking as done
        await Notifications.dismissNotificationAsync(notificationId);
        console.log("📱 Notification dismissed after marking as done");
        return; // Don't navigate
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
