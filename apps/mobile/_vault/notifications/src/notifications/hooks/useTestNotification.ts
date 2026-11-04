import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { API_URL } from "@constants/API";
import { axiosInstance } from "@/lib/axiosInstance";

interface PushNotificationPayload {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  priority?: "default" | "high" | "max" | "min" | "none";
  vibrate?: "true" | "false";
  vibrationPattern?: number[];
  channelId?: string;
  categoryId?: string;
}

export const useTestNotification = (config?: any) => {
  return useMutation({
    mutationFn: async (payload: PushNotificationPayload) => {
      const res = await axiosInstance({
        url: API_URL.EXPO_PUSH_NOTIFICATION.url,
        method: API_URL.EXPO_PUSH_NOTIFICATION.type,
        data: payload,
      });
      return res.data;
    },
    onError: (error) => {
      console.error("Failed to send push notification:", error);
      Alert.alert("Error", "Failed to send push notification");
    },
    ...config,
  });
};
