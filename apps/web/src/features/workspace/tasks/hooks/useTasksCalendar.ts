import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import type { TaskFormValues } from "@/features/workspace/tasks/types/components";
import { createTask, deleteTask, fetchTasks, reorderTasks, updateTask } from "@/services/tasksService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { Task } from "@/shared/types/types";
import { parseDateValue, serializeDateValue } from "@/shared/utils/dateValue";
import { reorderItems } from "@/shared/utils/reorderItems";
import { showToast } from "@/shared/utils/showToast";

const DATE_PARAM = "date";

export function useTasksCalendar() {
  const { user } = useAuth();
  const userId = user?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const dateParam = searchParams.get(DATE_PARAM);
  const selectedDate = useMemo(() => parseDateValue(dateParam) ?? new Date(), [dateParam]);
  const selectedKey = serializeDateValue(selectedDate);

  function selectDate(date: Date) {
    setSearchParams({ [DATE_PARAM]: serializeDateValue(date) }, { replace: true });
  }

  const loader = useCallback(() => fetchTasks(userId ?? ""), [userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load your tasks.");

  const tasksByDate = useMemo(() => {
    const byDate = new Map<string, Task[]>();
    for (const task of data ?? []) {
      if (task.due_date) {
        byDate.set(task.due_date, [...(byDate.get(task.due_date) ?? []), task]);
      }
    }
    for (const tasks of byDate.values()) {
      tasks.sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));
    }
    return byDate;
  }, [data]);

  const selectedTasks = tasksByDate.get(selectedKey) ?? [];

  function openCreate() {
    setEditingTask(null);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  /** Throws on failure so the dialog stays open. */
  async function saveTask(taskId: string | null, values: TaskFormValues) {
    const input = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      priority: values.priority,
      status: values.status,
      due_date: values.dueDate || null,
      due_time: values.dueDate ? values.dueTime || null : null,
    };
    try {
      if (taskId) {
        const updated = await updateTask(taskId, input);
        setData((tasks) => tasks.map((task) => (task.id === updated.id ? updated : task)));
        showToast("success", "Task updated.");
      } else {
        await createTask(userId ?? "", input);
        reload();
        showToast("success", "Task added.");
      }
    } catch (saveError) {
      console.error("Failed to save task:", saveError);
      showToast("error", "Couldn't save the task. Please try again.");
      throw saveError;
    }
  }

  async function confirmDelete() {
    if (!taskToDelete) {
      return;
    }
    setDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setData((tasks) => tasks.filter((task) => task.id !== taskToDelete.id));
      setTaskToDelete(null);
      showToast("success", "Task deleted.");
    } catch (deleteError) {
      console.error("Failed to delete task:", deleteError);
      showToast("error", "Couldn't delete the task. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  /** Order is per day, so only this day's tasks are renumbered. */
  async function reorderDay(orderedIds: string[]) {
    const next = reorderItems(selectedTasks, orderedIds);
    const positions = new Map(next.items.map((task) => [task.id, task.sort_order]));
    const applyOrder = (task: Task) => ({ ...task, sort_order: positions.get(task.id) ?? task.sort_order });
    const previous = data ?? [];
    setData((tasks) => tasks.map(applyOrder));
    try {
      await reorderTasks(next.orderedIds);
    } catch (reorderError) {
      console.error("Failed to save task order:", reorderError);
      setData(() => previous);
      showToast("error", "Couldn't save the new order. Check your connection and try again.");
    }
  }

  return {
    selectedDate,
    selectedKey,
    selectDate,
    tasksByDate,
    selectedTasks,
    loading,
    error,
    reload,
    dialogOpen,
    setDialogOpen,
    editingTask,
    taskToDelete,
    setTaskToDelete,
    deleting,
    openCreate,
    openEdit,
    saveTask,
    confirmDelete,
    reorderDay,
  };
}
