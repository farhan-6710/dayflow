import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchUnreadNotifications, markNotificationRead } from "@/services/notificationsService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import { onNotificationsUpdated } from "@/shared/utils/notificationsEvents";
import { showToast } from "@/shared/utils/showToast";

export function useNotificationsInbox() {
  const { user } = useAuth();
  const userId = user?.id;
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loader = useCallback(() => fetchUnreadNotifications(userId ?? ""), [userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load your notifications.");

  // A reminder alert can arrive while this page is open.
  useEffect(() => onNotificationsUpdated(reload), [reload]);

  const notifications = useMemo(() => data ?? [], [data]);

  async function markRead(id: string) {
    setMarkingId(id);
    try {
      setData((current) => current.filter((notification) => notification.id !== id));
      await markNotificationRead(id);
      showToast("success", "Marked as read.");
    } catch (markError) {
      console.error("Failed to mark notification read:", markError);
      showToast("error", "Couldn't update that notification. Please try again.");
      reload();
    } finally {
      setMarkingId(null);
    }
  }

  return { notifications, loading, error, reload, markingId, markRead };
}
