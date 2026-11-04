import type { Task, TaskPriority, TaskStatus } from "@/shared/types/types";
import type { ThemeColors } from "@/theme/ThemeProvider";
import type { PillTone } from "@/ui/StatusPill";

export const TASK_STATUS: Record<TaskStatus, { label: string; tone: PillTone; color: keyof ThemeColors }> = {
  todo: { label: "To do", tone: "muted", color: "muted-foreground" },
  in_progress: { label: "In progress", tone: "progress", color: "chart-1" },
  done: { label: "Completed", tone: "success", color: "success" },
  missed: { label: "Missed", tone: "destructive", color: "destructive" },
};

export const TASK_STATUS_OPTIONS = (Object.keys(TASK_STATUS) as TaskStatus[]).map((value) => ({ value, label: TASK_STATUS[value].label }));

export const TASK_PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function sortByOrder(tasks: Task[]) {
  return [...tasks].sort((a, b) => a.sort_order - b.sort_order);
}
