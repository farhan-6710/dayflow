import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { DRAFT_PROJECT_NOTE_ID } from "@/features/projects/constants/projectNotes";
import { useDraftProjectNote } from "@/features/projects/hooks/useDraftProjectNote";
import type { ProjectNoteSavePayload } from "@/features/projects/types/components";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createNote,
  deleteNote,
  fetchNoteById,
  updateNote,
  type Note,
} from "@/services/notesService";
import { fetchProjectById, type Project } from "@/services/projectsService";
import { showToast } from "@/shared/utils/showToast";

export function useProjectNotePage() {
  const { user } = useAuth();
  const { id: projectId, noteId } = useParams<{ id: string; noteId: string }>();
  const isNewNote = noteId === "new";
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const { draftNote, startDraft, discardDraft, isDraftId } = useDraftProjectNote(
    projectId,
    user?.id,
  );

  const projectPath = `/projects-management/${projectId}`;

  const loadData = useCallback(async () => {
    if (!projectId || !user) return;
    try {
      setLoading(true);
      const proj = await fetchProjectById(projectId);
      if (!proj || proj.user_id !== user.id) {
        showToast("error", "Project not found");
        navigate("/projects-management");
        return;
      }
      setProject(proj);

      if (isNewNote) {
        startDraft();
        setNote(null);
        return;
      }

      if (!noteId) {
        navigate(projectPath);
        return;
      }

      const found = await fetchNoteById(noteId);
      if (!found || found.project_id !== projectId) {
        showToast("error", "Note not found");
        navigate(projectPath);
        return;
      }
      setNote(found);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load note");
    } finally {
      setLoading(false);
    }
  }, [projectId, noteId, isNewNote, user, navigate, projectPath, startDraft]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedNote = isNewNote ? draftNote : note;

  const handleDiscard = useCallback(() => {
    discardDraft();
    navigate(projectPath);
  }, [discardDraft, navigate, projectPath]);

  const handleSaveNote = useCallback(
    async (id: string, payload: ProjectNoteSavePayload) => {
      if (!user || !projectId) return;

      try {
        if (id === DRAFT_PROJECT_NOTE_ID || isDraftId(id)) {
          const created = await createNote(user.id, {
            project_id: projectId,
            title: payload.title,
            body: payload.body,
          });
          discardDraft();
          showToast("success", "Note created successfully");
          navigate(`/projects-management/${projectId}/notes/${created.id}`, {
            replace: true,
          });
          return;
        }

        const updated = await updateNote(id, {
          title: payload.title,
          body: payload.body,
        });
        setNote(updated);
        showToast("success", "Note saved successfully");
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to save note");
        throw e;
      }
    },
    [user, projectId, isDraftId, discardDraft, navigate],
  );

  const handleDuplicateNote = useCallback(
    async (source: Note) => {
      if (!user || !projectId) return;

      try {
        const duplicated = await createNote(user.id, {
          project_id: projectId,
          title: `${source.title} (copy)`,
          body: source.body,
        });
        showToast("success", "Note duplicated");
        navigate(`/projects-management/${projectId}/notes/${duplicated.id}`);
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to duplicate note");
        throw e;
      }
    },
    [user, projectId, navigate],
  );

  const handleDeleteNote = useCallback(
    async (id: string) => {
      if (id === DRAFT_PROJECT_NOTE_ID || isDraftId(id)) {
        handleDiscard();
        return;
      }

      try {
        await deleteNote(id);
        showToast("success", "Note deleted");
        navigate(projectPath);
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to delete note");
        throw e;
      }
    },
    [isDraftId, handleDiscard, navigate, projectPath],
  );

  return {
    project,
    note: selectedNote,
    isDraft: Boolean(isNewNote && draftNote),
    loading,
    projectPath,
    handleSaveNote,
    handleDuplicateNote,
    handleDeleteNote,
    handleDiscard,
  };
}
