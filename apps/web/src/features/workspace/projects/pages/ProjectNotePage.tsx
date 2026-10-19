import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { ProjectNoteEditor } from "@/features/workspace/projects/components/ProjectNoteEditor";
import { ProjectReferenceLinksSection } from "@/features/workspace/projects/components/ProjectReferenceLinksSection";
import { DRAFT_PROJECT_NOTE_ID } from "@/features/workspace/projects/constants/projectNotes";
import { buildProjectNotePath } from "@/features/workspace/projects/constants/routes";
import { useProjectNotePage } from "@/features/workspace/projects/hooks/useProjectNotePage";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { ProjectsDirectoryPageSkeleton } from "@/shared/components/pageSkeletons";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ProjectNotePage() {
  const {
    project,
    note,
    isDraft,
    referenceLinks,
    loading,
    error,
    savingReferenceLink,
    projectPath,
    handleSaveNote,
    handleDuplicateNote,
    handleDeleteNote,
    handleDiscard,
    handleAddReferenceLink,
    handleUpdateReferenceLink,
    handleDeleteReferenceLink,
  } = useProjectNotePage();
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader heading="Note" description="Loading note…" />
        <ProjectsDirectoryPageSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 py-6">
        <ErrorBanner message={error} />
        <Link
          to={projectPath}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to project
        </Link>
      </div>
    );
  }

  if (!project || !note) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Note not found.
      </div>
    );
  }

  return (
    <PageContent
      stagger={false}
      className="flex min-h-[calc(100vh-120px)] flex-col"
    >
      <PageHeader
        heading={isDraft ? "New Note" : note.title.trim() || "Note"}
        description={`Notes management for ${project.name}.`}
        backButton={
          <Link
            to={projectPath}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to {project.name}
          </Link>
        }
        actions={
          !isDraft && project.is_active ? (
            <Button asChild size="sm">
              <Link to={buildProjectNotePath(project.id, "new")}>
                <Plus className="mr-1 size-4" />
                New Note
              </Link>
            </Button>
          ) : undefined
        }
      />

      <div
        className={cn(
          "grid min-w-0 flex-1 grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,22rem)]",
          containMinWidthClassName,
        )}
      >
        <ProjectNoteEditor
          note={note}
          isDraft={isDraft}
          saving={saving}
          onDiscard={handleDiscard}
          onDelete={() => setDeleteOpen(true)}
          onDuplicate={async (source) => {
            setSaving(true);
            try {
              await handleDuplicateNote(source);
            } finally {
              setSaving(false);
            }
          }}
          onSave={async (noteId, payload) => {
            setSaving(true);
            try {
              await handleSaveNote(noteId, payload);
            } finally {
              setSaving(false);
            }
          }}
        />

        {!isDraft ? (
          <ProjectReferenceLinksSection
            className="h-full min-h-[32rem]"
            referenceLinks={referenceLinks}
            canEdit={project.is_active}
            isSaving={savingReferenceLink}
            description="Links stored with this note."
            dialogDescription="Store a link with this note (doc, ticket, article, etc.)."
            deleteDescription="This removes the link from the note. This cannot be undone."
            onAdd={handleAddReferenceLink}
            onUpdate={handleUpdateReferenceLink}
            onDelete={handleDeleteReferenceLink}
          />
        ) : null}
      </div>

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete note?"
        description={`Are you sure you want to delete "${note.title || "this note"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={saving}
        onConfirm={async () => {
          if (note.id === DRAFT_PROJECT_NOTE_ID) return;
          setSaving(true);
          try {
            await handleDeleteNote(note.id);
            setDeleteOpen(false);
          } finally {
            setSaving(false);
          }
        }}
      />
    </PageContent>
  );
}

export default ProjectNotePage;
