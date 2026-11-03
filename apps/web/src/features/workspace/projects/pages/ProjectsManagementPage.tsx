import { Plus } from "lucide-react";

import { ProjectsTable } from "@/features/workspace/projects/components/ProjectsTable";
import { useProjectsManagement } from "@/features/workspace/projects/hooks/useProjectsManagement";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { ProjectFormDialog } from "@/shared/projects/components/ProjectFormDialog";
import { Button } from "@/shared/ui/button";

export function ProjectsManagementPage() {
  const page = useProjectsManagement();

  return (
    <>
      <PageHeader
        heading="Projects Management"
        description="Folders for your notes and links, personal or for a client."
        actions={
          <Button size="lg" onClick={page.openCreate}>
            <Plus aria-hidden="true" />
            New project
          </Button>
        }
      />
      {page.error ? (
        <div className="mb-4">
          <ErrorBanner message={page.error} onRetry={page.reload} />
        </div>
      ) : null}
      {page.error && page.projects.length === 0 ? null : (
        <ProjectsTable
          projects={page.filteredProjects}
          isFiltered={page.isFiltered}
          isLoading={page.loading}
          statusFilter={page.statusFilter}
          onStatusFilterChange={page.setStatusFilter}
          searchQuery={page.searchQuery}
          onSearchQueryChange={page.setSearchQuery}
          onCreate={page.openCreate}
          onEdit={page.openEdit}
          onToggleActive={(project) => void page.toggleActive(project)}
          onDelete={page.setProjectToDelete}
          onReorder={(ids) => void page.reorder(ids)}
        />
      )}
      <ProjectFormDialog
        open={page.dialogOpen}
        onOpenChange={page.setDialogOpen}
        project={page.editingProject}
        clients={page.clients}
        onSaved={page.handleSaved}
      />
      <ConfirmationModal
        open={page.projectToDelete !== null}
        onOpenChange={(open) => !open && page.setProjectToDelete(null)}
        title={`Delete ${page.projectToDelete?.name ?? "project"}?`}
        description="This also deletes all of its notes, and can't be undone."
        confirmLabel="Delete project"
        confirmVariant="destructive"
        loading={page.deleting}
        onConfirm={page.confirmDelete}
      />
    </>
  );
}
