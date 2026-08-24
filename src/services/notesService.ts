import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export type Note = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  body: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateNoteInput = {
  project_id?: string | null;
  title: string;
  body?: string | null;
};

export async function fetchNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .select(DB.NOTES.SELECT)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as Note[]) ?? [];
}

export async function fetchNotesByProject(projectId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .select(DB.NOTES.SELECT)
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as Note[]) ?? [];
}

export async function createNote(userId: string, input: CreateNoteInput): Promise<Note> {
  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .insert({
      user_id: userId,
      project_id: input.project_id ?? null,
      title: input.title,
      body: input.body ?? null,
    })
    .select(DB.NOTES.SELECT)
    .single();

  if (error) throw error;
  return data as Note;
}

export async function updateNote(
  id: string,
  updates: Partial<Pick<Note, "title" | "body">>
): Promise<Note> {
  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.NOTES.SELECT)
    .single();

  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.NOTES.TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
}
