import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from "@/services/projectsService";
import { showToast } from "@/shared/utils/showToast";

export function useProjectsManagement() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectColor, setProjectColor] = useState("#ff7e21");
  const [submitting, setSubmitting] = useState(false);
  
  // For editing
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await fetchProjects(user.id);
      setProjects(data);
    } catch (e) {
      console.error(e);
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
    setProjectColor("#ff7e21");
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setProjectColor(project.color_hex);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectName.trim()) return;

    try {
      setSubmitting(true);
      if (editingProject) {
        const updated = await updateProject(editingProject.id, {
          name: projectName.trim(),
          color_hex: projectColor,
        });
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
        showToast("success", "Project updated successfully");
      } else {
        const created = await createProject(user.id, {
          name: projectName.trim(),
          color_hex: projectColor,
        });
        setProjects((prev) => [created, ...prev]);
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

  const handleToggleArchive = async (project: Project) => {
    try {
      const updated = await updateProject(project.id, {
        is_archived: !project.is_archived,
      });
      setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
      showToast(
        "success",
        project.is_archived ? "Project restored from archive" : "Project archived"
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

  return {
    projects,
    loading,
    dialogOpen,
    setDialogOpen,
    projectName,
    setProjectName,
    projectColor,
    setProjectColor,
    submitting,
    editingProject,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleSubmit,
    handleToggleArchive,
    handleDeleteProject,
    refresh: loadProjects,
  };
}
