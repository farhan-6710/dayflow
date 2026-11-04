import { useState } from "react";
import { format } from "date-fns";
import {
  Activity,
  CalendarPlus,
  Clock,
  FileText,
  Info,
  LayoutGrid,
  Link2,
  CircleDot,
  CircleOff,
  Pencil,
  RotateCcw,
  Trash2,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import { buildClientPath, WORKSPACE_PROJECTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";
import { ActivitySummaryStats } from "@/features/workspace/client-activities/components/ActivitySummaryStats";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import type { ActivityRows } from "@/features/workspace/client-activities/types/components";
import { ProjectNotesTable } from "@/features/workspace/projects/components/ProjectNotesTable";
import { ReferenceLinksSection } from "@/features/workspace/projects/components/ReferenceLinksSection";
import { useProjectDetail } from "@/features/workspace/projects/hooks/useProjectDetail";
import { ProjectDetailSkeleton } from "@/features/workspace/projects/components/ProjectDetailSkeleton";
import { BackLink } from "@/shared/components/BackLink";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { DetailsPanel } from "@/shared/components/DetailsPanel";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { PillTabs } from "@/shared/components/PillTabs";
import { ProjectChip } from "@/shared/components/ProjectChip";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { StatusPill } from "@/shared/components/StatusPill";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import { cn } from "@/shared/lib/utils";
import { ProjectFormDialog } from "@/shared/projects/components/ProjectFormDialog";
import { Button } from "@/shared/ui/button";

const backLink = <BackLink to={WORKSPACE_PROJECTS_MANAGEMENT_PATH}>Projects Management</BackLink>;

export function ProjectDetailPage() {
  const page = useProjectDetail();
  const { project } = page;
  const [tab, setTab] = useState("overview");
  usePageBreadcrumbs(project ? [{ label: project.name }] : []);
  const [activityRows, setActivityRows] = useState<ActivityRows | null>(null);

  if (page.loading) {
    return <ProjectDetailSkeleton />;
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

  const forClient = Boolean(project.project_for);
  const showOn = (section: string) => (tab === "overview" || tab === section ? "min-w-0" : "hidden");
  const tabs = [
    { value: "overview", label: "Overview", icon: LayoutGrid },
    { value: "notes", label: "Notes", icon: FileText },
    { value: "references", label: "References", icon: Link2 },
    ...(forClient ? [{ value: "activities", label: "Activities", icon: Activity }] : []),
  ];
  const updated = format(new Date(project.updated_at), "MMM d, yyyy");

  return (
    <>
      <PageHeader
        leading={<ProjectChip color={project.color_hex} className="size-14 rounded-xl [&_svg]:size-6" />}
        heading={<span className="break-words">{project.name}</span>}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <StatusPill active={project.is_active}>{project.is_active ? "Active" : "Inactive"}</StatusPill>
            {project.project_for ? (
              <Link to={buildClientPath(project.project_for)} className="underline underline-offset-4 hover:text-foreground">
                For {project.project_for_label}
              </Link>
            ) : (
              <span>For {project.project_for_label}</span>
            )}
            <span>Updated {updated}</span>
          </span>
        }
        actions={
          <>
            {project.is_active ? (
              <Button variant="outline" size="lg" onClick={() => page.setEditOpen(true)}>
                <Pencil aria-hidden="true" />
                Edit Project
              </Button>
            ) : (
              <Button variant="outline" size="lg" disabled={page.updatingStatus} onClick={() => void page.toggleActive()}>
                <RotateCcw aria-hidden="true" />
                Mark active
              </Button>
            )}
            <RowActionsMenu
              label={`More actions for ${project.name}`}
              actions={[
                ...(project.is_active
                  ? [{ label: "Mark inactive", icon: CircleOff, onSelect: () => void page.toggleActive() }]
                  : []),
                { label: "Delete", icon: Trash2, destructive: true, onSelect: () => page.setDeleteOpen(true) },
              ]}
            />
          </>
        }
      />

      <div className="grid min-w-0 grid-cols-1 gap-4">
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <div className="border-b border-border pb-3">
          <PillTabs label="Project sections" value={tab} onChange={setTab} options={tabs} />
        </div>
        {forClient && tab === "overview" ? <ActivitySummaryStats rows={activityRows} /> : null}
        {/* Sections stay mounted across tabs, so nothing refetches or loses its search. */}
        <div className={cn("grid min-w-0 items-start gap-4", tab === "overview" && "xl:grid-cols-[minmax(0,1fr)_22rem]")}>
          <div className={cn("grid min-w-0 grid-cols-1 gap-4", tab === "references" && "hidden")}>
            <div className={showOn("notes")}>
              <ProjectNotesTable
                projectId={project.id}
                projectName={project.name}
                notes={page.notes}
                canAddNote={project.is_active}
                onDeleteNote={page.handleDeleteNote}
                onReorderNotes={(ids) => void page.handleReorderNotes(ids)}
              />
            </div>
            {forClient ? (
              <div className={showOn("activities")}>
                <ClientActivitiesBlock
                  scope="project"
                  projectId={project.id}
                  canEdit={project.is_active}
                  onRowsChange={setActivityRows}
                />
              </div>
            ) : null}
          </div>
          <div
            className={cn(
              "grid min-w-0 grid-cols-1 gap-4",
              (tab === "notes" || tab === "activities") && "hidden",
              tab === "overview" && "xl:sticky xl:top-4",
            )}
          >
            <div className={showOn("")}>
              <DetailsPanel
                icon={Info}
                title="Project Details"
                rows={[
                  { icon: Users, label: "Client", value: project.project_for_label },
                  {
                    icon: CircleDot,
                    label: "Status",
                    value: <StatusPill active={project.is_active}>{project.is_active ? "Active" : "Inactive"}</StatusPill>,
                  },
                  { icon: Clock, label: "Last Updated", value: updated },
                  { icon: CalendarPlus, label: "Created", value: format(new Date(project.created_at), "MMM d, yyyy") },
                ]}
              />
            </div>
            <div className={showOn("references")}>
              <ReferenceLinksSection
                links={page.links}
                canEdit={project.is_active}
                ownerLabel="project"
                api={page.linksApi}
                onLinksChange={page.setLinks}
              />
            </div>
          </div>
        </div>
      </div>

      <ProjectFormDialog
        open={page.editOpen}
        onOpenChange={page.setEditOpen}
        project={project}
        clients={page.clients}
        onSaved={page.setProject}
        onDelete={() => {
          page.setEditOpen(false);
          page.setDeleteOpen(true);
        }}
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
