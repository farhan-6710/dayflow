import { useCallback, useEffect, useState } from "react";

import { NOTIFICATIONS_UPDATED_EVENT } from "@/features/notifications/constants/notificationTypes";
import type { AppNotification } from "@/features/notifications/types/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  fetchUnreadNotifications,
  markNotificationRead,
} from "@/services/notificationsService";
import { showToast } from "@/shared/utils/showToast";

export function useNotificationsInbox() {
  const { user } = useAuth();
  const [reminderNotifications, setReminderNotifications] = useState<AppNotification[]>([]);
  const [taskNotifications, setTaskNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const loadInbox = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const [reminders, tasks] = await Promise.all([
        fetchUnreadNotifications(user.id, "reminder"),
        fetchUnreadNotifications(user.id, "task"),
      ]);
      setReminderNotifications(reminders);
      setTaskNotifications(tasks);
    } catch (e) {
      console.error(e);
      setError("Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  useEffect(() => {
    const handleUpdate = () => {
      void loadInbox();
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
  }, [loadInbox]);

  const dismissNotification = useCallback(async (notificationId: string) => {
    try {
      setDismissingId(notificationId);
      await markNotificationRead(notificationId);
      showToast("success", "Notification dismissed.");
      await loadInbox();
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to dismiss notification.");
    } finally {
      setDismissingId(null);
    }
  }, [loadInbox]);

  return {
    reminderNotifications,
    taskNotifications,
    isLoading,
    error,
    dismissingId,
    dismissNotification,
    refresh: loadInbox,
  };
}
