import { useQuery } from "@tanstack/react-query";

import { useUserId } from "@/features/auth/AuthProvider";
import { useAction } from "@/lib/query";
import { countUnreadNotifications, fetchUnreadNotifications, markNotificationRead } from "@/services/notificationsService";

export function useUnreadCount() {
  const userId = useUserId();
  return useQuery({ queryKey: ["notifications", "count"], queryFn: () => countUnreadNotifications(userId) });
}

export function useNotifications() {
  const userId = useUserId();
  const list = useQuery({ queryKey: ["notifications", "list"], queryFn: () => fetchUnreadNotifications(userId) });
  const markRead = useAction((id: string) => markNotificationRead(id), {
    failure: "Couldn't mark that as read.",
    invalidate: ["notifications"],
  });
  const markAllRead = useAction(
    async (ids: string[]) => {
      await Promise.all(ids.map((id) => markNotificationRead(id)));
    },
    { success: "All caught up.", failure: "Couldn't mark everything as read.", invalidate: ["notifications"] },
  );
  return { list, markRead, markAllRead };
}
