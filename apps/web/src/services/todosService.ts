import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export type TodoStatus = "pending" | "completed";

export type Todo = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CreateTodoInput = {
  title: string;
  description?: string | null;
};

export type UpdateTodoInput = Partial<
  Pick<Todo, "title" | "description" | "status">
>;

function sortByOrder(a: Todo, b: Todo) {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return a.created_at.localeCompare(b.created_at);
}

export async function fetchTodos(userId: string): Promise<Todo[]> {
  const { data, error } = await supabase
    .from(DB.TODOS.TABLE)
    .select(DB.TODOS.SELECT)
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data as Todo[]) ?? []).slice().sort(sortByOrder);
}

export async function createTodo(
  userId: string,
  input: CreateTodoInput,
): Promise<Todo> {
  const { data: pendingRows, error: pendingError } = await supabase
    .from(DB.TODOS.TABLE)
    .select("id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("sort_order", { ascending: true });

  if (pendingError) throw pendingError;

  const { data, error } = await supabase
    .from(DB.TODOS.TABLE)
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description ?? null,
      status: "pending",
      sort_order: 1,
    })
    .select(DB.TODOS.SELECT)
    .single();

  if (error) throw error;

  const created = data as Todo;
  const orderedIds = [
    created.id,
    ...((pendingRows as { id: string }[] | null) ?? []).map((row) => row.id),
  ];
  await reorderTodos(orderedIds);

  return { ...created, sort_order: 1 };
}

export async function updateTodo(
  id: string,
  updates: UpdateTodoInput,
): Promise<Todo> {
  const { data, error } = await supabase
    .from(DB.TODOS.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.TODOS.SELECT)
    .single();

  if (error) throw error;
  return data as Todo;
}

export async function reorderTodos(orderedIds: string[]): Promise<void> {
  if (orderedIds.length === 0) return;

  const results = await Promise.all(
    orderedIds.map(async (id, index) => {
      const { error } = await supabase
        .from(DB.TODOS.TABLE)
        .update({ sort_order: index + 1 })
        .eq("id", id);
      return error;
    }),
  );

  const firstError = results.find((error) => error != null);
  if (firstError) throw firstError;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase.from(DB.TODOS.TABLE).delete().eq("id", id);

  if (error) throw error;
}
