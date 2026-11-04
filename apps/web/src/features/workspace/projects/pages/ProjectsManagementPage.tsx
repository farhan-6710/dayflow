import { CircleCheck, CircleOff, Folder, Plus, Users } from "lucide-react";

import { WORKSPACE_DASHBOARD_PATH } from "@/app/constants/workspaceRoutes";

import { ProjectsTable } from "@/features/workspace/projects/components/ProjectsTable";
import { useProjectsManagement } from "@/features/workspace/projects/hooks/useProjectsManagement";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { SummaryStats } from "@/shared/components/SummaryStats";
import { ProjectFormDialog } from "@/shared/projects/components/ProjectFormDialog";
import { Button } from "@/shared/ui/button";
import { newThisMonthLabel } from "@/shared/utils/newThisMonthLabel";

export function ProjectsManagementPage() {
  const page = useProjectsManagement();
  const { projects } = page;
  const active = projects.filter((project) => project.is_active).length;

  return (
    <>
      <PageHeader
        backButton={<Breadcrumbs items={[{ label: "Workspace", to: WORKSPACE_DASHBOARD_PATH }, { label: "Projects" }]} />}
        heading="Projects Management"
        description="Organize your client and personal projects, with their notes and links, in one place."
        actions={
          <Button size="lg" onClick={page.openCreate}>
            <Plus aria-hidden="true" />
            New Project
          </Button>
        }
      />
      {page.error ? (
        <div className="mb-4">
          <ErrorBanner message={page.error} onRetry={page.reload} />
        </div>
      ) : null}
      {page.error && projects.length === 0 ? null : (
        <div className="grid min-w-0 grid-cols-1 gap-4">
          <SummaryStats
            isLoading={page.loading}
            items={[
              { id: "total", label: "Total Projects", value: projects.length, icon: Folder, trend: newThisMonthLabel(projects) },
              { id: "active", label: "Active Projects", value: active, icon: CircleCheck },
              { id: "inactive", label: "Inactive", value: projects.length - active, icon: CircleOff },
              { id: "client", label: "Client Projects", value: projects.filter((project) => project.project_for).length, icon: Users },
            ]}
          />
          <ProjectsTable page={page} />
        </div>
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
