import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectForSelect } from "@/features/projects/components/ProjectForSelect";
import { ProjectsTable } from "@/features/projects/components/ProjectsTable";
import { PROJECT_FOR_LABEL } from "@/features/projects/constants/projectFor";
import { useProjectsManagement } from "@/features/projects/hooks/useProjectsManagement";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import {
  colorSwatchClassName,
  formFieldGroupClassName,
  formLabelClassName,
} from "@/shared/constants/formStyles";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

const COLOR_PRESETS = [
  "#ff7e21",
  "#e25505",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
];

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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription>
              Create a custom workspace folder with a specific highlight color.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Project Name</label>
              <Input
                placeholder="e.g. Work tasks, Side Projects, Fitness"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>{PROJECT_FOR_LABEL}</label>
              <ProjectForSelect
                value={projectFor}
                onChange={setProjectFor}
                clients={clients}
                disabled={submitting}
              />
            </div>

            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Highlight Color</label>
              <div className="flex flex-wrap gap-3">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Select color ${color}`}
                    aria-pressed={projectColor === color}
                    onClick={() => setProjectColor(color)}
                    className={colorSwatchClassName(projectColor === color)}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !projectName.trim()}>
                {editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
