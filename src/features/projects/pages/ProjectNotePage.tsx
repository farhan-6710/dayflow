import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { ProjectNoteEditor } from "@/features/projects/components/ProjectNoteEditor";
import { DRAFT_PROJECT_NOTE_ID } from "@/features/projects/constants/projectNotes";
import { useProjectNotePage } from "@/features/projects/hooks/useProjectNotePage";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { PageHeader } from "@/shared/components/PageHeader";

export function ProjectNotePage() {
  const {
    project,
    note,
    isDraft,
    loading,
    projectPath,
    handleSaveNote,
    handleDuplicateNote,
    handleDeleteNote,
    handleDiscard,
  } = useProjectNotePage();
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (loading && !project) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading note...</div>;
  }

  if (!project) return null;

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col space-y-6">
      <PageHeader
        heading={isDraft ? "New Note" : note?.title.trim() || "Note"}
        description={`Notes management for ${project.name}.`}
        backButton={
          <Link
            to={projectPath}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back to {project.name}
          </Link>
        }
      />

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

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete note?"
        description={`Are you sure you want to delete "${note?.title || "this note"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={saving}
        onConfirm={async () => {
          if (!note || note.id === DRAFT_PROJECT_NOTE_ID) return;
          setSaving(true);
          try {
            await handleDeleteNote(note.id);
            setDeleteOpen(false);
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}

export default ProjectNotePage;
