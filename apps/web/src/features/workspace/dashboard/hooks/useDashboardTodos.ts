import { useCallback, useMemo, useState } from "react";

import type { TodoFormValues } from "@/features/workspace/dashboard/types/components";
import { createTodo, deleteTodo, fetchTodos, reorderTodos, updateTodo } from "@/services/todosService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { Todo } from "@/shared/types/types";
import { reorderItems } from "@/shared/utils/reorderItems";
import { showToast } from "@/shared/utils/showToast";

export function useDashboardTodos() {
  const { user } = useAuth();
  const userId = user?.id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loader = useCallback(() => fetchTodos(userId ?? ""), [userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load your todos.");

  const todos = useMemo(() => data ?? [], [data]);
  const pending = useMemo(() => todos.filter((todo) => todo.status === "pending"), [todos]);
  const completed = useMemo(() => todos.filter((todo) => todo.status === "completed"), [todos]);

  function openCreate() {
    setEditingTodo(null);
    setDialogOpen(true);
  }

  function openEdit(todo: Todo) {
    setEditingTodo(todo);
    setDialogOpen(true);
  }

  /** Throws on failure so the dialog stays open. */
  async function save(todoId: string | null, values: TodoFormValues) {
    const input = { title: values.title.trim(), description: values.description.trim() || null };
    try {
      if (todoId) {
        const updated = await updateTodo(todoId, input);
        setData((current) => current.map((todo) => (todo.id === updated.id ? updated : todo)));
        showToast("success", "Todo updated.");
      } else {
        await createTodo(userId ?? "", input);
        reload();
        showToast("success", "Todo added.");
      }
    } catch (saveError) {
      console.error("Failed to save todo:", saveError);
      showToast("error", "Couldn't save the todo. Please try again.");
      throw saveError;
    }
  }

  async function toggle(todo: Todo) {
    const status = todo.status === "pending" ? "completed" : "pending";
    setData((current) => current.map((entry) => (entry.id === todo.id ? { ...entry, status } : entry)));
    try {
      await updateTodo(todo.id, { status });
      showToast("success", status === "completed" ? "Todo completed." : "Todo reopened.");
    } catch (toggleError) {
      console.error("Failed to update todo:", toggleError);
      setData((current) => current.map((entry) => (entry.id === todo.id ? todo : entry)));
      showToast("error", "Couldn't update the todo. Please try again.");
    }
  }

  async function confirmDelete() {
    if (!todoToDelete) {
      return;
    }
    setDeleting(true);
    try {
      await deleteTodo(todoToDelete.id);
      setData((current) => current.filter((todo) => todo.id !== todoToDelete.id));
      setTodoToDelete(null);
      showToast("success", "Todo deleted.");
    } catch (deleteError) {
      console.error("Failed to delete todo:", deleteError);
      showToast("error", "Couldn't delete the todo. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  async function reorder(orderedIds: string[]) {
    const previous = todos;
    const next = reorderItems(todos, orderedIds);
    setData(() => next.items);
    try {
      await reorderTodos(next.orderedIds);
    } catch (reorderError) {
      console.error("Failed to save todo order:", reorderError);
      setData(() => previous);
      showToast("error", "Couldn't save the new order. Check your connection and try again.");
    }
  }

  return {
    pending,
    completed,
    loading,
    error,
    reload,
    dialogOpen,
    setDialogOpen,
    editingTodo,
    todoToDelete,
    setTodoToDelete,
    deleting,
    openCreate,
    openEdit,
    save,
    toggle,
    confirmDelete,
    reorder,
  };
}
