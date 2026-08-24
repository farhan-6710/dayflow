import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { DRAFT_PROJECT_NOTE_ID } from "@/features/projects/constants/projectNotes";
import { useDraftProjectNote } from "@/features/projects/hooks/useDraftProjectNote";
import type { ProjectNoteSavePayload } from "@/features/projects/types/components";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createNote,
  deleteNote,
  fetchNotesByProject,
  updateNote,
  type Note,
} from "@/services/notesService";
import { fetchProjectById, type Project } from "@/services/projectsService";
import { showToast } from "@/shared/utils/showToast";

export function useProjectDetail() {
  const { user } = useAuth();
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const { draftNote, startDraft, discardDraft, isDraftId } = useDraftProjectNote(
    projectId,
    user?.id,
  );

  const loadData = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const proj = await fetchProjectById(projectId);
      if (!proj) {
        showToast("error", "Project not found");
        navigate("/projects");
        return;
      }
      setProject(proj);
      setNotes(await fetchNotesByProject(projectId));
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (loading) return;
    const existsInNotes = Boolean(selectedNoteId && notes.some((note) => note.id === selectedNoteId));
    const existsAsDraft = Boolean(draftNote && selectedNoteId === draftNote.id);
    if (existsInNotes || existsAsDraft) return;
    if (draftNote) {
      setSelectedNoteId(draftNote.id);
      return;
    }
    setSelectedNoteId(notes[0]?.id ?? null);
  }, [loading, notes, draftNote, selectedNoteId]);

  const noteCount = useMemo(() => notes.length, [notes]);

  const handleStartDraft = useCallback(() => {
    startDraft();
    setSelectedNoteId(DRAFT_PROJECT_NOTE_ID);
  }, [startDraft]);

  const handleDiscardDraft = useCallback(() => {
    discardDraft();
    setSelectedNoteId(notes[0]?.id ?? null);
  }, [discardDraft, notes]);

  const handleSaveNote = useCallback(
    async (noteId: string, payload: ProjectNoteSavePayload) => {
      if (!user || !projectId) return;

      try {
        if (noteId === DRAFT_PROJECT_NOTE_ID || isDraftId(noteId)) {
          const created = await createNote(user.id, {
            project_id: projectId,
            title: payload.title,
            body: payload.body,
          });
          setNotes((prev) => [created, ...prev]);
          discardDraft();
          setSelectedNoteId(created.id);
          showToast("success", "Note created successfully");
          return;
        }

        const updated = await updateNote(noteId, {
          title: payload.title,
          body: payload.body,
        });
        setNotes((prev) => prev.map((note) => (note.id === noteId ? updated : note)));
        setSelectedNoteId(updated.id);
        showToast("success", "Note saved successfully");
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to save note");
        throw e;
      }
    },
    [user, projectId, isDraftId, discardDraft],
  );

  const handleDuplicateNote = useCallback(
    async (note: Note) => {
      if (!user || !projectId) return;

      try {
        const duplicated = await createNote(user.id, {
          project_id: projectId,
          title: `${note.title} (copy)`,
          body: note.body,
        });
        setNotes((prev) => {
          const sourceIndex = prev.findIndex((currentNote) => currentNote.id === note.id);
          if (sourceIndex === -1) {
            return [duplicated, ...prev];
          }

          const next = [...prev];
          next.splice(sourceIndex + 1, 0, duplicated);
          return next;
        });
        setSelectedNoteId(duplicated.id);
        showToast("success", "Note duplicated");
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to duplicate note");
        throw e;
      }
    },
    [user, projectId],
  );

  const handleDeleteNote = useCallback(
    async (noteId: string) => {
      if (noteId === DRAFT_PROJECT_NOTE_ID || isDraftId(noteId)) {
        handleDiscardDraft();
        return;
      }

      try {
        await deleteNote(noteId);
        const remaining = notes.filter((note) => note.id !== noteId);
        setNotes(remaining);
        if (selectedNoteId === noteId) {
          setSelectedNoteId(remaining[0]?.id ?? null);
        }
        showToast("success", "Note deleted");
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to delete note");
        throw e;
      }
    },
    [isDraftId, handleDiscardDraft, notes, selectedNoteId],
  );

  return {
    project,
    notes,
    noteCount,
    loading,
    refresh: loadData,
    draftNote,
    selectedNoteId,
    selectNote: setSelectedNoteId,
    startDraft: handleStartDraft,
    discardDraft: handleDiscardDraft,
    handleSaveNote,
    handleDuplicateNote,
    handleDeleteNote,
  };
}
