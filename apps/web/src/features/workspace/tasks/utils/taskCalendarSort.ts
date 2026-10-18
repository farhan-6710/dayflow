import type { Task } from "@/services/tasksService";

const PRIORITY_ORDER: Record<Task["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function compareBySortOrder(a: Task, b: Task): number {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  if (byPriority !== 0) return byPriority;
  return a.created_at.localeCompare(b.created_at);
}

/** @deprecated Prefer compareBySortOrder for day lists. */
export function compareByPriority(a: Task, b: Task): number {
  return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
}
