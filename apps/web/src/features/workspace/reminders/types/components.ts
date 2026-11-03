import type { Reminder, ReminderDayKey } from "@/shared/types/types";

export type ReminderFormValues = {
  title: string;
  description: string;
  reminderTime: string;
  daysOfWeek: ReminderDayKey[];
  isDisabled: boolean;
  disabledUntil: string;
};

export type RemindersWeekBoardProps = {
  reminders: Reminder[];
  onAdd: (day: ReminderDayKey) => void;
  onEdit: (reminder: Reminder) => void;
};

export type ReminderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null creates a new reminder on `defaultDay`. */
  reminder: Reminder | null;
  defaultDay: ReminderDayKey;
  onSave: (reminderId: string | null, values: ReminderFormValues) => Promise<void>;
  onDelete: (reminder: Reminder) => void;
};
