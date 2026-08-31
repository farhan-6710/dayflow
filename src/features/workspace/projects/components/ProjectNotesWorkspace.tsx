import { useState } from "react";
import { Plus } from "lucide-react";

import { ProjectNoteEditor } from "@/features/workspace/projects/components/ProjectNoteEditor";
import { ProjectNotesList } from "@/features/workspace/projects/components/ProjectNotesList";
import { DRAFT_PROJECT_NOTE_ID } from "@/features/workspace/projects/constants/projectNotes";
import type { ProjectNotesWorkspaceProps } from "@/features/workspace/projects/types/components";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ProjectNotesWorkspace({
  notes,
  draftNote,
  selectedNoteId,
  loading,
  onSelect,
  onStartDraft,
  onSave,
  onDuplicate,
  onDelete,
  onDiscard,
}: ProjectNotesWorkspaceProps) {
  const [saving, setSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const selectedNote =
    draftNote && selectedNoteId === draftNote.id
      ? draftNote
      : (notes.find((note) => note.id === selectedNoteId) ?? null);
  const pendingNote = notes.find((note) => note.id === pendingDeleteId);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-4", containMinWidthClassName)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {notes.length} {notes.length === 1 ? "note" : "notes"} in this project.
        </p>
        <Button size="sm" onClick={onStartDraft}>
          <Plus className="mr-1 size-4" />
          Add Note
        </Button>
      </div>

      <div className={cn("grid min-h-0 flex-1 grid-cols-1 gap-6 md:grid-cols-3", containMinWidthClassName)}>
        <ProjectNotesList
          notes={notes}
          draftNote={draftNote}
          selectedNoteId={selectedNoteId}
          loading={loading}
          onSelect={onSelect}
          onDelete={setPendingDeleteId}
        />
        <ProjectNoteEditor
          note={selectedNote}
          isDraft={Boolean(draftNote && selectedNote?.id === draftNote.id)}
          saving={saving}
          onDiscard={onDiscard}
          onDelete={setPendingDeleteId}
          onDuplicate={async (note) => {
            setSaving(true);
            try {
              await onDuplicate(note);
            } finally {
              setSaving(false);
            }
          }}
          onSave={async (noteId, payload) => {
            setSaving(true);
            try {
              await onSave(noteId, payload);
            } finally {
              setSaving(false);
            }
          }}
        />
      </div>

      <ConfirmationModal
        open={Boolean(pendingDeleteId)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
        title="Delete note?"
        description={`Are you sure you want to delete "${pendingNote?.title || "this note"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={saving}
        onConfirm={async () => {
          if (!pendingDeleteId || pendingDeleteId === DRAFT_PROJECT_NOTE_ID) return;
          setSaving(true);
          try {
            await onDelete(pendingDeleteId);
            setPendingDeleteId(null);
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}
