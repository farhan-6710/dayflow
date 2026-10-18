import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  reorderTodos,
  updateTodo,
  type Todo,
  type TodoStatus,
} from "@/services/todosService";
import { showToast } from "@/shared/utils/showToast";

function bySortOrder(a: Todo, b: Todo) {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return a.created_at.localeCompare(b.created_at);
}

export function useDashboardTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyTodoId, setBusyTodoId] = useState<string | null>(null);
  const [exitingTodoId, setExitingTodoId] = useState<string | null>(null);
  const [completedOpen, setCompletedOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>("pending");
  const [submitting, setSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    let cancelled = false;

    async function load() {
      try {
        const rows = await fetchTodos(userId);
        if (!cancelled) setTodos(rows);
      } catch (err) {
        console.error(err);
        if (!cancelled) showToast("error", "Failed to load todos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const pendingTodos = useMemo(
    () =>
      todos
        .filter(
          (todo) => todo.status === "pending" || todo.id === exitingTodoId,
        )
        .slice()
        .sort(bySortOrder),
    [exitingTodoId, todos],
  );
  const completedTodos = useMemo(
    () =>
      todos
        .filter((todo) => todo.status === "completed")
        .slice()
        .sort(bySortOrder),
    [todos],
  );

  const resetForm = useCallback(() => {
    setEditingTodo(null);
    setTitle("");
    setDescription("");
    setStatus("pending");
  }, []);

  const handleOpenAdd = useCallback(() => {
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setStatus(todo.status);
    setDialogOpen(true);
  }, []);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open) resetForm();
    },
    [resetForm],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!user || !title.trim()) return;

      try {
        setSubmitting(true);
        if (editingTodo) {
          const updated = await updateTodo(editingTodo.id, {
            title: title.trim(),
            description: description.trim() || null,
            status,
          });
          setTodos((prev) =>
            prev.map((todo) => (todo.id === updated.id ? updated : todo)),
          );
          showToast("success", "Todo updated");
        } else {
          const created = await createTodo(user.id, {
            title: title.trim(),
            description: description.trim() || null,
          });
          setTodos((prev) => {
            const bumped = prev.map((todo) =>
              todo.status === "pending"
                ? { ...todo, sort_order: todo.sort_order + 1 }
                : todo,
            );
            return [created, ...bumped];
          });
          showToast("success", "Todo added");
        }
        setDialogOpen(false);
        resetForm();
      } catch (err) {
        console.error(err);
        showToast("error", editingTodo ? "Failed to update todo" : "Failed to add todo");
      } finally {
        setSubmitting(false);
      }
    },
    [description, editingTodo, resetForm, status, title, user],
  );

  const handleToggle = useCallback(async (todo: Todo) => {
    if (busyTodoId || exitingTodoId) return;

    const nextStatus: TodoStatus =
      todo.status === "pending" ? "completed" : "pending";

    try {
      setBusyTodoId(todo.id);
      const updated = await updateTodo(todo.id, { status: nextStatus });

      if (todo.status === "pending" && nextStatus === "completed") {
        setExitingTodoId(todo.id);
        setTodos((prev) =>
          prev.map((row) => (row.id === updated.id ? updated : row)),
        );
      } else {
        setTodos((prev) =>
          prev.map((row) => (row.id === updated.id ? updated : row)),
        );
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to update todo");
    } finally {
      setBusyTodoId(null);
    }
  }, [busyTodoId, exitingTodoId]);

  const handleExitComplete = useCallback((todoId: string) => {
    setExitingTodoId((current) => (current === todoId ? null : current));
  }, []);

  const handleReorderPending = useCallback(async (orderedIds: string[]) => {
    if (orderedIds.length === 0) return;

    let snapshot: Todo[] = [];
    setTodos((prev) => {
      snapshot = prev;
      const byId = new Map(prev.map((todo) => [todo.id, todo]));
      const nextPending = orderedIds.flatMap((id, index) => {
        const todo = byId.get(id);
        if (!todo) return [];
        return [{ ...todo, sort_order: index + 1 }];
      });
      const rest = prev.filter((todo) => !orderedIds.includes(todo.id));
      return [...nextPending, ...rest];
    });

    try {
      await reorderTodos(orderedIds);
    } catch (err) {
      console.error(err);
      setTodos(snapshot);
      showToast(
        "error",
        "Couldn't save the new order. Check your connection and try again.",
      );
    }
  }, []);

  const handleAskDelete = useCallback((todo: Todo) => {
    setTodoToDelete(todo);
    setDeleteOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!todoToDelete) return;

    try {
      setDeleting(true);
      await deleteTodo(todoToDelete.id);
      setTodos((prev) => prev.filter((todo) => todo.id !== todoToDelete.id));
      showToast("success", "Todo deleted");
      setDeleteOpen(false);
      setTodoToDelete(null);
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete todo");
    } finally {
      setDeleting(false);
    }
  }, [todoToDelete]);

  return {
    pendingTodos,
    completedTodos,
    loading,
    busyTodoId,
    exitingTodoId,
    completedOpen,
    setCompletedOpen,
    dialogOpen,
    handleDialogOpenChange,
    editingTodo,
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    submitting,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleToggle,
    handleExitComplete,
    handleReorderPending,
    handleAskDelete,
    deleteOpen,
    setDeleteOpen,
    deleting,
    handleConfirmDelete,
    todoToDelete,
  };
}
