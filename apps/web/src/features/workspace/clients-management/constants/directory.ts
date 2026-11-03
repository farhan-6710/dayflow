import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENTS_GRID_CLASS = "md:grid-cols-[1.4fr_1fr_1.2fr_6rem_2.5rem]";

export const clientsColumns: DirectoryTableColumn[] = [
  { label: "Company" },
  { label: "Contact" },
  { label: "Email" },
  { label: "Status" },
  { label: "" },
];
