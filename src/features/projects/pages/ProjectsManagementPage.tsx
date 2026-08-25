import { Folder, FolderArchive, MoreVertical, Plus, Trash2, Edit, Archive } from "lucide-react";
import { useProjectsManagement } from "@/features/projects/hooks/useProjectsManagement";
import { ProjectForSelect } from "@/features/projects/components/ProjectForSelect";
import { PROJECT_FOR_LABEL } from "@/features/projects/constants/projectFor";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageContent } from "@/shared/components/PageContent";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { colorSwatchClassName, formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { useState } from "react";
import { Link } from "react-router";

const COLOR_PRESETS = [
  "#ff7e21", // Orange Brand
  "#e25505", // Orange Accent
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f59e0b", // Amber
];

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

  const activeProjects = projects.filter((p) => !p.is_archived);
  const archivedProjects = projects.filter((p) => p.is_archived);

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Projects Management"
        description="Organize notes into project folders — tasks stay standalone."
        actions={
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-1 size-4" />
            New Project
          </Button>
        }
      />

      <PageContent>
        {/* Active Projects */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Active Projects</h2>
          
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading projects...</div>
          ) : activeProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Folder className="mx-auto size-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-sm font-semibold">No active projects</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Get started by creating a folder for your current goals.
              </p>
              <Button onClick={handleOpenCreateDialog} variant="outline" className="mt-4">
                <Plus className="mr-1 size-4" /> Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-2xs hover:shadow-xs transition"
                >
                  <div className="flex items-start justify-between">
                    <Link
                      to={`/projects-management/${project.id}`}
                      className="flex items-center gap-3 min-w-0"
                    >
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white font-bold"
                        style={{ backgroundColor: project.color_hex }}
                      >
                        <Folder className="size-5" />
                      </span>
                      <span className="block truncate font-semibold hover:underline">
                        {project.name}
                      </span>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0 cursor-pointer">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(project)}>
                          <Edit className="mr-2 size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void handleToggleArchive(project)}>
                          <Archive className="mr-2 size-4" /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => confirmDelete(project.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{PROJECT_FOR_LABEL}: {project.project_for_label}</span>
                    <Link
                      to={`/projects-management/${project.id}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      Open Project →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Archived Projects */}
        {archivedProjects.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-border">
            <h2 className="text-lg font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
              <FolderArchive className="size-5" /> Archived Projects
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {archivedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/20 p-6 shadow-2xs opacity-80"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground font-bold">
                        <Folder className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate font-medium text-muted-foreground">
                          {project.name}
                        </span>
                        <span className="mt-1 block truncate text-xs">
                          {PROJECT_FOR_LABEL}: {project.project_for_label}
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0 cursor-pointer">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => void handleToggleArchive(project)}>
                          <Archive className="mr-2 size-4" /> Restore
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => confirmDelete(project.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageContent>

      {/* Save Project Dialog */}
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
              <label className={formLabelClassName}>
                Project Name
              </label>
              <Input
                placeholder="e.g. Work tasks, Side Projects, Fitness"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>
                {PROJECT_FOR_LABEL}
              </label>
              <ProjectForSelect
                value={projectFor}
                onChange={setProjectFor}
                clients={clients}
                disabled={submitting}
              />
            </div>

            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>
                Highlight Color
              </label>
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
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !projectName.trim()}>
                {editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
