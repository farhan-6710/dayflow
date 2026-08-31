import type { DirectoryTableColumn } from "@/shared/types/components";

export const NOTES_DIRECTORY_GRID_CLASS = "grid-cols-[1.1fr_2fr_0.8fr_0.7fr]";
export const NOTES_DIRECTORY_ROW_GRID_CLASS = "sm:grid-cols-[1.1fr_2fr_0.8fr_0.7fr]";

export const notesDirectoryColumns: DirectoryTableColumn[] = [
  { label: "NOTE TITLE" },
  { label: "DESCRIPTION" },
  { label: "UPDATED" },
  { label: "ACTIONS", align: "right" },
];

export const notesDirectoryConfig = {
  title: "Notes",
  description: "Notes in this project. Open a title to edit the note.",
  gridClass: NOTES_DIRECTORY_GRID_CLASS,
  columns: notesDirectoryColumns,
  emptyMessage: 'No notes yet. Click "Add Note" to create the first one.',
} as const;
