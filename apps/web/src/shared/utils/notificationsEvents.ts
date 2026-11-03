const NOTIFICATIONS_UPDATED_EVENT = "notifications-updated";

export function notifyNotificationsUpdated(): void {
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
}

export function onNotificationsUpdated(callback: () => void): () => void {
  window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, callback);
  return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, callback);
}
