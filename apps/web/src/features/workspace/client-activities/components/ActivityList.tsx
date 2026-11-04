import { Pencil, Trash2 } from "lucide-react";

import { ActivityStatusBadge } from "@/features/workspace/client-activities/components/ActivityStatusBadge";
import type { ActivityListProps } from "@/features/workspace/client-activities/types/components";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";

export function ActivityList({ clientLabel, rows, emptyLabel, canEditRow, onEdit, onDelete }: ActivityListProps) {
  if (rows.length === 0) {
    return <p className="py-3 text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {rows.map((row) => (
        <li key={row.id} className="flex items-start gap-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="break-words">{row.title}</p>
            <p className="text-sm text-muted-foreground">
              {[...row.meta, ...(row.raisedBy === "client" ? [`Raised by ${clientLabel}`] : [])].join(" · ")}
            </p>
          </div>
          <div className="flex min-h-10 shrink-0 items-center gap-1">
            <ActivityStatusBadge status={row.status} />
            {canEditRow(row) ? (
              <RowActionsMenu
                label={`Actions for ${row.title}`}
                actions={[
                  { label: "Edit", icon: Pencil, onSelect: () => onEdit(row) },
                  { label: "Delete", icon: Trash2, destructive: true, onSelect: () => onDelete(row) },
                ]}
              />
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
