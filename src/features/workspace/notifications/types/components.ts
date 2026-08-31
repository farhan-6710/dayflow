import type { AppNotification } from "@/features/admin/notifications/types/types";

export type ReminderNotificationsTableProps = {
  notifications: AppNotification[];
  isLoading: boolean;
  dismissingId: string | null;
  onDismiss: (notificationId: string) => void;
};

export type TaskNotificationsTableProps = {
  notifications: AppNotification[];
  isLoading: boolean;
  dismissingId: string | null;
  onDismiss: (notificationId: string) => void;
};
