import type { TaskStatus } from "@/services/tasksService";

export const TASK_STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Completed" },
  { value: "missed", label: "Missed" },
];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Completed",
  missed: "Missed",
};

export const TASK_STATUS_DOT_COLORS: Record<TaskStatus, string> = {
  todo: "bg-muted-foreground",
  in_progress: "bg-primary",
  done: "bg-green-500",
  missed: "bg-status-missed",
};

export const TASK_STATUS_TEXT_COLORS: Record<TaskStatus, string> = {
  todo: "text-muted-foreground",
  in_progress: "text-primary",
  done: "text-green-600",
  missed: "text-status-missed",
};

export const TASK_STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  done: "bg-emerald-500/10 text-emerald-600",
  missed: "bg-status-missed/15 text-status-missed",
};

export const TASK_STATUS_LEGEND = TASK_STATUS_OPTIONS.map((option) => ({
  status: option.value,
  label: option.label,
}));

export function isClosedTaskStatus(status: TaskStatus): boolean {
  return status === "done" || status === "missed";
}
