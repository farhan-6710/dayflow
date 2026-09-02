import { supabase } from "@lib/supabase";
import { DB } from "@services/db";
import {
  mapReminderToInsert,
  mapReminderToUpdate,
  mapRowToReminder,
  type SupabaseReminderRow,
} from "@services/reminderMapper";
import { recordReminderOccurrence } from "@services/reminderOccurrencesService";
import type { Reminder } from "@types";

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }

  const userId = data.user?.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }

  return userId;
}

async function persistOccurrenceIfTerminal(reminder: Reminder): Promise<void> {
  if (reminder.status === "done" || reminder.status === "missed") {
    await recordReminderOccurrence(reminder.id, reminder.status);
  }
}

export async function fetchReminders(): Promise<Reminder[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(DB.REMINDERS.TABLE)
    .select(DB.REMINDERS.SELECT)
    .eq("user_id", userId)
    .order("reminder_time", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as SupabaseReminderRow[]).map(mapRowToReminder);
}

export async function createReminder(
  reminder: Omit<Reminder, "id" | "createdAt" | "updatedAt">,
): Promise<Reminder> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(DB.REMINDERS.TABLE)
    .insert(mapReminderToInsert(userId, reminder))
    .select(DB.REMINDERS.SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const created = mapRowToReminder(data as SupabaseReminderRow);
  await persistOccurrenceIfTerminal(created);
  return created;
}

export async function updateReminder(
  id: string,
  updates: Partial<Reminder>,
): Promise<Reminder> {
  const userId = await getCurrentUserId();
  const payload = mapReminderToUpdate(updates);

  const { data, error } = await supabase
    .from(DB.REMINDERS.TABLE)
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select(DB.REMINDERS.SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const updated = mapRowToReminder(data as SupabaseReminderRow);
  if (updates.status === "done" || updates.status === "missed") {
    await recordReminderOccurrence(updated.id, updates.status);
  }
  return updated;
}

export async function deleteReminder(id: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from(DB.REMINDERS.TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
