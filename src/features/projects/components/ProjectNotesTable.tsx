import { useState } from "react";

import { ProjectNotesTableRow } from "@/features/projects/components/ProjectNotesTableRow";
import { notesDirectoryConfig } from "@/features/projects/constants/notesDirectory";
import type { ProjectNotesTableProps } from "@/features/projects/types/components";
import type { Note } from "@/services/notesService";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function ProjectNotesTable({
  projectId,
  notes,
  isLoading,
  onDeleteNote,
}: ProjectNotesTableProps) {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <DirectoryTable
        title={notesDirectoryConfig.title}
        description={notesDirectoryConfig.description}
        gridClass={notesDirectoryConfig.gridClass}
        columns={[...notesDirectoryConfig.columns]}
        emptyMessage={notesDirectoryConfig.emptyMessage}
        isLoading={isLoading}
        isEmpty={notes.length === 0}
      >
        {notes.map((note) => (
          <ProjectNotesTableRow
            key={note.id}
            projectId={projectId}
            note={note}
            onDeleteNote={setNoteToDelete}
          />
        ))}
      </DirectoryTable>

      <ConfirmationModal
        open={Boolean(noteToDelete)}
        onOpenChange={(open) => {
          if (!open) setNoteToDelete(null);
        }}
        title="Delete note?"
        description={`Are you sure you want to delete "${noteToDelete?.title.trim() || "this note"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={deleting}
        onConfirm={async () => {
          if (!noteToDelete) return;
          setDeleting(true);
          try {
            await onDeleteNote(noteToDelete);
            setNoteToDelete(null);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </>
  );
}
