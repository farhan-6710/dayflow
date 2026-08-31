import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { fetchProjects, type Project } from "@/services/projectsService";
import { fetchTasks, createTask, updateTask, deleteTask, type Task } from "@/services/tasksService";
import { DEFAULT_TASK_TIME } from "@/features/workspace/tasks/constants/tasksCalendar";
import { isClosedTaskStatus } from "@/features/workspace/tasks/constants/taskStatus";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("medium");
  const [taskStatus, setTaskStatus] = useState<Task["status"]>("todo");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskDueTime, setTaskDueTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleOpenEditDialog = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description || "");
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setTaskDueDate(task.due_date || "");
    setTaskDueTime(task.due_time || "");
    setDialogOpen(true);
  };

  const handleDueDateChange = (nextDate: string) => {
    setTaskDueDate(nextDate);
    if (!nextDate) {
      setTaskDueTime("");
      return;
    }
    if (!taskDueTime) {
      setTaskDueTime(DEFAULT_TASK_TIME);
    }
  };

  const handleClearDueDateTime = () => {
    setTaskDueDate("");
    setTaskDueTime("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !taskTitle.trim() || !editingTask) return;

    try {
      setSubmitting(true);
      const updated = await updateTask(editingTask.id, {
        title: taskTitle.trim(),
        description: taskDesc.trim() || null,
        priority: taskPriority,
        status: taskStatus,
        due_date: taskDueDate || null,
        due_time: taskDueDate ? taskDueTime || null : null,
      });
      setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? updated : task)));
      setDialogOpen(false);
      showToast("success", "Task updated successfully");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      showToast("success", "Task deleted permanently");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete task");
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
    user,
    loading,
    stats,
    tasks,
    urgentTasks,
    quickTaskTitle,
    setQuickTaskTitle,
    creating,
    handleCreateQuickTask,
    dialogOpen,
    setDialogOpen,
    editingTask,
    taskTitle,
    setTaskTitle,
    taskDesc,
    setTaskDesc,
    taskPriority,
    setTaskPriority,
    taskStatus,
    setTaskStatus,
    taskDueDate,
    taskDueTime,
    setTaskDueTime,
    submitting,
    handleOpenEditDialog,
    handleDueDateChange,
    handleClearDueDateTime,
    handleSubmit,
    handleDeleteTask,
    refresh: loadData,
  };
}
