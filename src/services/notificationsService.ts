import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  AppNotification,
  CreateNotificationInput,
} from "@/features/workspace/notifications/types/types";
import type { NotificationType } from "@/features/workspace/notifications/constants/notificationTypes";
import { mapDbRowToNotification } from "@/features/workspace/notifications/utils/notificationDb";
import { notifyNotificationsUpdated } from "@/features/workspace/notifications/utils/notificationsEvents";

export async function createNotifications(
  inputs: CreateNotificationInput[],
): Promise<void> {
  if (inputs.length === 0) return;

  const rows = inputs.map((input) => ({
    user_id: input.userId,
    notification_type: input.notificationType,
    title: input.title,
    message: input.message,
    related_id: input.relatedId ?? null,
    status: "unread",
  }));

  const { error } = await supabase.from(DB.NOTIFICATIONS.TABLE).insert(rows);
  if (error) throw new Error(error.message ?? "Failed to create notifications.");

  notifyNotificationsUpdated();
}

export async function fetchUnreadNotifications(
  userId: string,
  notificationType?: NotificationType,
): Promise<AppNotification[]> {
  let query = supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .select(DB.NOTIFICATIONS.SELECT)
    .eq("user_id", userId)
    .eq("status", "unread")
    .order("created_at", { ascending: false });

  if (notificationType) {
    query = query.eq("notification_type", notificationType);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => mapDbRowToNotification(row));
}

export async function countUnreadNotifications(
  userId: string,
  notificationType?: NotificationType,
): Promise<number> {
  let query = supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "unread");

  if (notificationType) {
    query = query.eq("notification_type", notificationType);
  }

  const { count, error } = await query;
  if (error) throw error;

  return count ?? 0;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .update({
      status: "read",
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("status", "unread");

  if (error) throw new Error(error.message ?? "Failed to mark notification as read.");

  notifyNotificationsUpdated();
}
