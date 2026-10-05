import { useMemo } from "react";

import { isClosedTaskStatus } from "@/features/workspace/tasks/constants/taskStatus";
import type { Project } from "@/services/projectsService";
import type { Task } from "@/services/tasksService";

export function useDashboardStats(
  filteredTasks: Task[],
  filteredProjects: Project[],
  allTasks: Task[],
) {
  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((t) => t.status === "done").length;
    const missed = filteredTasks.filter((t) => t.status === "missed").length;
    const pending = total - completed - missed;
    const todayStr = new Date().toISOString().split("T")[0];
    const overdue = filteredTasks.filter(
      (t) => !isClosedTaskStatus(t.status) && t.due_date && t.due_date < todayStr,
    ).length;

    return {
      total,
      completed,
      pending,
      overdue,
      projectsCount: filteredProjects.length,
    };
  }, [filteredProjects.length, filteredTasks]);

  const urgentTasks = useMemo(() => {
    return allTasks
      .filter((t) => !isClosedTaskStatus(t.status))
      .slice(0, 5);
  }, [allTasks]);

  return { stats, urgentTasks };
}
