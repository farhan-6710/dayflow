import type { DirectoryTableColumn } from "@/shared/types/components";

export const CLIENTS_GRID_CLASS = "md:grid-cols-[1.3fr_1fr_1.5fr_6rem_3.5rem]";

export const CLIENT_SORT_COLUMNS = [
  { key: "company_name", label: "Company" },
  { key: "client_name", label: "Contact" },
  { key: "email", label: "Email" },
] as const;

export const CLIENT_PORTAL_FILTERS = [
  { value: "all", label: "All portal access" },
  { value: "linked", label: "Signed in to portal" },
  { value: "unlinked", label: "Not signed in yet" },
];

export const clientsTrailingColumns: DirectoryTableColumn[] = [{ label: "Status" }, { label: "Actions", align: "right" }];
