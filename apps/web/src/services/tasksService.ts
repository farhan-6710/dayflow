import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export type TaskStatus = "todo" | "in_progress" | "done" | "missed";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  due_time: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  due_time?: string | null;
};

function normalizeTask(row: Task): Task {
  return { ...row, sort_order: row.sort_order ?? 0 };
}

export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .select(DB.TASKS.SELECT)
    .eq("user_id", userId)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data as Task[]) ?? []).map(normalizeTask);
}

export async function createTask(
  userId: string,
  input: CreateTaskInput,
): Promise<Task> {
  let existingQuery = supabase.from(DB.TASKS.TABLE).select("id").eq("user_id", userId);

  if (input.due_date) {
    existingQuery = existingQuery.eq("due_date", input.due_date);
  } else {
    existingQuery = existingQuery.is("due_date", null);
  }

  const { data: existingRows, error: existingError } = await existingQuery.order(
    "sort_order",
    { ascending: true },
  );

  if (existingError) throw existingError;

  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      due_date: input.due_date ?? null,
      due_time: input.due_time ?? null,
      sort_order: 1,
    })
    .select(DB.TASKS.SELECT)
    .single();

  if (error) throw error;

  const created = normalizeTask(data as Task);
  const orderedIds = [
    created.id,
    ...((existingRows as { id: string }[] | null) ?? []).map((row) => row.id),
  ];
  await reorderTasks(orderedIds);

  return { ...created, sort_order: 1 };
}

export async function updateTask(
  id: string,
  updates: Partial<CreateTaskInput>,
): Promise<Task> {
  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.TASKS.SELECT)
    .single();

  if (error) throw error;
  return normalizeTask(data as Task);
}

export async function reorderTasks(orderedIds: string[]): Promise<void> {
  if (orderedIds.length === 0) return;

  const results = await Promise.all(
    orderedIds.map(async (id, index) => {
      const { error } = await supabase
        .from(DB.TASKS.TABLE)
        .update({ sort_order: index + 1 })
        .eq("id", id);
      return error;
    }),
  );

  const firstError = results.find((error) => error != null);
  if (firstError) throw firstError;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from(DB.TASKS.TABLE).delete().eq("id", id);
  if (error) throw error;
}
