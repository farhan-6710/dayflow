import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { storeExpoPushToken } from "@services/expoPushTokensService";
import { useNotification } from "@notifications/context/NotificationProvider";

export const useRegisterDFN = (onLog?: (message: string) => void) => {
  const log = (message: string) => {
    console.log(`[useRegisterDFN] ${message}`);
    onLog?.(message);
  };

  const storeExpoTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      await storeExpoPushToken(token);
    },
    onSuccess: () => {
      log("Expo token saved to Supabase");
      log("Notification setup process completed");
    },
    onError: (error) => {
      console.log("❌ Failed to save Expo token to Supabase:", error);
      log(`Failed to save Expo token: ${error.message}`);
    },
  });

  const { expoPushToken, permissionStatus, error } = useNotification();

  useEffect(() => {
    log("Setting up notifications...");

    if (permissionStatus !== "granted") {
      log(`Notification permission not granted: ${permissionStatus}`);
      return;
    }

    if (!expoPushToken) {
      log("Expo Push Token not available yet.");
      return;
    }

    log(`Expo Push Token: ${expoPushToken}`);
    storeExpoTokenMutation.mutate(expoPushToken);
  }, [expoPushToken, permissionStatus, error]);

  return {
    isLoading: storeExpoTokenMutation.isPending,
    isSuccess: storeExpoTokenMutation.isSuccess,
    error: storeExpoTokenMutation.error,
  };
};
