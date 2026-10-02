import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { DRAFT_PROJECT_NOTE_ID } from "@/features/workspace/projects/constants/projectNotes";
import {
  buildProjectNotePath,
  buildProjectPath,
  PROJECTS_MANAGEMENT_PATH,
} from "@/features/workspace/projects/constants/routes";
import { useDraftProjectNote } from "@/features/workspace/projects/hooks/useDraftProjectNote";
import type { ProjectNoteSavePayload } from "@/features/workspace/projects/types/components";
import type {
  CreateNoteReferenceLinkInput,
  NoteReferenceLink,
} from "@/features/workspace/projects/types/noteReferenceLinks";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import {
  createNoteReferenceLink,
  deleteNoteReferenceLink,
  fetchNoteReferenceLinks,
  updateNoteReferenceLink,
} from "@/services/noteReferenceLinksService";
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
  const [referenceLinks, setReferenceLinks] = useState<NoteReferenceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingReferenceLink, setSavingReferenceLink] = useState(false);

  const { draftNote, startDraft, discardDraft, isDraftId } = useDraftProjectNote(
    projectId,
    user?.id,
  );

  const projectPath = buildProjectPath(projectId ?? "");

  const loadData = useCallback(async () => {
    if (!projectId || !user) return;
    try {
      setLoading(true);
      setError(null);
      const proj = await fetchProjectById(projectId);
      if (!proj || proj.user_id !== user.id) {
        showToast("error", "Project not found");
        navigate(PROJECTS_MANAGEMENT_PATH);
        return;
      }
      setProject(proj);

      if (isNewNote) {
        startDraft();
        setNote(null);
        setReferenceLinks([]);
        return;
      }

      if (!noteId) {
        navigate(projectPath);
        return;
      }

      const [found, links] = await Promise.all([
        fetchNoteById(noteId),
        fetchNoteReferenceLinks(noteId),
      ]);
      if (!found || found.project_id !== projectId) {
        showToast("error", "Note not found");
        navigate(projectPath);
        return;
      }
      setNote(found);
      setReferenceLinks(links);
    } catch (e) {
      console.error(e);
      setError("Failed to load note");
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
            category: payload.category,
          });
          discardDraft();
          showToast("success", "Note created successfully");
          navigate(buildProjectNotePath(projectId, created.id), {
            replace: true,
          });
          return;
        }

        const updated = await updateNote(id, {
          title: payload.title,
          body: payload.body,
          category: payload.category,
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
          category: source.category,
        });
        showToast("success", "Note duplicated");
        navigate(buildProjectNotePath(projectId, duplicated.id));
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

  const handleAddReferenceLink = useCallback(
    async (input: CreateNoteReferenceLinkInput) => {
      if (!user || !note || isNewNote) return;
      try {
        setSavingReferenceLink(true);
        const created = await createNoteReferenceLink(user.id, note.id, input);
        setReferenceLinks((prev) => [created, ...prev]);
        showToast("success", "Reference link added.");
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to add reference link.");
        throw e;
      } finally {
        setSavingReferenceLink(false);
      }
    },
    [user, note, isNewNote],
  );

  const handleUpdateReferenceLink = useCallback(
    async (linkId: string, input: CreateNoteReferenceLinkInput) => {
      try {
        setSavingReferenceLink(true);
        const updated = await updateNoteReferenceLink(linkId, input);
        setReferenceLinks((prev) =>
          prev.map((link) => (link.id === linkId ? updated : link)),
        );
        showToast("success", "Reference link updated.");
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to update reference link.");
        throw e;
      } finally {
        setSavingReferenceLink(false);
      }
    },
    [],
  );

  const handleDeleteReferenceLink = useCallback(async (linkId: string) => {
    try {
      setSavingReferenceLink(true);
      await deleteNoteReferenceLink(linkId);
      setReferenceLinks((prev) => prev.filter((link) => link.id !== linkId));
      showToast("success", "Reference link deleted.");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete reference link.");
      throw e;
    } finally {
      setSavingReferenceLink(false);
    }
  }, []);

  return {
    project,
    note: selectedNote,
    isDraft: Boolean(isNewNote && draftNote),
    referenceLinks,
    loading,
    error,
    savingReferenceLink,
    projectPath,
    handleSaveNote,
    handleDuplicateNote,
    handleDeleteNote,
    handleDiscard,
    handleAddReferenceLink,
    handleUpdateReferenceLink,
    handleDeleteReferenceLink,
  };
}
