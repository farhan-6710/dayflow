import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Task, TaskPriority, TaskStatus } from "@/shared/types/types";

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

/**
 * New tasks go to the top of their day. It takes a lower sort_order instead of renumbering
 * the day, because a renumber bumps siblings' `updated_at`, which the completion chart reads.
 */
export async function createTask(userId: string, input: CreateTaskInput): Promise<Task> {
  let topQuery = supabase.from(DB.TASKS.TABLE).select("sort_order").eq("user_id", userId);
  topQuery = input.due_date ? topQuery.eq("due_date", input.due_date) : topQuery.is("due_date", null);
  const { data: topRows, error: topError } = await topQuery.order("sort_order", { ascending: true }).limit(1);

  if (topError) throw topError;
  const topOrder = (topRows as { sort_order: number | null }[] | null)?.[0]?.sort_order ?? 1;

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
      sort_order: topOrder - 1,
    })
    .select(DB.TASKS.SELECT)
    .single();

  if (error) throw error;
  return normalizeTask(data as Task);
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
