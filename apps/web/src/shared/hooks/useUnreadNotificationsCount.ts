import { useEffect, useState } from "react";

import { countUnreadNotifications } from "@/services/notificationsService";
import { useAuth } from "@/shared/hooks/useAuth";
import { onNotificationsUpdated } from "@/shared/utils/notificationsEvents";

export function useUnreadNotificationsCount() {
  const { user } = useAuth();
  const userId = user?.id;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      return;
    }
    let active = true;

    function refresh() {
      countUnreadNotifications(userId ?? "")
        .then((next) => {
          if (active) {
            setCount(next);
          }
        })
        .catch((error: unknown) => console.error("Failed to count notifications:", error));
    }

    refresh();
    const unsubscribe = onNotificationsUpdated(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId]);

  return count;
}
