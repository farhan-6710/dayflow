import { useCallback, useMemo, useState } from "react";

import { fetchClients } from "@/services/clientsService";
import { deleteProject, fetchProjects, reorderProjects, updateProject } from "@/services/projectsService";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { useAuth } from "@/shared/hooks/useAuth";
import { useLoadData } from "@/shared/hooks/useLoadData";
import type { Project } from "@/shared/types/types";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { reorderItems } from "@/shared/utils/reorderItems";
import { showToast } from "@/shared/utils/showToast";

export function useProjectsManagement() {
  const { user } = useAuth();
  const userId = user?.id;
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loader = useCallback(async () => {
    const [projects, clients] = await Promise.all([fetchProjects(userId ?? ""), fetchClients(userId ?? "")]);
    return { projects, clients };
  }, [userId]);
  const { data, loading, error, reload, setData } = useLoadData(userId ? loader : null, "Couldn't load your projects.");

  const projects = useMemo(() => data?.projects ?? [], [data]);
  const filteredProjects = useMemo(
    () =>
      filterByActiveStatus(projects, statusFilter).filter((project) =>
        matchesListingSearch(searchQuery, [project.name, project.project_for_label]),
      ),
    [projects, searchQuery, statusFilter],
  );

  function setProjects(update: (current: Project[]) => Project[]) {
    setData((current) => ({ ...current, projects: update(current.projects) }));
  }

  function openCreate() {
    setEditingProject(null);
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setDialogOpen(true);
  }

  function handleSaved(saved: Project) {
    setProjects((current) =>
      current.some((project) => project.id === saved.id)
        ? current.map((project) => (project.id === saved.id ? saved : project))
        : [saved, ...current.map((project) => ({ ...project, sort_order: project.sort_order + 1 }))],
    );
  }

  async function toggleActive(project: Project) {
    try {
      const updated = await updateProject(project.id, { is_active: !project.is_active });
      handleSaved(updated);
      showToast("success", updated.is_active ? "Project marked active." : "Project marked inactive.");
    } catch (toggleError) {
      console.error("Failed to update project status:", toggleError);
      showToast("error", "Couldn't update the project status. Please try again.");
    }
  }

  async function confirmDelete() {
    if (!projectToDelete) {
      return;
    }
    setDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      setProjects((current) => current.filter((project) => project.id !== projectToDelete.id));
      setProjectToDelete(null);
      showToast("success", "Project deleted.");
    } catch (deleteError) {
      console.error("Failed to delete project:", deleteError);
      showToast("error", "Couldn't delete the project. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  async function reorder(visibleOrderedIds: string[]) {
    const previous = projects;
    const next = reorderItems(projects, visibleOrderedIds);
    setProjects(() => next.items);
    try {
      await reorderProjects(next.orderedIds);
    } catch (reorderError) {
      console.error("Failed to save project order:", reorderError);
      setProjects(() => previous);
      showToast("error", "Couldn't save the new order. Check your connection and try again.");
    }
  }

  return {
    projects,
    filteredProjects,
    clients: data?.clients ?? [],
    loading,
    error,
    reload,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isFiltered: statusFilter !== "all" || searchQuery.trim().length > 0,
    dialogOpen,
    setDialogOpen,
    editingProject,
    projectToDelete,
    setProjectToDelete,
    deleting,
    openCreate,
    openEdit,
    handleSaved,
    toggleActive,
    confirmDelete,
    reorder,
  };
}
