import type { DirectoryTableColumn } from "@/shared/types/components";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";

export const PROJECTS_DIRECTORY_GRID_CLASS =
  "grid-cols-[0.55fr_1.4fr_1.2fr_0.7fr_0.55fr]";
export const PROJECTS_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[0.55fr_1.4fr_1.2fr_0.7fr_0.55fr]";

export const projectsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "COLOR" },
  { label: "PROJECT NAME" },
  { label: "PROJECT FOR" },
  { label: "STATUS" },
  { label: "ACTIONS", align: "right" },
];

export const projectsDirectoryConfig = {
  title: "Projects Directory",
  description: "Workspace folders for notes, tagged by owner and highlight color.",
  gridClass: PROJECTS_DIRECTORY_GRID_CLASS,
  columns: projectsDirectoryColumns,
  emptyMessage: 'No projects found. Click "New Project" to create your first folder.',
} as const;

export const PROJECTS_STATUS_FILTER_LABELS: Record<ActiveStatusFilterId, string> = {
  all: "All projects",
  active: "Active",
  inactive: "Archived",
};
