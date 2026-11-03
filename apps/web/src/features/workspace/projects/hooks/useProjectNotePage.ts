import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { buildProjectNotePath, buildProjectPath } from "@/app/constants/workspaceRoutes";
import type { NoteSavePayload } from "@/features/workspace/projects/types/components";
import {
  createNoteReferenceLink,
  deleteNoteReferenceLink,
  fetchNoteReferenceLinks,
  updateNoteReferenceLink,
} from "@/services/noteReferenceLinksService";
import { createNote, deleteNote, fetchNoteById, updateNote } from "@/services/notesService";
import { fetchProjectById } from "@/services/projectsService";
import { useUnsavedChangesContext } from "@/shared/unsaved-changes/unsavedChangesContext";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { NoteReferenceLink } from "@/shared/types/types";
import { showToast } from "@/shared/utils/showToast";

const NEW_NOTE_ID = "new";

export function useProjectNotePage() {
  const { user } = useAuth();
  const userId = user?.id;
  const { id: projectId = "", noteId = NEW_NOTE_ID } = useParams<{ id: string; noteId: string }>();
  const isDraft = noteId === NEW_NOTE_ID;
  const navigate = useNavigate();
  const { leaveWithoutPrompt } = useUnsavedChangesContext();
  const projectPath = buildProjectPath(projectId);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loader = useCallback(async () => {
    const [project, note, links] = await Promise.all([
      fetchProjectById(projectId),
      isDraft ? null : fetchNoteById(noteId),
      isDraft ? [] : fetchNoteReferenceLinks(noteId),
    ]);
    return {
      project: project?.user_id === userId ? project : null,
      note: note?.project_id === projectId ? note : null,
      links,
    };
  }, [projectId, noteId, isDraft, userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load this note.");

  const note = data?.note ?? null;

  const setLinks = useCallback(
    (update: (current: NoteReferenceLink[]) => NoteReferenceLink[]) => {
      setData((current) => ({ ...current, links: update(current.links) }));
    },
    [setData],
  );

  const linksApi = useMemo(
    () => ({
      create: (input: { url: string; label: string | null }) => createNoteReferenceLink(userId ?? "", noteId, input),
      update: updateNoteReferenceLink,
      remove: deleteNoteReferenceLink,
    }),
    [userId, noteId],
  );

  /** Returns the new note's id when creating. Throws on failure so the editor keeps its text. */
  async function saveNote(payload: NoteSavePayload): Promise<string | null> {
    try {
      if (note) {
        const updated = await updateNote(note.id, payload);
        setData((current) => ({ ...current, note: updated }));
        showToast("success", "Note saved.");
        return null;
      }
      const created = await createNote(userId ?? "", { project_id: projectId, ...payload });
      showToast("success", "Note created.");
      return created.id;
    } catch (saveError) {
      console.error("Failed to save note:", saveError);
      showToast("error", "Couldn't save the note. Please try again.");
      throw saveError;
    }
  }

  async function duplicateNote(): Promise<string | null> {
    if (!note) {
      return null;
    }
    try {
      const copy = await createNote(userId ?? "", {
        project_id: projectId,
        title: `${note.title} (copy)`,
        body: note.body,
        category: note.category,
      });
      showToast("success", "Note duplicated.");
      return copy.id;
    } catch (duplicateError) {
      console.error("Failed to duplicate note:", duplicateError);
      showToast("error", "Couldn't duplicate the note. Please try again.");
      return null;
    }
  }

  /** Resolves true once deleted, so the page can leave without an unsaved-changes prompt. */
  async function removeNote(): Promise<boolean> {
    if (!note) {
      return false;
    }
    setDeleting(true);
    try {
      await deleteNote(note.id);
      showToast("success", "Note deleted.");
      return true;
    } catch (deleteError) {
      console.error("Failed to delete note:", deleteError);
      showToast("error", "Couldn't delete the note. Please try again.");
      return false;
    } finally {
      setDeleting(false);
    }
  }

  return {
    project: data?.project ?? null,
    note,
    isDraft,
    links: data?.links ?? [],
    loading,
    error,
    reload,
    projectPath,
    deleteOpen,
    setDeleteOpen,
    deleting,
    setLinks,
    linksApi,
    saveNote,
    duplicateNote,
    removeNote,
    leaveWithoutPrompt,
    goToNote: (id: string, replace = false) => navigate(buildProjectNotePath(projectId, id), { replace }),
    goToProject: () => navigate(projectPath),
  };
}
