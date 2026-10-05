import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { useDashboardStats } from "@/features/workspace/dashboard/hooks/useDashboardStats";
import { useDashboardTaskDialog } from "@/features/workspace/dashboard/hooks/useDashboardTaskDialog";
import { fetchProjects, type Project } from "@/services/projectsService";
import { deleteTask, fetchTasks, type Task } from "@/services/tasksService";
import type { DateFiltersFilterState } from "@/shared/types/components";
import { resolveDateFiltersRange } from "@/shared/utils/dateFiltersUtils";
import { showToast } from "@/shared/utils/showToast";

function isDateInRange(isoDate: string, range: { from: Date; to: Date } | null) {
  if (!range) return true;
  const date = new Date(isoDate);
  return !Number.isNaN(date.getTime()) && date >= range.from && date <= range.to;
}

export function useDashboard(filter: DateFiltersFilterState) {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const [allProjects, allTasks] = await Promise.all([
          fetchProjects(userId),
          fetchTasks(userId),
        ]);
        if (!cancelled) {
          setProjects(allProjects);
          setTasks(allTasks);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Failed to load dashboard data");
          showToast("error", "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setError(null);
      const [allProjects, allTasks] = await Promise.all([
        fetchProjects(user.id),
        fetchTasks(user.id),
      ]);
      setProjects(allProjects);
      setTasks(allTasks);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
      showToast("error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const resolvedRange = useMemo(() => resolveDateFiltersRange(filter), [filter]);

  const filteredProjects = useMemo(
    () => projects.filter((p) => isDateInRange(p.created_at, resolvedRange)),
    [projects, resolvedRange],
  );

  const filteredTasks = useMemo(
    () => tasks.filter((t) => isDateInRange(t.created_at, resolvedRange)),
    [tasks, resolvedRange],
  );

  const { stats, urgentTasks } = useDashboardStats(filteredTasks, filteredProjects, tasks);
  const dialogProps = useDashboardTaskDialog(user, setTasks);

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      showToast("success", "Task deleted permanently");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete task");
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    stats,
    tasks,
    urgentTasks,
    handleDeleteTask,
    refresh,
    ...dialogProps,
  };
}
