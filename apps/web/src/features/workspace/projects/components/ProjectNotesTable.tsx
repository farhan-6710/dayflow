import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router";

import { SortableProjectNotesTableRow } from "@/features/workspace/projects/components/SortableProjectNotesTableRow";
import {
  NOTE_CATEGORIES,
  NOTE_CATEGORY_FILTER_ALL,
  NOTE_CATEGORY_LABELS,
  type NoteCategoryFilterId,
} from "@/features/workspace/projects/constants/noteCategories";
import { notesDirectoryConfig } from "@/features/workspace/projects/constants/notesDirectory";
import { buildProjectNotePath } from "@/features/workspace/projects/constants/routes";
import type { ProjectNotesTableProps } from "@/features/workspace/projects/types/components";
import type { Note } from "@/services/notesService";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { compactDropdownClassName } from "@/shared/constants/layoutStyles";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

const categoryFilterOptions = [
  { value: NOTE_CATEGORY_FILTER_ALL, label: "All categories" },
  ...NOTE_CATEGORIES.map((category) => ({
    value: category,
    label: NOTE_CATEGORY_LABELS[category],
  })),
];

export function ProjectNotesTable({
  projectId,
  notes,
  isLoading,
  onDeleteNote,
  onReorderNotes,
  emptyMessage,
  canAddNote = true,
}: ProjectNotesTableProps) {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<NoteCategoryFilterId>(NOTE_CATEGORY_FILTER_ALL);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesCategory =
        categoryFilter === NOTE_CATEGORY_FILTER_ALL ||
        note.category === categoryFilter;

      if (!matchesCategory) {
        return false;
      }

      return matchesListingSearch(searchQuery, [
        note.title,
        note.body,
        NOTE_CATEGORY_LABELS[note.category],
      ]);
    });
  }, [notes, searchQuery, categoryFilter]);

  const noteIds = filteredNotes.map((note) => note.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = noteIds.indexOf(String(active.id));
    const newIndex = noteIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    onReorderNotes(arrayMove(noteIds, oldIndex, newIndex));
  }

  const hasActiveFilters =
    searchQuery.trim().length > 0 || categoryFilter !== NOTE_CATEGORY_FILTER_ALL;

  return (
    <>
      <DirectoryTable
        title={notesDirectoryConfig.title}
        description={notesDirectoryConfig.description}
        gridClass={notesDirectoryConfig.gridClass}
        columns={[...notesDirectoryConfig.columns]}
        emptyMessage={
          hasActiveFilters
            ? "No notes match your search or category filter."
            : (emptyMessage ?? notesDirectoryConfig.emptyMessage)
        }
        isLoading={isLoading}
        isEmpty={!isLoading && filteredNotes.length === 0}
        headerAside={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <ListingSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search notes"
              disabled={isLoading}
            />
            <OptionDropdown
              value={categoryFilter}
              onChange={(next) => setCategoryFilter(next as NoteCategoryFilterId)}
              options={categoryFilterOptions}
              disabled={isLoading}
              placeholder="Filter by category"
              className={cn(compactDropdownClassName, "sm:w-[180px]")}
            />
            {canAddNote ? (
              <Button asChild size="sm">
                <Link to={buildProjectNotePath(projectId, "new")}>
                  <Plus className="size-4" />
                  Add Note
                </Link>
              </Button>
            ) : null}
          </div>
        }
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={noteIds}
            strategy={verticalListSortingStrategy}
          >
            {filteredNotes.map((note) => (
              <SortableProjectNotesTableRow
                key={note.id}
                projectId={projectId}
                note={note}
                onDeleteNote={setNoteToDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
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
