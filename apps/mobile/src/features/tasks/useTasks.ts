import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUserId } from "@/features/auth/AuthProvider";
import { useAction } from "@/lib/query";
import {
  createTask,
  deleteTask,
  fetchTasks,
  reorderTasks,
  updateTask,
  type CreateTaskInput,
} from "@/services/tasksService";
import type { Task } from "@/shared/types/types";
import { confirm } from "@/lib/confirm";

export function useTasks() {
  const userId = useUserId();
  return useQuery({ queryKey: ["tasks"], queryFn: () => fetchTasks(userId) });
}

export function useTaskActions() {
  const userId = useUserId();
  const client = useQueryClient();

  const create = useAction((input: CreateTaskInput) => createTask(userId, input), {
    success: "Task added.",
    failure: "Couldn't add the task.",
    invalidate: ["tasks"],
    quietError: true,
  });
  const update = useAction(({ id, updates }: { id: string; updates: Partial<CreateTaskInput> }) => updateTask(id, updates), {
    success: "Task saved.",
    failure: "Couldn't save the task.",
    invalidate: ["tasks"],
    quietError: true,
  });
  const setStatus = useAction(({ task, status }: { task: Task; status: Task["status"] }) => updateTask(task.id, { status }), {
    success: "Status updated.",
    failure: "Couldn't update the status.",
    invalidate: ["tasks"],
  });
  const remove = useAction((id: string) => deleteTask(id), {
    success: "Task deleted.",
    failure: "Couldn't delete the task.",
    invalidate: ["tasks"],
  });
  const reorder = useAction((orderedIds: string[]) => reorderTasks(orderedIds), {
    failure: "Couldn't save the new order.",
    invalidate: ["tasks"],
  });

  return {
    create,
    update,
    toggleDone: (task: Task) => {
      const status = task.status === "done" ? "todo" : "done";
      client.setQueryData<Task[]>(["tasks"], (tasks) => tasks?.map((item) => (item.id === task.id ? { ...item, status } : item)));
      setStatus.mutate({ task, status });
    },
    confirmDelete: async (task: Task) => {
      const ok = await confirm({ title: `Delete "${task.title}"?`, message: "This can't be undone.", confirmLabel: "Delete" });
      if (ok) remove.mutate(task.id);
      return ok;
    },
    /** Applies a day's new order right away, then saves it. */
    saveOrder: (orderedIds: string[]) => {
      const positions = new Map(orderedIds.map((id, index) => [id, index + 1]));
      client.setQueryData<Task[]>(["tasks"], (tasks) =>
        tasks?.map((task) => (positions.has(task.id) ? { ...task, sort_order: positions.get(task.id) ?? task.sort_order } : task)),
      );
      reorder.mutate(orderedIds);
    },
  };
}
