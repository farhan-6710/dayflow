import type { TaskPriority, TaskStatus } from "@/shared/types/types";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Completed",
  missed: "Missed",
};

/** Tokens per DESIGN.md: to do muted, in progress coral, done primary, missed destructive. */
export const TASK_STATUS_DOT_CLASS: Record<TaskStatus, string> = {
  todo: "bg-muted-foreground/60",
  in_progress: "bg-chart-1",
  done: "bg-primary",
  missed: "bg-destructive",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
