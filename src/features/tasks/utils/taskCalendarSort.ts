import type { Task } from "@/services/tasksService";

const PRIORITY_ORDER: Record<Task["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function compareByPriority(a: Task, b: Task): number {
  return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
}
