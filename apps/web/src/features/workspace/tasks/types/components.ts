import type { Task, TaskPriority, TaskStatus } from "@/shared/types/types";

export type TasksMonthBarProps = {
  month: Date;
  onSelectDate: (date: Date) => void;
};

export type TasksCalendarGridProps = {
  month: Date;
  selectedDate: Date;
  tasksByDate: Map<string, Task[]>;
  onSelectDate: (date: Date) => void;
};

export type TasksDayPanelProps = {
  date: Date;
  tasks: Task[];
  onAdd: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onReorder: (orderedIds: string[]) => void;
};

export type TaskRowProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export type TaskFormValues = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  dueTime: string;
};

export type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null creates a new task on `defaultDate`. */
  task: Task | null;
  defaultDate: string;
  onSave: (taskId: string | null, values: TaskFormValues) => Promise<void>;
};
