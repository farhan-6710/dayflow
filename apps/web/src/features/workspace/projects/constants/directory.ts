import type { DirectoryTableColumn } from "@/shared/types/components";

export const PROJECTS_GRID_CLASS = "md:grid-cols-[2.5rem_1.6fr_1.2fr_6rem_2.5rem]";

export const projectsColumns: DirectoryTableColumn[] = [
  { label: "" },
  { label: "Project" },
  { label: "Project for" },
  { label: "Status" },
  { label: "" },
];

export const NOTES_GRID_CLASS = "md:grid-cols-[2.5rem_1.2fr_6rem_1.6fr_6.5rem_2.5rem]";

export const notesColumns: DirectoryTableColumn[] = [
  { label: "" },
  { label: "Note" },
  { label: "Category" },
  { label: "Preview" },
  { label: "Updated" },
  { label: "" },
];
