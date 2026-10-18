import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { MYSELF_PROJECT_FOR_VALUE } from "@/features/workspace/projects/constants/projectFor";
import {
  DEFAULT_PROJECT_COLOR,
} from "@/features/workspace/projects/constants/projectColors";
import {
  projectForToSelectValue,
  selectValueToProjectFor,
} from "@/features/workspace/projects/utils/projectFor";
import type { Client } from "@/features/workspace/clients-management/types/types";
import { fetchClients } from "@/services/clientsService";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  type Project,
} from "@/services/projectsService";
import { mergeVisibleOrder } from "@/shared/utils/mergeVisibleOrder";
import { showToast } from "@/shared/utils/showToast";

function bySortOrder(a: Project, b: Project) {
  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
  return a.created_at.localeCompare(b.created_at);
}

export function useProjectsManagement() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState<string>(DEFAULT_PROJECT_COLOR);
  const [projectFor, setProjectFor] = useState(MYSELF_PROJECT_FOR_VALUE);
  const [submitting, setSubmitting] = useState(false);
  
  // For editing
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const [data, clientRows] = await Promise.all([
        fetchProjects(user.id),
        fetchClients(user.id),
      ]);
      setProjects(data);
      setClients(clientRows);
    } catch (e) {
      console.error(e);
      setError("Failed to load projects");
      showToast("error", "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const handleOpenCreateDialog = () => {
    setEditingProject(null);
    setProjectName("");
    setProjectColor(DEFAULT_PROJECT_COLOR);
    setProjectFor(MYSELF_PROJECT_FOR_VALUE);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectColor(project.color_hex);
    setProjectFor(projectForToSelectValue(project.project_for));
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectName.trim()) return;

    try {
      setSubmitting(true);
      const projectForId = selectValueToProjectFor(projectFor);
      if (editingProject) {
        const updated = await updateProject(editingProject.id, {
          name: projectName.trim(),
          color_hex: projectColor,
          project_for: projectForId,
        });
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
        showToast("success", "Project updated successfully");
      } else {
        const created = await createProject(user.id, {
          name: projectName.trim(),
          color_hex: projectColor,
          project_for: projectForId,
        });
        setProjects((prev) => {
          const bumped = prev.map((project) => ({
            ...project,
            sort_order: project.sort_order + 1,
          }));
          return [created, ...bumped];
        });
        showToast("success", "Project created successfully");
      }
      setDialogOpen(false);
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (project: Project) => {
    try {
      const updated = await updateProject(project.id, {
        is_active: !project.is_active,
      });
      setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
      showToast(
        "success",
        project.is_active ? "Project marked as inactive" : "Project marked as active",
      );
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to update project status");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("success", "Project deleted permanently");
    } catch (e) {
      console.error(e);
      showToast("error", "Failed to delete project");
    }
  };

  const handleReorderProjects = async (visibleOrderedIds: string[]) => {
    if (visibleOrderedIds.length === 0) return;

    let snapshot: Project[] = [];
    let nextOrderedIds: string[] = [];

    setProjects((prev) => {
      snapshot = prev;
      const fullOrderedIds = prev.slice().sort(bySortOrder).map((project) => project.id);
      nextOrderedIds = mergeVisibleOrder(fullOrderedIds, visibleOrderedIds);
      const orderMap = new Map(
        nextOrderedIds.map((id, index) => [id, index + 1]),
      );
      return prev
        .map((project) => ({
          ...project,
          sort_order: orderMap.get(project.id) ?? project.sort_order,
        }))
        .sort(bySortOrder);
    });

    try {
      await reorderProjects(nextOrderedIds);
    } catch (e) {
      console.error(e);
      setProjects(snapshot);
      showToast(
        "error",
        "Couldn't save the new order. Check your connection and try again.",
      );
    }
  };

  return {
    projects,
    clients,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    projectName,
    setProjectName,
    projectColor,
    setProjectColor,
    projectFor,
    setProjectFor,
    submitting,
    editingProject,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleSubmit,
    handleToggleActive,
    handleDeleteProject,
    handleReorderProjects,
    refresh: loadProjects,
  };
}
