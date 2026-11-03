import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { WORKSPACE_PROJECTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";
import { fetchClients } from "@/services/clientsService";
import { deleteNote, fetchNotesByProject, reorderNotes } from "@/services/notesService";
import {
  createProjectReferenceLink,
  deleteProjectReferenceLink,
  fetchProjectReferenceLinks,
  updateProjectReferenceLink,
} from "@/services/projectReferenceLinksService";
import { deleteProject, fetchProjectById, updateProject } from "@/services/projectsService";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { Note, Project, ProjectReferenceLink } from "@/shared/types/types";
import { reorderItems } from "@/shared/utils/reorderItems";
import { showToast } from "@/shared/utils/showToast";

export function useProjectDetail() {
  const { user } = useAuth();
  const userId = user?.id;
  const { id: projectId = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loader = useCallback(async () => {
    const [project, notes, links, clients] = await Promise.all([
      fetchProjectById(projectId),
      fetchNotesByProject(projectId),
      fetchProjectReferenceLinks(projectId),
      fetchClients(userId ?? ""),
    ]);
    return { project: project?.user_id === userId ? project : null, notes, links, clients };
  }, [projectId, userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load this project.");

  const project = data?.project ?? null;
  const notes = useMemo(() => data?.notes ?? [], [data]);

  function setNotes(update: (current: Note[]) => Note[]) {
    setData((current) => ({ ...current, notes: update(current.notes) }));
  }

  function setProject(updated: Project) {
    setData((current) => ({ ...current, project: updated }));
  }

  const setLinks = useCallback(
    (update: (current: ProjectReferenceLink[]) => ProjectReferenceLink[]) => {
      setData((current) => ({ ...current, links: update(current.links) }));
    },
    [setData],
  );

  const linksApi = useMemo(
    () => ({
      create: (input: { url: string; label: string | null }) =>
        createProjectReferenceLink(userId ?? "", projectId, input),
      update: updateProjectReferenceLink,
      remove: deleteProjectReferenceLink,
    }),
    [userId, projectId],
  );

  async function handleDeleteNote(note: Note) {
    try {
      await deleteNote(note.id);
      setNotes((current) => current.filter((entry) => entry.id !== note.id));
      showToast("success", "Note deleted.");
    } catch (deleteError) {
      console.error("Failed to delete note:", deleteError);
      showToast("error", "Couldn't delete the note. Please try again.");
      throw deleteError;
    }
  }

  async function handleReorderNotes(visibleOrderedIds: string[]) {
    const previous = notes;
    const next = reorderItems(notes, visibleOrderedIds);
    setNotes(() => next.items);
    try {
      await reorderNotes(next.orderedIds);
    } catch (reorderError) {
      console.error("Failed to save note order:", reorderError);
      setNotes(() => previous);
      showToast("error", "Couldn't save the new order. Check your connection and try again.");
    }
  }

  async function toggleActive() {
    if (!project) {
      return;
    }
    setUpdatingStatus(true);
    try {
      const updated = await updateProject(project.id, { is_active: !project.is_active });
      setProject(updated);
      showToast("success", updated.is_active ? "Project marked active." : "Project marked inactive.");
    } catch (toggleError) {
      console.error("Failed to update project status:", toggleError);
      showToast("error", "Couldn't update the project status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function confirmDelete() {
    if (!project) {
      return;
    }
    setDeleting(true);
    try {
      await deleteProject(project.id);
      showToast("success", "Project deleted.");
      void navigate(WORKSPACE_PROJECTS_MANAGEMENT_PATH);
    } catch (deleteError) {
      console.error("Failed to delete project:", deleteError);
      showToast("error", "Couldn't delete the project. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return {
    project,
    notes,
    links: data?.links ?? [],
    clients: data?.clients ?? [],
    loading,
    error,
    reload,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    deleting,
    updatingStatus,
    setProject,
    setLinks,
    linksApi,
    handleDeleteNote,
    handleReorderNotes,
    toggleActive,
    confirmDelete,
  };
}
