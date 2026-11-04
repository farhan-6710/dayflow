import { format } from "date-fns";
import { CalendarPlus, Clock, Folder, Info, Plus } from "lucide-react";
import { Link } from "react-router";

import { buildProjectNotePath, WORKSPACE_PROJECTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";
import { ProjectNoteEditor } from "@/features/workspace/projects/components/ProjectNoteEditor";
import { ReferenceLinksSection } from "@/features/workspace/projects/components/ReferenceLinksSection";
import { useProjectNotePage } from "@/features/workspace/projects/hooks/useProjectNotePage";
import { ProjectNoteSkeleton } from "@/features/workspace/projects/components/ProjectNoteSkeleton";
import { BackLink } from "@/shared/components/BackLink";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { DetailsPanel } from "@/shared/components/DetailsPanel";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { ProjectChip } from "@/shared/components/ProjectChip";
import { StatusPill } from "@/shared/components/StatusPill";
import { NOTE_CATEGORY_LABELS } from "@/shared/constants/noteCategories";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

function formatDate(value: string) {
  return format(new Date(value), "MMM d, yyyy");
}

export function ProjectNotePage() {
  const page = useProjectNotePage();
  const { project, note, isDraft } = page;
  const heading = isDraft ? "New note" : note?.title.trim() || "Note";
  usePageBreadcrumbs(project ? [{ label: project.name, to: page.projectPath }, { label: heading }] : []);

  if (page.loading) {
    return <ProjectNoteSkeleton />;
  }
  if (page.error && !project) {
    return (
      <div className="space-y-3">
        <BackLink to={page.projectPath}>Back to project</BackLink>
        <ErrorBanner message={page.error} onRetry={page.reload} />
      </div>
    );
  }
  if (!project || (!note && !isDraft)) {
    return (
      <div className="space-y-3">
        <BackLink to={project ? page.projectPath : WORKSPACE_PROJECTS_MANAGEMENT_PATH}>
          {project ? project.name : "Projects Management"}
        </BackLink>
        <EmptyState
          image="icon-empty-notes"
          title="Note not found"
          description="It may have been deleted, or the link is out of date."
        />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        leading={<ProjectChip color={project.color_hex} className="size-14 rounded-xl [&_svg]:size-6" />}
        heading={heading}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <StatusPill active={project.is_active}>{project.is_active ? "Active" : "Inactive"}</StatusPill>
            <span>in {project.project_for_label}</span>
            {note ? <span>Last updated {formatDate(note.updated_at)}</span> : null}
          </span>
        }
        actions={
          !isDraft && project.is_active ? (
            <Button asChild variant="outline" size="lg">
              <Link to={buildProjectNotePath(project.id, "new")}>
                <Plus aria-hidden="true" />
                New Note
              </Link>
            </Button>
          ) : undefined
        }
      />
      <div className={cn("grid min-w-0 items-start gap-4", !isDraft && "xl:grid-cols-[minmax(0,1fr)_22rem]")}>
        {/* Remount per note and after each save, so the editor restarts from the saved text. */}
        <ProjectNoteEditor
          key={`${note?.id ?? "draft"}:${note?.updated_at ?? ""}`}
          note={note}
          canEdit={project.is_active}
          onSave={page.saveNote}
          onCreated={(id) => void page.goToNote(id, true)}
          onDuplicate={async () => {
            const copyId = await page.duplicateNote();
            if (copyId) {
              void page.goToNote(copyId);
            }
          }}
          onDelete={() => page.setDeleteOpen(true)}
          onDiscard={() => void page.goToProject()}
        />
        {note ? (
          <div className="grid min-w-0 grid-cols-1 gap-4">
            <DetailsPanel
              icon={Info}
              title="Note Details"
              rows={[
                {
                  icon: Folder,
                  label: "Category",
                  value: <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{NOTE_CATEGORY_LABELS[note.category]}</span>,
                },
                { icon: CalendarPlus, label: "Created", value: formatDate(note.created_at) },
                { icon: Clock, label: "Last Updated", value: formatDate(note.updated_at) },
              ]}
            />
            <ReferenceLinksSection
              links={page.links}
              canEdit={project.is_active}
              ownerLabel="note"
              api={page.linksApi}
              onLinksChange={page.setLinks}
            />
          </div>
        ) : null}
      </div>
      <ConfirmationModal
        open={page.deleteOpen}
        onOpenChange={page.setDeleteOpen}
        title={`Delete "${note?.title.trim() || "this note"}"?`}
        description="The note and its links will be removed. This can't be undone."
        confirmLabel="Delete note"
        confirmVariant="destructive"
        loading={page.deleting}
        onConfirm={async () => {
          if (await page.removeNote()) {
            await page.leaveWithoutPrompt(page.goToProject);
          }
        }}
      />
    </>
  );
}
