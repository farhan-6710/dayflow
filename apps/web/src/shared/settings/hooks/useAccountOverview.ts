import { useCallback, useMemo } from "react";

import { fetchProjects } from "@/services/projectsService";
import { fetchReminders } from "@/services/remindersService";
import { fetchTasks } from "@/services/tasksService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";

export function useAccountOverview() {
  const { user } = useAuth();
  const userId = user?.id;

  const loader = useCallback(async () => {
    const [tasks, projects, reminders] = await Promise.all([
      fetchTasks(userId ?? ""),
      fetchProjects(userId ?? ""),
      fetchReminders(userId ?? ""),
    ]);
    return { tasks, projects, reminders };
  }, [userId]);

  const { data, loading, error, reload } = useLoadData(
    userId ? loader : null,
    "Couldn't load account overview.",
  );

  const stats = useMemo(() => {
    const tasks = data?.tasks ?? [];
    const pendingTasks = tasks.filter(
      (task) => task.status !== "done" && task.status !== "missed",
    ).length;
    return {
      pendingTasks,
      projects: data?.projects.length ?? 0,
      reminders: data?.reminders.length ?? 0,
    };
  }, [data]);

  return { stats, loading, error, reload, memberSince: user?.created_at ?? null };
}
