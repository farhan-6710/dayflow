import { Mail, Pencil, Trash2 } from "lucide-react";

import { buildClientPath } from "@/app/constants/workspaceRoutes";
import { CLIENTS_GRID_CLASS } from "@/features/workspace/clients-management/constants/directory";
import type { ClientsTableRowProps } from "@/features/workspace/clients-management/types/components";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { StatusPill } from "@/shared/components/StatusPill";
import { cn } from "@/shared/lib/utils";

export function ClientsTableRow({ client, onEdit, onDelete }: ClientsTableRowProps) {
  const actions = [
    { label: "Edit", icon: Pencil, onSelect: () => onEdit(client) },
    { label: "Delete", icon: Trash2, destructive: true, onSelect: () => onDelete(client) },
  ];

  return (
    <DirectoryTableRow
      to={buildClientPath(client.id)}
      label={`Open ${client.company_name}`}
      className={cn("grid grid-cols-[1fr_2.5rem] items-center gap-x-2 gap-y-0.5 md:gap-x-4", CLIENTS_GRID_CLASS)}
    >
      <p className="min-w-0 truncate">{client.company_name}</p>
      <div className="col-start-2 row-start-1 md:hidden">
        <RowActionsMenu label={`Actions for ${client.company_name}`} actions={actions} />
      </div>
      <p className="col-span-2 truncate text-sm text-muted-foreground md:col-span-1">{client.client_name || "No contact"}</p>
      <p className="col-span-2 flex min-w-0 items-center gap-2 text-sm text-muted-foreground md:col-span-1">
        <Mail className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{client.email || "No email"}</span>
      </p>
      <div className="col-span-2 mt-1 md:col-span-1 md:mt-0">
        <StatusPill active={client.is_active}>{client.is_active ? "Active" : "Inactive"}</StatusPill>
      </div>
      <div className="hidden md:flex md:justify-end">
        <RowActionsMenu label={`Actions for ${client.company_name}`} actions={actions} />
      </div>
    </DirectoryTableRow>
  );
}
