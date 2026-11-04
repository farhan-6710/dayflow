import { Plus } from "lucide-react";
import { Link } from "react-router";

import { buildProjectNotePath, WORKSPACE_PROJECTS_MANAGEMENT_PATH } from "@/app/constants/workspaceRoutes";
import { ProjectNoteEditor } from "@/features/workspace/projects/components/ProjectNoteEditor";
import { ReferenceLinksSection } from "@/features/workspace/projects/components/ReferenceLinksSection";
import { useProjectNotePage } from "@/features/workspace/projects/hooks/useProjectNotePage";
import { BackLink } from "@/shared/components/BackLink";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageSkeleton } from "@/shared/components/PageSkeleton";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ProjectNotePage() {
  const page = useProjectNotePage();
  const { project, note, isDraft } = page;

  if (page.loading) {
    return <PageSkeleton />;
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
        backButton={<BackLink to={page.projectPath}>{project.name}</BackLink>}
        heading={isDraft ? "New note" : note?.title.trim() || "Note"}
        actions={
          !isDraft && project.is_active ? (
            <Button asChild variant="outline" size="lg">
              <Link to={buildProjectNotePath(project.id, "new")}>
                <Plus aria-hidden="true" />
                New note
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
          <ReferenceLinksSection
            links={page.links}
            canEdit={project.is_active}
            ownerLabel="note"
            api={page.linksApi}
            onLinksChange={page.setLinks}
          />
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
