import { useQuery } from "@tanstack/react-query";

import { syncReminderSchedule } from "@/features/reminders/notificationPort";
import { confirm } from "@/lib/confirm";
import { useAction } from "@/lib/query";
import { reconcileReminderStatuses } from "@/services/reminderOccurrencesService";
import { createReminder, deleteReminder, fetchReminders, updateReminder } from "@/services/remindersService";
import type { Reminder } from "@types";

/** Loads reminders, closes out past days, then refreshes the phone's schedule. */
async function loadReminders(): Promise<Reminder[]> {
  const reminders = await fetchReminders();
  const changed = await reconcileReminderStatuses(reminders);
  const next = changed ? await fetchReminders() : reminders;
  await syncReminderSchedule(next);
  return next;
}

export function useReminders() {
  return useQuery({ queryKey: ["reminders"], queryFn: loadReminders });
}

export function useReminderActions() {
  const create = useAction((input: Omit<Reminder, "id" | "createdAt" | "updatedAt">) => createReminder(input), {
    success: "Reminder added.",
    failure: "Couldn't add the reminder.",
    invalidate: ["reminders", "reminder-history"],
    quietError: true,
  });
  const update = useAction(({ id, updates }: { id: string; updates: Partial<Reminder> }) => updateReminder(id, updates), {
    success: "Reminder saved.",
    failure: "Couldn't save the reminder.",
    invalidate: ["reminders", "reminder-history"],
    quietError: true,
  });
  const setStatus = useAction(
    ({ id, updates }: { id: string; updates: Partial<Reminder> }) => updateReminder(id, updates),
    { success: "Reminder updated.", failure: "Couldn't update the reminder.", invalidate: ["reminders", "reminder-history"] },
  );
  const remove = useAction((id: string) => deleteReminder(id), {
    success: "Reminder deleted.",
    failure: "Couldn't delete the reminder.",
    invalidate: ["reminders", "reminder-history"],
  });

  return {
    create,
    update,
    setStatus,
    confirmDelete: async (reminder: Reminder) => {
      const ok = await confirm({
        title: `Delete "${reminder.name}"?`,
        message: "Its schedule and history go with it. This can't be undone.",
        confirmLabel: "Delete",
      });
      if (ok) remove.mutate(reminder.id);
      return ok;
    },
  };
}
