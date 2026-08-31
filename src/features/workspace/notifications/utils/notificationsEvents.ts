import { NOTIFICATIONS_UPDATED_EVENT } from "@/features/workspace/notifications/constants/notificationTypes";

export function notifyNotificationsUpdated(): void {
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
}
