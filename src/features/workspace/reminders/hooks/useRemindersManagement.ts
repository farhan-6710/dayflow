import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import {
  buildDefaultReminderFormValues,
  buildReminderDaySlot,
  reminderToFormValues,
} from "@/features/admin/reminders/utils/reminderFormUtils";
import { createNotifications } from "@/services/notificationsService";
import {
  createReminder,
  deleteReminder,
  fetchReminders,
  hasReminderNotificationToday,
  updateReminder,
  type Reminder,
  type ReminderDayKey,
} from "@/services/remindersService";
import { showToast } from "@/shared/utils/showToast";
import { parseTimeToMinutes } from "@/features/admin/reminders/utils/calendarUtils";

export function useRemindersManagement() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState(buildDefaultReminderFormValues);

  const loadReminders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      setReminders(await fetchReminders(user.id));
    } catch (e) {
      console.error(e);
      setError("Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadReminders();
  }, [loadReminders]);

  const getSlot = useCallback(
    (year: number, month: number, date: number) => {
      return buildReminderDaySlot(reminders, year, month, date);
    },
    [reminders],
  );

  const openAddDialog = useCallback(() => {
    setEditingReminder(null);
    setFormValues(buildDefaultReminderFormValues());
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback(
    (reminderId: string) => {
      const reminder = reminders.find((entry) => entry.id === reminderId);
      if (!reminder) return;
      setEditingReminder(reminder);
      setFormValues(reminderToFormValues(reminder));
      setDialogOpen(true);
    },
    [reminders],
  );

  const handleFieldChange = useCallback(
    (field: string, value: string | boolean | string[]) => {
      setFormValues((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!user || !formValues.title.trim()) {
      showToast("error", "Reminder title is required.");
      return;
    }
    if (formValues.daysOfWeek.length === 0) {
      showToast("error", "Select at least one day for this reminder.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formValues.title.trim(),
        description: formValues.description.trim() || null,
        reminder_time: formValues.reminderTime,
        days_of_week: formValues.daysOfWeek as ReminderDayKey[],
        is_disabled: formValues.isDisabled,
        disabled_until: formValues.disabledUntil || null,
      };

      if (editingReminder) {
        const updated = await updateReminder(editingReminder.id, payload);
        setReminders((prev) =>
          prev.map((entry) => (entry.id === editingReminder.id ? updated : entry)),
        );
        showToast("success", "Reminder updated.");
      } else {
        const created = await createReminder(user.id, payload);
        setReminders((prev) => [...prev, created]);
        showToast("success", "Reminder created.");
      }

      setDialogOpen(false);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to save reminder.");
    } finally {
      setSubmitting(false);
    }
  }, [user, formValues, editingReminder]);

  const handleDelete = useCallback(async () => {
    if (!editingReminder) return;
    try {
      setSubmitting(true);
      await deleteReminder(editingReminder.id);
      setReminders((prev) => prev.filter((entry) => entry.id !== editingReminder.id));
      setDialogOpen(false);
      showToast("success", "Reminder deleted.");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete reminder.");
    } finally {
      setSubmitting(false);
    }
  }, [editingReminder]);

  const activeReminders = useMemo(
    () => reminders.filter((reminder) => reminder.days_of_week.length > 0),
    [reminders],
  );

  return {
    reminders: activeReminders,
    loading,
    error,
    getSlot,
    dialog: {
      open: dialogOpen,
      onOpenChange: setDialogOpen,
      values: formValues,
      onFieldChange: handleFieldChange,
      onSubmit: handleSubmit,
      onDelete: editingReminder ? handleDelete : undefined,
      submitting,
      isEditing: Boolean(editingReminder),
    },
    openAddDialog,
    openEditDialog,
    refresh: loadReminders,
  };
}

export function useReminderChecker(reminders: Reminder[]) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || reminders.length === 0) return;

    const checkReminders = async () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const dayKeys: ReminderDayKey[] = [
        "sun",
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
      ];
      const todayKey = dayKeys[now.getDay()];

      for (const reminder of reminders) {
        if (!reminder.days_of_week.includes(todayKey)) continue;
        if (reminder.is_disabled) {
          if (reminder.disabled_until) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const until = new Date(`${reminder.disabled_until}T00:00:00`);
            if (today <= until) continue;
          } else {
            continue;
          }
        }

        const reminderMinutes = parseTimeToMinutes(reminder.reminder_time);
        if (Math.abs(currentMinutes - reminderMinutes) > 1) continue;

        const alreadySent = await hasReminderNotificationToday(user.id, reminder.id);
        if (alreadySent) continue;

        await createNotifications([
          {
            userId: user.id,
            notificationType: "reminder",
            title: reminder.title,
            message:
              reminder.description?.trim() ||
              `Reminder at ${reminder.reminder_time}.`,
            relatedId: reminder.id,
          },
        ]);
        showToast("info", `Reminder: ${reminder.title}`);
      }
    };

    void checkReminders();
    const intervalId = window.setInterval(() => {
      void checkReminders();
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, [user, reminders]);
}
