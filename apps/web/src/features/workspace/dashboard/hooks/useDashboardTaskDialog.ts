import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { User } from "@supabase/supabase-js";

import { DEFAULT_TASK_TIME } from "@/features/workspace/tasks/constants/tasksCalendar";
import { updateTask, type Task } from "@/services/tasksService";
import { showToast } from "@/shared/utils/showToast";

export function useDashboardTaskDialog(
  user: User | null,
  setTasks: Dispatch<SetStateAction<Task[]>>,
) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<Task["priority"]>("medium");
  const [taskStatus, setTaskStatus] = useState<Task["status"]>("todo");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskDueTime, setTaskDueTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (event: FormEvent) => {
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
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      setDialogOpen(false);
      showToast("success", "Task updated successfully");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}
