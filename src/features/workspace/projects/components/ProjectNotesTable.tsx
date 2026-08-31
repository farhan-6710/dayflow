import { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router";

import { ProjectNotesTableRow } from "@/features/workspace/projects/components/ProjectNotesTableRow";
import { notesDirectoryConfig } from "@/features/workspace/projects/constants/notesDirectory";
import { buildProjectNotePath } from "@/features/workspace/projects/constants/routes";
import type { ProjectNotesTableProps } from "@/features/workspace/projects/types/components";
import type { Note } from "@/services/notesService";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { Button } from "@/shared/ui/button";

export function ProjectNotesTable({
  projectId,
  notes,
  isLoading,
  onDeleteNote,
  emptyMessage,
  canAddNote = true,
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
        emptyMessage={emptyMessage ?? notesDirectoryConfig.emptyMessage}
        isLoading={isLoading}
        isEmpty={notes.length === 0}
        headerAside={
          canAddNote ? (
            <Button asChild size="sm">
              <Link to={buildProjectNotePath(projectId, "new")}>
                <Plus className="size-4" />
                Add Note
              </Link>
            </Button>
          ) : undefined
        }
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
