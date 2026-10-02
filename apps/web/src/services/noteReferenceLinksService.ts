import type {
  CreateNoteReferenceLinkInput,
  NoteReferenceLink,
} from "@/features/workspace/projects/types/noteReferenceLinks";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export async function fetchNoteReferenceLinks(
  noteId: string,
): Promise<NoteReferenceLink[]> {
  const { data, error } = await supabase
    .from(DB.NOTE_REFERENCE_LINKS.TABLE)
    .select(DB.NOTE_REFERENCE_LINKS.SELECT)
    .eq("note_id", noteId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as NoteReferenceLink[];
}

export async function createNoteReferenceLink(
  userId: string,
  noteId: string,
  input: CreateNoteReferenceLinkInput,
): Promise<NoteReferenceLink> {
  const url = input.url.trim();
  if (!url) throw new Error("Reference link URL is required.");

  const label = input.label?.trim() || null;

  const { data, error } = await supabase
    .from(DB.NOTE_REFERENCE_LINKS.TABLE)
    .insert({ user_id: userId, note_id: noteId, url, label })
    .select(DB.NOTE_REFERENCE_LINKS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to add reference link.");
  return data as NoteReferenceLink;
}

export async function updateNoteReferenceLink(
  linkId: string,
  input: CreateNoteReferenceLinkInput,
): Promise<NoteReferenceLink> {
  const url = input.url.trim();
  if (!url) throw new Error("Reference link URL is required.");

  const label = input.label?.trim() || null;

  const { data, error } = await supabase
    .from(DB.NOTE_REFERENCE_LINKS.TABLE)
    .update({ url, label })
    .eq("id", linkId)
    .select(DB.NOTE_REFERENCE_LINKS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update reference link.");
  return data as NoteReferenceLink;
}

export async function deleteNoteReferenceLink(linkId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.NOTE_REFERENCE_LINKS.TABLE)
    .delete()
    .eq("id", linkId);

  if (error) throw new Error(error.message ?? "Failed to delete reference link.");
}
