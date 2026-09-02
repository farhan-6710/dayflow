import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export type ReminderDayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Reminder = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  reminder_time: string;
  days_of_week: ReminderDayKey[];
  is_disabled: boolean;
  disabled_until: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateReminderInput = {
  title: string;
  description?: string | null;
  reminder_time: string;
  days_of_week: ReminderDayKey[];
  is_disabled?: boolean;
  disabled_until?: string | null;
};

export async function fetchReminders(userId: string): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from(DB.REMINDERS.TABLE)
    .select(DB.REMINDERS.SELECT)
    .eq("user_id", userId)
    .order("reminder_time", { ascending: true });

  if (error) throw error;
  return (data as Reminder[]) ?? [];
}

export async function createReminder(
  userId: string,
  input: CreateReminderInput,
): Promise<Reminder> {
  const { data, error } = await supabase
    .from(DB.REMINDERS.TABLE)
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description ?? null,
      reminder_time: input.reminder_time,
      days_of_week: input.days_of_week,
      is_disabled: input.is_disabled ?? false,
      disabled_until: input.disabled_until ?? null,
    })
    .select(DB.REMINDERS.SELECT)
    .single();

  if (error) throw error;
  return data as Reminder;
}

export async function updateReminder(
  id: string,
  updates: Partial<CreateReminderInput>,
): Promise<Reminder> {
  const { data, error } = await supabase
    .from(DB.REMINDERS.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.REMINDERS.SELECT)
    .single();

  if (error) throw error;
  return data as Reminder;
}

export async function deleteReminder(id: string): Promise<void> {
  const { error } = await supabase.from(DB.REMINDERS.TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function hasReminderNotificationToday(
  userId: string,
  reminderId: string,
): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  const { count, error } = await supabase
    .from(DB.NOTIFICATIONS.TABLE)
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("related_id", reminderId)
    .eq("notification_type", "reminder")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59.999`);

  if (error) throw error;
  return (count ?? 0) > 0;
}
