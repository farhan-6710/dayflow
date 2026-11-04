import type { DirectoryTableColumn } from "@/shared/types/components";

export const PROJECTS_GRID_CLASS = "md:grid-cols-[2.5rem_1.6fr_1.2fr_6rem_3.5rem]";

export const projectsColumns: DirectoryTableColumn[] = [
  { label: "" },
  { label: "Project" },
  { label: "Client / Organization" },
  { label: "Status" },
  { label: "Actions", align: "right" },
];

export const PROJECT_TYPE_FILTERS = [
  { value: "all", label: "All types" },
  { value: "client", label: "Client projects" },
  { value: "personal", label: "Personal" },
];

export const NOTES_GRID_CLASS = "md:grid-cols-[2.5rem_minmax(0,1fr)_6.5rem_6.5rem_3.5rem]";

export const notesColumns: DirectoryTableColumn[] = [
  { label: "" },
  { label: "Note" },
  { label: "Category" },
  { label: "Updated" },
  { label: "Actions", align: "right" },
];
