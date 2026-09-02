import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@lib/supabase";
import { DB } from "@services/db";
import type {
  OccurrenceStatus,
  Reminder,
  ReminderCategory,
  ReminderHistoryItem,
  ReminderOccurrence,
} from "@types";
import {
  datesBetween,
  formatHistoryDate,
  formatLocalDate,
  hasReminderTimePassed,
  parseLocalDate,
  repeatsOn,
} from "@utils/reminderDay";

type OccurrenceRow = {
  reminder_id: string;
  occurrence_date: string;
  status: string;
  reminders:
    | { category: string | null }
    | { category: string | null }[]
    | null;
};

type OccurrenceInsert = {
  user_id: string;
  reminder_id: string;
  occurrence_date: string;
  status: OccurrenceStatus;
};

let reconcileLock: Promise<boolean> | null = null;

function lastReconcileKey(userId: string): string {
  return `dayflow:last-reminder-reconcile:${userId}`;
}

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

function mapCategory(value: string | null | undefined): ReminderCategory | undefined {
  if (
    value === "health" ||
    value === "fitness" ||
    value === "work" ||
    value === "personal"
  ) {
    return value;
  }
  return undefined;
}

function joinedCategory(
  reminders: OccurrenceRow["reminders"],
): ReminderCategory | undefined {
  if (!reminders) return undefined;
  const row = Array.isArray(reminders) ? reminders[0] : reminders;
  return mapCategory(row?.category);
}

function mapOccurrence(row: OccurrenceRow): ReminderOccurrence {
  return {
    reminderId: row.reminder_id,
    occurrenceDate: row.occurrence_date,
    status: row.status === "done" ? "done" : "missed",
    category: joinedCategory(row.reminders),
  };
}

function occurrenceInsert(
  userId: string,
  reminderId: string,
  date: string,
  status: OccurrenceStatus,
): OccurrenceInsert {
  return {
    user_id: userId,
    reminder_id: reminderId,
    occurrence_date: date,
    status,
  };
}

function dedupeInserts(rows: OccurrenceInsert[]): OccurrenceInsert[] {
  const unique = new Map<string, OccurrenceInsert>();
  for (const row of rows) {
    unique.set(`${row.reminder_id}:${row.occurrence_date}`, row);
  }
  return [...unique.values()];
}

async function upsertOccurrences(
  rows: OccurrenceInsert[],
  ignoreDuplicates: boolean,
): Promise<void> {
  if (rows.length === 0) return;

  const { error } = await supabase.from(DB.REMINDER_OCCURRENCES.TABLE).upsert(
    rows,
    {
      onConflict: "reminder_id,occurrence_date",
      ignoreDuplicates,
    },
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function setReminderStatuses(
  userId: string,
  ids: string[],
  status: "upcoming" | "missed",
): Promise<void> {
  if (ids.length === 0) return;

  const { error } = await supabase
    .from(DB.REMINDERS.TABLE)
    .update({
      status,
      is_disabled: false,
    })
    .eq("user_id", userId)
    .in("id", ids);

  if (error) {
    throw new Error(error.message);
  }
}

export async function recordReminderOccurrence(
  reminderId: string,
  status: OccurrenceStatus,
  date = formatLocalDate(),
): Promise<void> {
  const userId = await getCurrentUserId();
  await upsertOccurrences(
    [occurrenceInsert(userId, reminderId, date, status)],
    false,
  );
}

export async function clearOccurrenceForDate(
  reminderId: string,
  date = formatLocalDate(),
): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from(DB.REMINDER_OCCURRENCES.TABLE)
    .delete()
    .eq("user_id", userId)
    .eq("reminder_id", reminderId)
    .eq("occurrence_date", date);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchReminderOccurrences(): Promise<ReminderOccurrence[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(DB.REMINDER_OCCURRENCES.TABLE)
    .select(DB.REMINDER_OCCURRENCES.SELECT)
    .eq("user_id", userId)
    .order("occurrence_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as OccurrenceRow[]).map(mapOccurrence);
}

export function groupOccurrencesByDate(
  occurrences: ReminderOccurrence[],
): ReminderHistoryItem[] {
  const byDate = new Map<string, { checked: number; total: number }>();

  for (const occurrence of occurrences) {
    const current = byDate.get(occurrence.occurrenceDate) ?? {
      checked: 0,
      total: 0,
    };
    current.total += 1;
    if (occurrence.status === "done") {
      current.checked += 1;
    }
    byDate.set(occurrence.occurrenceDate, current);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([date, stats]) => ({
      id: date,
      date: formatHistoryDate(date),
      remindersChecked: stats.checked,
      totalReminders: stats.total,
    }));
}

/**
 * Writes today's/past outcomes, marks passed upcoming reminders as missed,
 * and resets done/missed back to upcoming after local midnight.
 */
export async function reconcileReminderStatuses(
  reminders: Reminder[],
): Promise<boolean> {
  if (reconcileLock) {
    await reconcileLock;
    return true;
  }

  reconcileLock = runReconcile(reminders).finally(() => {
    reconcileLock = null;
  });

  return reconcileLock;
}

async function runReconcile(reminders: Reminder[]): Promise<boolean> {
  const userId = await getCurrentUserId();
  const now = new Date();
  const today = formatLocalDate(now);
  const lastReconcile = await AsyncStorage.getItem(lastReconcileKey(userId));
  const isNewDay = !lastReconcile || lastReconcile < today;

  const missedIds: string[] = [];
  const resetIds: string[] = [];
  const missedRows: OccurrenceInsert[] = [];
  const doneRows: OccurrenceInsert[] = [];

  if (isNewDay && lastReconcile) {
    for (const date of datesBetween(lastReconcile, today)) {
      const dateObj = parseLocalDate(date);
      for (const reminder of reminders) {
        if (reminder.status === "paused") continue;
        if (!repeatsOn(reminder, dateObj)) continue;
        missedRows.push(occurrenceInsert(userId, reminder.id, date, "missed"));
      }
    }
  }

  if (isNewDay) {
    const closeDate = lastReconcile ?? today;
    for (const reminder of reminders) {
      if (reminder.status !== "done" && reminder.status !== "missed") {
        continue;
      }
      if (closeDate >= today) {
        continue;
      }
      const row = occurrenceInsert(
        userId,
        reminder.id,
        closeDate,
        reminder.status,
      );
      if (reminder.status === "done") {
        doneRows.push(row);
      } else {
        missedRows.push(row);
      }
      resetIds.push(reminder.id);
    }
  }

  const resetSet = new Set(resetIds);

  for (const reminder of reminders) {
    if (reminder.status === "paused") continue;
    const status = resetSet.has(reminder.id) ? "upcoming" : reminder.status;
    if (status !== "upcoming") continue;
    if (!repeatsOn(reminder, now)) continue;
    if (!hasReminderTimePassed(reminder, now)) continue;

    missedIds.push(reminder.id);
    missedRows.push(occurrenceInsert(userId, reminder.id, today, "missed"));
  }

  const missedSet = new Set(missedIds);
  const resetOnlyIds = resetIds.filter((id) => !missedSet.has(id));
  const resetOnlySet = new Set(resetOnlyIds);

  for (const reminder of reminders) {
    if (missedSet.has(reminder.id) || resetOnlySet.has(reminder.id)) {
      continue;
    }
    if (reminder.status === "done") {
      doneRows.push(occurrenceInsert(userId, reminder.id, today, "done"));
    } else if (reminder.status === "missed") {
      missedRows.push(occurrenceInsert(userId, reminder.id, today, "missed"));
    }
  }

  await upsertOccurrences(dedupeInserts(missedRows), true);
  await upsertOccurrences(dedupeInserts(doneRows), false);
  await setReminderStatuses(userId, resetOnlyIds, "upcoming");
  await setReminderStatuses(userId, missedIds, "missed");
  await AsyncStorage.setItem(lastReconcileKey(userId), today);

  return resetOnlyIds.length > 0 || missedIds.length > 0;
}
