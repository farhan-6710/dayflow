import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUserId } from "@/features/auth/AuthProvider";
import { confirm } from "@/lib/confirm";
import { useAction } from "@/lib/query";
import { createTodo, deleteTodo, fetchTodos, reorderTodos, updateTodo, type CreateTodoInput, type UpdateTodoInput } from "@/services/todosService";
import type { Todo } from "@/shared/types/types";

export function useTodos() {
  const userId = useUserId();
  return useQuery({ queryKey: ["todos"], queryFn: () => fetchTodos(userId) });
}

export function useTodoActions() {
  const userId = useUserId();
  const client = useQueryClient();

  const create = useAction((input: CreateTodoInput) => createTodo(userId, input), {
    success: "Todo added.",
    failure: "Couldn't add the todo.",
    invalidate: ["todos"],
    quietError: true,
  });
  const update = useAction(({ id, updates }: { id: string; updates: UpdateTodoInput }) => updateTodo(id, updates), {
    success: "Todo saved.",
    failure: "Couldn't save the todo.",
    invalidate: ["todos"],
    quietError: true,
  });
  const setStatus = useAction(({ id, status }: { id: string; status: Todo["status"] }) => updateTodo(id, { status }), {
    failure: "Couldn't update the todo.",
    invalidate: ["todos"],
  });
  const remove = useAction((id: string) => deleteTodo(id), {
    success: "Todo deleted.",
    failure: "Couldn't delete the todo.",
    invalidate: ["todos"],
  });
  const reorder = useAction((orderedIds: string[]) => reorderTodos(orderedIds), {
    failure: "Couldn't save the new order.",
    invalidate: ["todos"],
  });

  return {
    create,
    update,
    toggle: (todo: Todo) => {
      const status = todo.status === "completed" ? "pending" : "completed";
      client.setQueryData<Todo[]>(["todos"], (todos) => todos?.map((item) => (item.id === todo.id ? { ...item, status } : item)));
      setStatus.mutate({ id: todo.id, status });
    },
    confirmDelete: async (todo: Todo) => {
      if (await confirm({ title: `Delete "${todo.title}"?`, message: "This can't be undone.", confirmLabel: "Delete" })) remove.mutate(todo.id);
    },
    saveOrder: (orderedIds: string[]) => {
      const positions = new Map(orderedIds.map((id, index) => [id, index + 1]));
      client.setQueryData<Todo[]>(["todos"], (todos) =>
        todos?.map((todo) => ({ ...todo, sort_order: positions.get(todo.id) ?? todo.sort_order })).sort((a, b) => a.sort_order - b.sort_order),
      );
      reorder.mutate(orderedIds);
    },
  };
}
