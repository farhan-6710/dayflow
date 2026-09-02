import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectFormDialog } from "@/features/workspace/projects/components/ProjectFormDialog";
import { ProjectsTable } from "@/features/workspace/projects/components/ProjectsTable";
import { useProjectsManagement } from "@/features/workspace/projects/hooks/useProjectsManagement";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { Button } from "@/shared/ui/button";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

function filterProjectsByStatus<T extends { is_archived: boolean }>(
  projects: T[],
  filter: ActiveStatusFilterId,
): T[] {
  const sorted = [...projects].sort(
    (a, b) => Number(a.is_archived) - Number(b.is_archived),
  );
  if (filter === "all") return sorted;
  if (filter === "active") return projects.filter((project) => !project.is_archived);
  return projects.filter((project) => project.is_archived);
}

export function ProjectsManagementPage() {
  const {
    projects,
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
    editingProject,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleSubmit,
    handleToggleArchive,
    handleDeleteProject,
  } = useProjectsManagement();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ActiveStatusFilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return filterProjectsByStatus(projects, statusFilter).filter((project) =>
      matchesListingSearch(searchQuery, [
        project.name,
        project.project_for_label,
        project.color_hex,
      ]),
    );
  }, [projects, searchQuery, statusFilter]);

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await handleDeleteProject(projectToDelete);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Projects Management"
        description="Organize notes into project folders — tasks stay standalone."
        actions={
          <Button onClick={handleOpenCreateDialog} className="rounded-full shadow-sm">
            <Plus className="mr-2 size-4" />
            New Project
          </Button>
        }
      />

      <PageContent>
        <ProjectsTable
          projects={filteredProjects}
          isLoading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onEditProject={handleOpenEditDialog}
          onToggleArchive={(project) => void handleToggleArchive(project)}
          onDeleteProject={confirmDelete}
        />
      </PageContent>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={Boolean(editingProject)}
        submitting={submitting}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        projectColor={projectColor}
        onProjectColorChange={setProjectColor}
        projectFor={projectFor}
        onProjectForChange={setProjectFor}
        clients={clients}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Project?"
        description="This action is irreversible. All notes in this project will be deleted forever."
        confirmLabel="Delete permanently"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
