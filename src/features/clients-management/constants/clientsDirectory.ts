import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENTS_DIRECTORY_GRID_CLASS =
  "grid-cols-[1.25fr_1fr_0.95fr_1.15fr_1fr_0.62fr_0.48fr]";
export const CLIENTS_DIRECTORY_ROW_GRID_CLASS =
  "sm:grid-cols-[1.25fr_1fr_0.95fr_1.15fr_1fr_0.62fr_0.48fr]";

export const clientsDirectoryColumns: DirectoryTableColumn[] = [
  { label: "COMPANY / BRAND" },
  { label: "CLIENT NAME" },
  { label: "MOBILE" },
  { label: "EMAIL" },
  { label: "WEBSITE" },
  { label: "STATUS" },
  { label: "ACTIONS", align: "right" },
];

export const clientsDirectoryConfig = {
  title: "Clients Directory",
  description: "Company registry with primary contact details for freelance and office work.",
  gridClass: CLIENTS_DIRECTORY_GRID_CLASS,
  columns: clientsDirectoryColumns,
  emptyMessage:
    'No clients found. Click "Add Client" to register your first client.',
} as const;
