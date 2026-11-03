import { format } from "date-fns";
import { CircleOff, Pencil, RotateCcw, Trash2, UserRound } from "lucide-react";
import { Link } from "react-router";

import { buildClientPath, WORKSPACE_PROJECTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import { ProjectNotesTable } from "@/features/workspace/projects/components/ProjectNotesTable";
import { ReferenceLinksSection } from "@/features/workspace/projects/components/ReferenceLinksSection";
import { useProjectDetail } from "@/features/workspace/projects/hooks/useProjectDetail";
import { BackLink } from "@/shared/components/BackLink";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { ProjectChip } from "@/shared/components/ProjectChip";
import { StatusPill } from "@/shared/components/StatusPill";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { ProjectFormDialog } from "@/shared/projects/components/ProjectFormDialog";
import { Button } from "@/shared/ui/button";

const backLink = <BackLink to={WORKSPACE_PROJECTS_MANAGEMENT_PATH}>Projects Management</BackLink>;

export function ProjectDetailPage() {
  const page = useProjectDetail();
  const { project } = page;

  if (page.loading) {
    return <TableSkeleton rows={6} />;
  }
  if (page.error && !project) {
    return (
      <div className="space-y-3">
        {backLink}
        <ErrorBanner message={page.error} onRetry={page.reload} />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="space-y-3">
        {backLink}
        <EmptyState
          image="icon-empty-projects"
          title="Project not found"
          description="It may have been deleted, or the link is out of date."
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        backButton={backLink}
        heading={
          <span className="flex min-w-0 items-center gap-3">
            <ProjectChip color={project.color_hex} className="size-11" />
            <span className="min-w-0 break-words">{project.name}</span>
          </span>
        }
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <StatusPill active={project.is_active}>{project.is_active ? "Active" : "Inactive"}</StatusPill>
            <span>For {project.project_for_label}</span>
            <span>Updated {format(new Date(project.updated_at), "MMM d, yyyy")}</span>
          </span>
        }
        actions={
          <>
            {project.project_for ? (
              <Button asChild variant="outline" size="lg">
                <Link to={buildClientPath(project.project_for)}>
                  <UserRound aria-hidden="true" />
                  View client
                </Link>
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="lg"
              disabled={page.updatingStatus}
              onClick={() => void page.toggleActive()}
            >
              {project.is_active ? <CircleOff aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
              {project.is_active ? "Mark inactive" : "Mark active"}
            </Button>
            <Button variant="outline" size="lg" disabled={!project.is_active} onClick={() => page.setEditOpen(true)}>
              <Pencil aria-hidden="true" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="[&_svg]:text-destructive"
              onClick={() => page.setDeleteOpen(true)}
            >
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          </>
        }
      />

      <div className="grid min-w-0 gap-4">
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <ProjectNotesTable
            projectId={project.id}
            projectName={project.name}
            notes={page.notes}
            canAddNote={project.is_active}
            onDeleteNote={page.handleDeleteNote}
            onReorderNotes={(ids) => void page.handleReorderNotes(ids)}
          />
          <ReferenceLinksSection
            links={page.links}
            canEdit={project.is_active}
            ownerLabel="project"
            api={page.linksApi}
            onLinksChange={page.setLinks}
          />
        </div>
        {project.project_for ? (
          <ClientActivitiesBlock scope="project" projectId={project.id} canEdit={project.is_active} />
        ) : null}
      </div>

      <ProjectFormDialog
        open={page.editOpen}
        onOpenChange={page.setEditOpen}
        project={project}
        clients={page.clients}
        onSaved={page.setProject}
      />
      <ConfirmationModal
        open={page.deleteOpen}
        onOpenChange={page.setDeleteOpen}
        title={`Delete ${project.name}?`}
        description="This also deletes all of its notes, and can't be undone."
        confirmLabel="Delete project"
        confirmVariant="destructive"
        loading={page.deleting}
        onConfirm={page.confirmDelete}
      />
    </>
  );
}
