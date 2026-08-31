import { useCallback, useEffect, useState } from "react";

import { NOTIFICATIONS_UPDATED_EVENT } from "@/features/admin/notifications/constants/notificationTypes";
import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import { countUnreadNotifications } from "@/services/notificationsService";

export function useUnreadNotificationsCount() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const loadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const count = await countUnreadNotifications(user.id);
    setUnreadCount(count);
  }, [user]);

  useEffect(() => {
    void loadCount();
  }, [loadCount]);

  useEffect(() => {
    const handleUpdate = () => {
      void loadCount();
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
  }, [loadCount]);

  return { unreadCount, refresh: loadCount };
}
