import Notifications from "@notifications/expoNotifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  if (isRunningInExpoGo() && Platform.OS === "android") {
    throw new Error(
      "Push notifications require a development or preview build on Android (not Expo Go).",
    );
  }

  if (!Device.isDevice) {
    throw new Error("Must use physical device for push notifications");
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    throw new Error("Project ID not found");
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    return pushTokenString;
  } catch (e: unknown) {
    throw new Error(`${e}`);
  }
}
