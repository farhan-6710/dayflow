import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUserId } from "@/features/auth/AuthProvider";
import { confirm } from "@/lib/confirm";
import { useAction } from "@/lib/query";
import { createNote, deleteNote, fetchNoteById, fetchNotesByProject, reorderNotes, updateNote, type CreateNoteInput } from "@/services/notesService";
import type { Note } from "@/shared/types/types";

export function useProjectNotes(projectId: string) {
  return useQuery({ queryKey: ["notes", "project", projectId], queryFn: () => fetchNotesByProject(projectId) });
}

export function useNote(id: string | null) {
  return useQuery({ queryKey: ["notes", "one", id], queryFn: () => fetchNoteById(id as string), enabled: Boolean(id) });
}

export function useNoteActions(projectId: string) {
  const userId = useUserId();
  const client = useQueryClient();

  const create = useAction((input: CreateNoteInput) => createNote(userId, input), {
    success: "Note created.",
    failure: "Couldn't create the note.",
    invalidate: ["notes"],
    quietError: true,
  });
  const update = useAction(({ id, updates }: { id: string; updates: Partial<Pick<Note, "title" | "body" | "category">> }) => updateNote(id, updates), {
    success: "Note saved.",
    failure: "Couldn't save the note.",
    invalidate: ["notes"],
    quietError: true,
  });
  const duplicate = useAction((note: Note) => createNote(userId, { project_id: note.project_id, title: `${note.title} (copy)`, body: note.body, category: note.category }), {
    success: "Note duplicated.",
    failure: "Couldn't duplicate the note.",
    invalidate: ["notes"],
  });
  const remove = useAction((id: string) => deleteNote(id), {
    success: "Note deleted.",
    failure: "Couldn't delete the note.",
    invalidate: ["notes"],
  });
  const reorder = useAction((orderedIds: string[]) => reorderNotes(orderedIds), {
    failure: "Couldn't save the new order.",
    invalidate: ["notes"],
  });

  return {
    create,
    update,
    duplicate,
    confirmDelete: async (note: Note) => {
      const ok = await confirm({ title: `Delete "${note.title || "this note"}"?`, message: "Its reference links go with it. This can't be undone.", confirmLabel: "Delete" });
      if (ok) remove.mutate(note.id);
      return ok;
    },
    saveOrder: (orderedIds: string[]) => {
      const positions = new Map(orderedIds.map((id, index) => [id, index + 1]));
      client.setQueryData<Note[]>(["notes", "project", projectId], (notes) =>
        notes?.map((note) => ({ ...note, sort_order: positions.get(note.id) ?? note.sort_order })).sort((a, b) => a.sort_order - b.sort_order),
      );
      reorder.mutate(orderedIds);
    },
  };
}
