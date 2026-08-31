import type { ReminderDaySlot, Week } from "@/features/admin/reminders/types/types";

export type RemindersWeeksTableProps = {
  year: number;
  month: number;
  weeks: Week[];
  selectedDate: Date;
  getSlot: (year: number, month: number, date: number) => ReminderDaySlot | null;
  onOpenDay: (year: number, month: number, date: number) => void;
  onEdit: (reminderId: string) => void;
};

export type ReminderWeekDayCellProps = {
  year: number;
  month: number;
  dateNumber: number;
  slot: ReminderDaySlot | null;
  isSelected: boolean;
  onOpenDay: () => void;
  onEdit: (reminderId: string) => void;
};

export type ReminderTimeSelectProps = {
  selectedTime: string;
  summaryLabel: string;
  listLabel?: string;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
};

export type ReminderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: {
    title: string;
    description: string;
    reminderTime: string;
    daysOfWeek: string[];
    isDisabled: boolean;
    disabledUntil: string;
  };
  onFieldChange: (field: string, value: string | boolean | string[]) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  submitting: boolean;
  isEditing: boolean;
};

export type ReminderDayTogglesProps = {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  disabled?: boolean;
};
