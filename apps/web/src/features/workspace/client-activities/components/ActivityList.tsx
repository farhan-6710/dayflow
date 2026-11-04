import { Circle, CircleCheck, Pencil, Trash2 } from "lucide-react";

import { ActivityStatusBadge } from "@/features/workspace/client-activities/components/ActivityStatusBadge";
import type { ActivityListProps } from "@/features/workspace/client-activities/types/components";
import { isClientActivityOpen } from "@/features/workspace/client-activities/utils/activityFormUtils";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";

export function ActivityList({ clientLabel, rows, emptyLabel, canEditRow, onEdit, onDelete }: ActivityListProps) {
  if (rows.length === 0) {
    return (
      <div className="mt-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
        <CircleCheck className="size-6" aria-hidden="true" />
        {emptyLabel}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {rows.map((row) => (
        <li key={row.id} className="flex items-start gap-3 py-2.5">
          {isClientActivityOpen(row.status) ? (
            <Circle className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          ) : (
            <CircleCheck className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
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
