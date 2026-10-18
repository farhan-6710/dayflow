import type { FormEvent } from "react";
import type { Task, TaskStatus } from "@/services/tasksService";

export type TaskTimeSelectProps = {
  selectedTime: string;
  summaryLabel: string;
  listLabel?: string;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
};

export type TaskDateTimePickerProps = {
  label?: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onClear?: () => void;
  disabled?: boolean;
};

export type TaskListItemProps = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
};

export type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  submitting: boolean;
  title: string;
  description: string;
  priority: Task["priority"];
  status: TaskStatus;
  dueDate: string;
  dueTime: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: Task["priority"]) => void;
  onStatusChange: (value: TaskStatus) => void;
  onDueDateChange: (value: string) => void;
  onDueTimeChange: (value: string) => void;
  onClearDueDateTime: () => void;
  onSubmit: (event: FormEvent) => void;
  onDelete?: () => void | Promise<void>;
};

export type TasksWeekDayCellProps = {
  year: number;
  month: number;
  dateNumber: number;
  tasks: Task[];
  isSelected: boolean;
  isToday: boolean;
  isOutsideMonth?: boolean;
  onSelect: () => void;
};

export type TasksWeeksTableProps = {
  year: number;
  month: number;
  weeks: import("@/features/workspace/reminders/types/types").Week[];
  selectedDate: Date;
  tasksByDateKey: Map<string, Task[]>;
  onSelectMonth: (date: Date) => void;
  onSelectDay: (year: number, month: number, date: number) => void;
};

export type TasksDayPanelProps = {
  date: Date;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
};
