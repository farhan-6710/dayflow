import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useAuth } from "@/features/admin/auth/hooks/useAuth";
import { DEFAULT_PROJECT_COLOR } from "@/features/admin/projects/constants/projectColors";
import { MYSELF_PROJECT_FOR_VALUE } from "@/features/admin/projects/constants/projectFor";
import { PROJECTS_MANAGEMENT_PATH } from "@/features/admin/projects/constants/routes";
import type {
  CreateProjectReferenceLinkInput,
  ProjectReferenceLink,
} from "@/features/admin/projects/types/referenceLinks";
import {
  projectForToSelectValue,
  selectValueToProjectFor,
} from "@/features/admin/projects/utils/projectFor";
import type { Client } from "@/features/admin/clients-management/types/types";
import { fetchClients } from "@/services/clientsService";
import { fetchNotesByProject, deleteNote, type Note } from "@/services/notesService";
import {
  createProjectReferenceLink,
  deleteProjectReferenceLink,
  fetchProjectReferenceLinks,
  updateProjectReferenceLink,
} from "@/services/projectReferenceLinksService";
import {
  fetchProjectById,
  updateProject,
  type Project,
} from "@/services/projectsService";
import { showToast } from "@/shared/utils/showToast";

export function useProjectDetail() {
  const { user } = useAuth();
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [referenceLinks, setReferenceLinks] = useState<ProjectReferenceLink[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState<string>(DEFAULT_PROJECT_COLOR);
  const [projectFor, setProjectFor] = useState<string>(MYSELF_PROJECT_FOR_VALUE);
  const [submitting, setSubmitting] = useState(false);
  const [savingReferenceLink, setSavingReferenceLink] = useState(false);

  const loadData = useCallback(async () => {
    if (!projectId || !user) return;
    try {
      setLoading(true);
      const [proj, projectNotes, links, clientRows] = await Promise.all([
        fetchProjectById(projectId),
        fetchNotesByProject(projectId),
        fetchProjectReferenceLinks(projectId),
        fetchClients(user.id),
      ]);
      if (!proj || proj.user_id !== user.id) {
        showToast("error", "Project not found");
        navigate(PROJECTS_MANAGEMENT_PATH);
        return;
      }
      setProject(proj);
      setNotes(projectNotes);
      setReferenceLinks(links);
      setClients(clientRows);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId, user, navigate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleDeleteNote = useCallback(async (note: Note) => {
    try {
      await deleteNote(note.id);
      setNotes((prev) => prev.filter((entry) => entry.id !== note.id));
      showToast("success", "Note deleted");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete note");
      throw e;
    }
  }, []);

  const handleOpenEditDialog = useCallback(() => {
    if (!project) return;
    setProjectName(project.name);
    setProjectColor(project.color_hex);
    setProjectFor(projectForToSelectValue(project.project_for));
    setDialogOpen(true);
  }, [project]);

  const handleSubmitProject = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!project || !projectName.trim()) return;

      try {
        setSubmitting(true);
        const updated = await updateProject(project.id, {
          name: projectName.trim(),
          color_hex: projectColor,
          project_for: selectValueToProjectFor(projectFor),
        });
        setProject(updated);
        setDialogOpen(false);
        showToast("success", "Project updated successfully");
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to update project");
      } finally {
        setSubmitting(false);
      }
    },
    [project, projectColor, projectFor, projectName],
  );

  const handleAddReferenceLink = useCallback(
    async (input: CreateProjectReferenceLinkInput) => {
      if (!user || !projectId) return;
      try {
        setSavingReferenceLink(true);
        const created = await createProjectReferenceLink(user.id, projectId, input);
        setReferenceLinks((prev) => [created, ...prev]);
        showToast("success", "Reference link added.");
      } catch (e) {
        console.error(e);
        showToast("error", e instanceof Error ? e.message : "Failed to add reference link.");
        throw e;
      } finally {
        setSavingReferenceLink(false);
      }
    },
    [projectId, user],
  );

  const handleUpdateReferenceLink = useCallback(
    async (linkId: string, input: CreateProjectReferenceLinkInput) => {
      try {
        setSavingReferenceLink(true);
        const updated = await updateProjectReferenceLink(linkId, input);
        setReferenceLinks((prev) =>
          prev.map((link) => (link.id === linkId ? updated : link)),
        );
        showToast("success", "Reference link updated.");
      } catch (e) {
        console.error(e);
        showToast("error", e instanceof Error ? e.message : "Failed to update reference link.");
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
      await deleteProjectReferenceLink(linkId);
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
    notes,
    referenceLinks,
    clients,
    loading,
    dialogOpen,
    setDialogOpen,
    projectName,
    setProjectName,
    projectColor,
    setProjectColor,
    projectFor,
    setProjectFor,
    submitting,
    savingReferenceLink,
    handleDeleteNote,
    handleOpenEditDialog,
    handleSubmitProject,
    handleAddReferenceLink,
    handleUpdateReferenceLink,
    handleDeleteReferenceLink,
  };
}
