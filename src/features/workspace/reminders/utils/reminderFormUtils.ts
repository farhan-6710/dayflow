import type { Reminder } from "@/services/remindersService";
import type { ReminderDaySlot, ReminderSlotItem } from "@/features/admin/reminders/types/types";
import {
  getDayKeyForDate,
  isReminderActiveToday,
} from "@/features/admin/reminders/utils/calendarUtils";

function toSlotItem(reminder: Reminder): ReminderSlotItem {
  return {
    id: reminder.id,
    title: reminder.title,
    reminderTime: reminder.reminder_time,
    isDisabled: !isReminderActiveToday(reminder.is_disabled, reminder.disabled_until),
  };
}

export function buildReminderDaySlot(
  reminders: Reminder[],
  year: number,
  month: number,
  date: number,
): ReminderDaySlot {
  const dayKey = getDayKeyForDate(year, month, date);

  const dayReminders = reminders
    .filter((reminder) => {
      if (!reminder.days_of_week.includes(dayKey)) return false;
      return isReminderActiveToday(reminder.is_disabled, reminder.disabled_until);
    })
    .map(toSlotItem);

  return {
    year,
    month,
    date,
    dayKey,
    reminders: dayReminders,
  };
}

import type { ReminderDayKey } from "@/services/remindersService";

export function buildDefaultReminderFormValues() {
  return {
    title: "",
    description: "",
    reminderTime: "10:00 AM",
    daysOfWeek: ["mon"] as ReminderDayKey[],
    isDisabled: false,
    disabledUntil: "",
  };
}

export function reminderToFormValues(reminder: Reminder) {
  return {
    title: reminder.title,
    description: reminder.description ?? "",
    reminderTime: reminder.reminder_time,
    daysOfWeek: reminder.days_of_week,
    isDisabled: reminder.is_disabled,
    disabledUntil: reminder.disabled_until ?? "",
  };
}
