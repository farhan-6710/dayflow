import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from "react-native";

import { useUserId } from "@/features/auth/AuthProvider";
import { useReminders } from "@/features/reminders/useReminders";
import { recordReminderAlert } from "@/services/notificationsService";
import { msUntilNextMidnight } from "@/shared/utils/reminderDay";
import Notifications from "@notifications/expoNotifications";

/** Keeps the phone's schedule current while signed in: on open, on returning to the app and at midnight. */
export function ReminderSync() {
  const userId = useUserId();
  const client = useQueryClient();
  useReminders();

  useEffect(() => {
    const refresh = () => void client.invalidateQueries({ queryKey: ["reminders"] });
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    let timer: ReturnType<typeof setTimeout>;
    const scheduleMidnight = () => {
      timer = setTimeout(() => {
        refresh();
        scheduleMidnight();
      }, msUntilNextMidnight() + 1000);
    };
    scheduleMidnight();
    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, [client]);

  useEffect(() => {
    // Separate from the preserved listeners, which stay as they were. Fills the inbox when an alert shows.
    const record = (content: { title: string | null; body: string | null; data?: Record<string, unknown> }) => {
      const reminderId = content.data?.reminderId;
      if (typeof reminderId === "string") {
        void recordReminderAlert(userId, reminderId, content.title ?? "Reminder", content.body ?? "Time for your reminder")
          .then(() => client.invalidateQueries({ queryKey: ["notifications"] }))
          .catch((error) => console.error("[ReminderSync] inbox update failed:", error));
      }
    };
    const received = Notifications.addNotificationReceivedListener((notification) => record(notification.request.content));
    const responded = Notifications.addNotificationResponseReceivedListener((response) => record(response.notification.request.content));
    return () => {
      received.remove();
      responded.remove();
    };
  }, [userId, client]);

  return null;
}
