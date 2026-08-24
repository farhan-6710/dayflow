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
};

export type TasksWeekDayCellProps = {
  year: number;
  month: number;
  dateNumber: number;
  tasks: Task[];
  isSelected: boolean;
  statusColors: Record<TaskStatus, string>;
  statusText: Record<TaskStatus, string>;
  onOpenDay: () => void;
  onEdit: (taskId: string) => void;
};

export type TasksWeeksTableProps = {
  year: number;
  month: number;
  weeks: import("@/features/reminders/types/types").Week[];
  selectedDate: Date;
  tasksByDateKey: Map<string, Task[]>;
  onOpenDay: (year: number, month: number, date: number) => void;
  onEdit: (taskId: string) => void;
  statusColors: Record<TaskStatus, string>;
  statusText: Record<TaskStatus, string>;
};
