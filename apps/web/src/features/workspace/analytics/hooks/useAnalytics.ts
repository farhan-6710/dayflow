import { useCallback, useMemo } from "react";

import { fetchNotes } from "@/services/notesService";
import { fetchProjects } from "@/services/projectsService";
import { fetchTasks } from "@/services/tasksService";
import { TASK_STATUS_LABELS } from "@/shared/constants/taskStatus";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { TaskStatus } from "@/shared/types/types";

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "var(--chart-4)",
  in_progress: "var(--chart-1)",
  done: "var(--primary)",
  missed: "var(--destructive)",
};

export function useAnalytics() {
  const { user } = useAuth();
  const userId = user?.id;

  const loader = useCallback(async () => {
    const [tasks, projects, notes] = await Promise.all([
      fetchTasks(userId ?? ""),
      fetchProjects(userId ?? ""),
      fetchNotes(userId ?? ""),
    ]);
    return { tasks, projects, notes };
  }, [userId]);
  const { data, loading, error, reload } = useLoadData(userId ? loader : null, "Couldn't load your analytics.");

  return useMemo(() => {
    const tasks = data?.tasks ?? [];
    const notes = data?.notes ?? [];
    const completed = tasks.filter((task) => task.status === "done").length;

    const statusData = (Object.keys(TASK_STATUS_LABELS) as TaskStatus[])
      .map((status) => ({
        name: TASK_STATUS_LABELS[status],
        value: tasks.filter((task) => task.status === status).length,
        color: STATUS_COLORS[status],
      }))
      .filter((row) => row.value > 0);

    const notesByProject = (data?.projects ?? [])
      .map((project) => ({
        name: project.name,
        count: notes.filter((note) => note.project_id === project.id).length,
      }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);
    const unassigned = notes.filter((note) => !note.project_id).length;

    return {
      loading,
      error,
      reload,
      totalTasks: tasks.length,
      completedTasks: completed,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
      totalNotes: notes.length,
      statusData,
      notesByProject: unassigned > 0 ? [...notesByProject, { name: "No project", count: unassigned }] : notesByProject,
    };
  }, [data, loading, error, reload]);
}
