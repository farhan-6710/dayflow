import { useCallback, useMemo, useState } from "react";

import type { ReminderFormValues } from "@/features/workspace/reminders/types/components";
import { createReminder, deleteReminder, fetchReminders, updateReminder } from "@/services/remindersService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { Reminder, ReminderDayKey } from "@/shared/types/types";
import { showToast } from "@/shared/utils/showToast";

export function useRemindersManagement() {
  const { user } = useAuth();
  const userId = user?.id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [defaultDay, setDefaultDay] = useState<ReminderDayKey>("mon");
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loader = useCallback(() => fetchReminders(userId ?? ""), [userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load your reminders.");
  const reminders = useMemo(() => data ?? [], [data]);

  function openAdd(day: ReminderDayKey) {
    setEditingReminder(null);
    setDefaultDay(day);
    setDialogOpen(true);
  }

  function openEdit(reminder: Reminder) {
    setEditingReminder(reminder);
    setDialogOpen(true);
  }

  /** Throws on failure so the dialog stays open. */
  async function save(reminderId: string | null, values: ReminderFormValues) {
    const input = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      reminder_time: values.reminderTime,
      days_of_week: values.daysOfWeek,
      is_disabled: values.isDisabled,
      disabled_until: values.isDisabled ? values.disabledUntil || null : null,
    };
    try {
      if (reminderId) {
        const updated = await updateReminder(reminderId, input);
        setData((current) => current.map((reminder) => (reminder.id === updated.id ? updated : reminder)));
        showToast("success", "Reminder updated.");
      } else {
        const created = await createReminder(userId ?? "", input);
        setData((current) => [...current, created]);
        showToast("success", "Reminder added.");
      }
    } catch (saveError) {
      console.error("Failed to save reminder:", saveError);
      showToast("error", "Couldn't save the reminder. Please try again.");
      throw saveError;
    }
  }

  async function confirmDelete() {
    if (!reminderToDelete) {
      return;
    }
    setDeleting(true);
    try {
      await deleteReminder(reminderToDelete.id);
      setData((current) => current.filter((reminder) => reminder.id !== reminderToDelete.id));
      setReminderToDelete(null);
      setDialogOpen(false);
      showToast("success", "Reminder deleted.");
    } catch (deleteError) {
      console.error("Failed to delete reminder:", deleteError);
      showToast("error", "Couldn't delete the reminder. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return {
    reminders,
    loading,
    error,
    reload,
    dialogOpen,
    setDialogOpen,
    editingReminder,
    defaultDay,
    reminderToDelete,
    setReminderToDelete,
    deleting,
    openAdd,
    openEdit,
    save,
    confirmDelete,
  };
}
