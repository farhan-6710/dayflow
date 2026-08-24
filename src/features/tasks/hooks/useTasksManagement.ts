import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { DEFAULT_TASK_TIME } from "@/features/tasks/constants/tasksCalendar";
import { fetchTasks, createTask, updateTask, deleteTask, type Task } from "@/services/tasksService";
import { showToast } from "@/shared/utils/showToast";

export function useTasksManagement() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("medium");
  const [taskStatus, setTaskStatus] = useState<Task["status"]>("todo");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskDueTime, setTaskDueTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setTasks(await fetchTasks(user.id));
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleOpenCreateDialog = (dueDate?: string) => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskDesc("");
    setTaskPriority("medium");
    setTaskStatus("todo");
    setTaskDueDate(dueDate ?? "");
    setTaskDueTime(dueDate ? DEFAULT_TASK_TIME : "");
    setDialogOpen(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !taskTitle.trim()) return;

    try {
      setSubmitting(true);
      const input = {
        title: taskTitle.trim(),
        description: taskDesc.trim() || null,
        priority: taskPriority,
        status: taskStatus,
        due_date: taskDueDate || null,
        due_time: taskDueDate ? taskDueTime || null : null,
      };

      if (editingTask) {
        const updated = await updateTask(editingTask.id, input);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
        showToast("success", "Task updated successfully");
      } else {
        const created = await createTask(user.id, input);
        setTasks((prev) => [created, ...prev]);
        showToast("success", "Task created successfully");
      }
      setDialogOpen(false);
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
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast("success", "Task deleted permanently");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete task");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchPriority = filterPriority ? task.priority === filterPriority : true;
      const matchStatus =
        filterStatus.length === 0 || filterStatus.includes(task.status);
      return matchSearch && matchPriority && matchStatus;
    });
  }, [tasks, searchTerm, filterPriority, filterStatus]);

  return {
    tasks: filteredTasks,
    loading,
    dialogOpen,
    setDialogOpen,
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
    handleDueDateChange,
    handleClearDueDateTime,
    submitting,
    editingTask,
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleSubmit,
    handleDeleteTask,
    refresh: loadData,
  };
}
