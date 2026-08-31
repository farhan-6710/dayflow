import type { NotificationType } from "@/features/admin/notifications/constants/notificationTypes";

export type AppNotification = {
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

export type CreateNotificationInput = {
  userId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  relatedId?: string | null;
};
