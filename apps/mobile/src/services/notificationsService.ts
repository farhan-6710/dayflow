import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { AppNotification, NotificationType } from "@/shared/types/types";

export type CreateNotificationInput = {
  userId: string;
  notificationType: NotificationType;
  title: string;
  message: string;
  relatedId?: string | null;
};

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  const { error } = await supabase.from(DB.NOTIFICATIONS.TABLE).insert({
    user_id: input.userId,
    notification_type: input.notificationType,
    title: input.title,
    message: input.message,
    related_id: input.relatedId ?? null,
    status: "unread",
  });
  if (error) throw error;
}

export async function fetchUnreadNotifications(userId: string): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .select(DB.NOTIFICATIONS.SELECT)
    .eq("user_id", userId)
    .eq("status", "unread")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as unknown as AppNotification[]) ?? [];
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "unread");

  if (error) throw error;
  return count ?? 0;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("id", notificationId);
  if (error) throw error;
}
