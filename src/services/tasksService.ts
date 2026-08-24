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

export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .select(DB.TASKS.SELECT)
    .eq("user_id", userId)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Task[]) ?? [];
}

export async function createTask(userId: string, input: CreateTaskInput): Promise<Task> {
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
    })
    .select(DB.TASKS.SELECT)
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: string, updates: Partial<CreateTaskInput>): Promise<Task> {
  const { data, error } = await supabase
    .from(DB.TASKS.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.TASKS.SELECT)
    .single();

  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from(DB.TASKS.TABLE).delete().eq("id", id);
  if (error) throw error;
}
