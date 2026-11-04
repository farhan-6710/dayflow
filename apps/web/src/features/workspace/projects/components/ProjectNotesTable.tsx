import { useMemo, useState } from "react";
import { FileText, Plus } from "lucide-react";
import { Link } from "react-router";

import { buildProjectNotePath } from "@/app/constants/workspaceRoutes";
import { ProjectNotesTableRow } from "@/features/workspace/projects/components/ProjectNotesTableRow";
import { NOTES_GRID_CLASS, notesColumns } from "@/features/workspace/projects/constants/directory";
import type { ProjectNotesTableProps } from "@/features/workspace/projects/types/components";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { PanelHeading } from "@/shared/components/PanelHeading";
import { SortableList } from "@/shared/components/SortableList";
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS } from "@/shared/constants/noteCategories";
import type { Note } from "@/shared/types/types";
import { Button } from "@/shared/ui/button";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

const ALL_CATEGORIES = "all";
const categoryOptions = [
  { value: ALL_CATEGORIES, label: "All categories" },
  ...NOTE_CATEGORIES.map((category) => ({ value: category, label: NOTE_CATEGORY_LABELS[category] })),
];

export function ProjectNotesTable({
  projectId,
  projectName,
  notes,
  canAddNote,
  onDeleteNote,
  onReorderNotes,
}: ProjectNotesTableProps) {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);

  const filtered = useMemo(
    () =>
      notes.filter(
        (note) =>
          (category === ALL_CATEGORIES || note.category === category) &&
          matchesListingSearch(searchQuery, [note.title, note.body, NOTE_CATEGORY_LABELS[note.category]]),
      ),
    [notes, searchQuery, category],
  );
  const isFiltered = category !== ALL_CATEGORIES || searchQuery.trim().length > 0;

  const addButton = (
    <Button asChild className="h-10">
      <Link to={buildProjectNotePath(projectId, "new")}>
        <Plus aria-hidden="true" />
        Add Note
      </Link>
    </Button>
  );

  return (
    <>
      <DirectoryTable
        title={<PanelHeading icon={FileText} title="Notes" />}
        gridClass={NOTES_GRID_CLASS}
        columns={notesColumns}
        isEmpty={filtered.length === 0}
        emptyImage={isFiltered ? "icon-empty-search" : "icon-empty-notes"}
        emptyTitle={isFiltered ? "No matching notes" : "No notes yet"}
        emptyDescription={
          isFiltered ? "Try a different search or category." : `Capture specs, meetings and research for ${projectName}.`
        }
        emptyAction={!isFiltered && canAddNote ? addButton : undefined}
        action={canAddNote ? addButton : undefined}
        headerAside={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
            <ListingSearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search notes…" />
            <OptionDropdown
              label="Filter by category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              className="sm:w-44"
            />
          </div>
        }
      >
        <SortableList ids={filtered.map((note) => note.id)} onReorder={onReorderNotes}>
          {filtered.map((note) => (
            <ProjectNotesTableRow key={note.id} projectId={projectId} note={note} onDelete={setNoteToDelete} />
          ))}
        </SortableList>
      </DirectoryTable>
      <ConfirmationModal
        open={noteToDelete !== null}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
        title={`Delete "${noteToDelete?.title.trim() || "this note"}"?`}
        description="The note and its links will be removed. This can't be undone."
        confirmLabel="Delete note"
        confirmVariant="destructive"
        loading={deleting}
        onConfirm={async () => {
          if (!noteToDelete) {
            return;
          }
          setDeleting(true);
          try {
            await onDeleteNote(noteToDelete);
            setNoteToDelete(null);
          } catch {
            // The hook already told the user; keep the modal open to retry.
          } finally {
            setDeleting(false);
          }
        }}
      />
    </>
  );
}
