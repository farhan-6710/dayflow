import type { NoteCategory } from "@/features/workspace/projects/constants/noteCategories";
import {
  DEFAULT_NOTE_CATEGORY,
  isNoteCategory,
} from "@/features/workspace/projects/constants/noteCategories";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export type Note = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  body: string | null;
  category: NoteCategory;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CreateNoteInput = {
  project_id?: string | null;
  title: string;
  body?: string | null;
  category?: NoteCategory;
};

function sortByOrder(a: Note, b: Note) {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return b.updated_at.localeCompare(a.updated_at);
}

function normalizeNote(row: Note): Note {
  return {
    ...row,
    sort_order: row.sort_order ?? 0,
    category: isNoteCategory(row.category) ? row.category : DEFAULT_NOTE_CATEGORY,
  };
}

export async function fetchNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .select(DB.NOTES.SELECT)
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return ((data as Note[]) ?? []).map(normalizeNote).sort(sortByOrder);
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .select(DB.NOTES.SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeNote(data as Note) : null;
}

export async function fetchNotesByProject(projectId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .select(DB.NOTES.SELECT)
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return ((data as Note[]) ?? []).map(normalizeNote).sort(sortByOrder);
}

export async function createNote(userId: string, input: CreateNoteInput): Promise<Note> {
  let existingQuery = supabase.from(DB.NOTES.TABLE).select("id");

  if (input.project_id) {
    existingQuery = existingQuery.eq("project_id", input.project_id);
  } else {
    existingQuery = existingQuery.eq("user_id", userId).is("project_id", null);
  }

  const { data: existingRows, error: existingError } = await existingQuery.order(
    "sort_order",
    { ascending: true },
  );

  if (existingError) throw existingError;

  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .insert({
      user_id: userId,
      project_id: input.project_id ?? null,
      title: input.title,
      body: input.body ?? null,
      category: input.category ?? DEFAULT_NOTE_CATEGORY,
      sort_order: 1,
    })
    .select(DB.NOTES.SELECT)
    .single();

  if (error) throw error;

  const created = normalizeNote(data as Note);
  const orderedIds = [
    created.id,
    ...((existingRows as { id: string }[] | null) ?? []).map((row) => row.id),
  ];
  await reorderNotes(orderedIds);

  return { ...created, sort_order: 1 };
}

export async function updateNote(
  id: string,
  updates: Partial<Pick<Note, "title" | "body" | "category">>,
): Promise<Note> {
  const { data, error } = await supabase
    .from(DB.NOTES.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.NOTES.SELECT)
    .single();

  if (error) throw error;
  return normalizeNote(data as Note);
}

export async function reorderNotes(orderedIds: string[]): Promise<void> {
  if (orderedIds.length === 0) return;

  const results = await Promise.all(
    orderedIds.map(async (id, index) => {
      const { error } = await supabase
        .from(DB.NOTES.TABLE)
        .update({ sort_order: index + 1 })
        .eq("id", id);
      return error;
    }),
  );

  const firstError = results.find((error) => error != null);
  if (firstError) throw firstError;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.NOTES.TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
}
