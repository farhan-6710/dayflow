import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchProjects, type Project } from "@/services/projectsService";
import { fetchTasks, createTask, updateTask, type Task } from "@/services/tasksService";
import { isClosedTaskStatus } from "@/features/tasks/constants/taskStatus";
import { showToast } from "@/shared/utils/showToast";
import type { DateFiltersFilterState } from "@/shared/types/components";
import { resolveDateFiltersRange } from "@/shared/utils/dateFiltersUtils";

function isDateInRange(isoDate: string, range: { from: Date; to: Date } | null) {
  if (!range) {
    return true;
  }

  const date = new Date(isoDate);
  return !Number.isNaN(date.getTime()) && date >= range.from && date <= range.to;
}

export function useDashboard(filter: DateFiltersFilterState) {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [allProjects, allTasks] = await Promise.all([
        fetchProjects(user.id),
        fetchTasks(user.id),
      ]);
      setProjects(allProjects);
      setTasks(allTasks);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const resolvedRange = useMemo(() => resolveDateFiltersRange(filter), [filter]);
  const filteredProjects = useMemo(
    () => projects.filter((project) => isDateInRange(project.created_at, resolvedRange)),
    [projects, resolvedRange],
  );
  const filteredTasks = useMemo(
    () => tasks.filter((task) => isDateInRange(task.created_at, resolvedRange)),
    [tasks, resolvedRange],
  );

  const handleToggleTaskStatus = async (taskId: string, currentStatus: Task["status"]) => {
    const nextStatus = currentStatus === "done" ? "todo" : "done";
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
      );
      await updateTask(taskId, { status: nextStatus });
      showToast("success", `Task marked as ${nextStatus === "done" ? "completed" : "pending"}`);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to update task status");
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: currentStatus } : t))
      );
    }
  };

  const handleCreateQuickTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !quickTaskTitle.trim()) return;
    try {
      setCreating(true);
      const newTask = await createTask(user.id, {
        title: quickTaskTitle.trim(),
        priority: "medium",
        status: "todo",
      });
      setTasks((prev) => [newTask, ...prev]);
      setQuickTaskTitle("");
      showToast("success", "Task created successfully!");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to create quick task");
    } finally {
      setCreating(false);
    }
  };

  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((t) => t.status === "done").length;
    const missed = filteredTasks.filter((t) => t.status === "missed").length;
    const pending = total - completed - missed;
    const todayStr = new Date().toISOString().split("T")[0];
    const overdue = filteredTasks.filter(
      (t) => !isClosedTaskStatus(t.status) && t.due_date && t.due_date < todayStr
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
    return tasks
      .filter((t) => !isClosedTaskStatus(t.status))
      .slice(0, 5); // Just show the top 5 nearest/high priority tasks
  }, [tasks]);

  return {
    profile,
    loading,
    stats,
    tasks,
    urgentTasks,
    quickTaskTitle,
    setQuickTaskTitle,
    creating,
    handleCreateQuickTask,
    handleToggleTaskStatus,
    refresh: loadData,
  };
}
