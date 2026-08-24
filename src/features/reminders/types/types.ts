import type { ReminderDayKey } from "@/services/remindersService";

export type Week = {
  label: string;
  range: string;
  dates: number[];
};

export type ReminderSlotItem = {
  id: string;
  title: string;
  reminderTime: string;
  isDisabled: boolean;
};

export type ReminderDaySlot = {
  year: number;
  month: number;
  date: number;
  dayKey: ReminderDayKey;
  reminders: ReminderSlotItem[];
};

export type ReminderFormValues = {
  title: string;
  description: string;
  reminderTime: string;
  daysOfWeek: ReminderDayKey[];
  isDisabled: boolean;
  disabledUntil: string;
};
