import type { AppNotification } from "@/features/notifications/types/types";
import type { NotificationType } from "@/features/notifications/constants/notificationTypes";

type NotificationRow = {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  status: "unread" | "read";
  related_id: string | null;
  created_at: string;
  read_at: string | null;
};

export function mapDbRowToNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    user_id: row.user_id,
    notification_type: row.notification_type,
    title: row.title,
    message: row.message,
    status: row.status,
    related_id: row.related_id,
    created_at: row.created_at,
    read_at: row.read_at,
  };
}
