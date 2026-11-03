import { Pencil, Trash2 } from "lucide-react";

import { ActivityStatusBadge } from "@/features/workspace/client-activities/components/ActivityStatusBadge";
import type { ActivityListProps } from "@/features/workspace/client-activities/types/components";
import { Button } from "@/shared/ui/button";

export function ActivityList({ clientLabel, rows, emptyLabel, canEditRow, onEdit, onDelete }: ActivityListProps) {
  if (rows.length === 0) {
    return <p className="py-3 text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {rows.map((row) => (
        <li key={row.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
          <div className="min-w-0 flex-1 basis-56">
            <p className="break-words">{row.title}</p>
            <p className="text-sm text-muted-foreground">{row.meta.join(" · ")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {row.raisedBy === "client" ? (
              <span className="text-xs text-muted-foreground">Raised by {clientLabel}</span>
            ) : null}
            <ActivityStatusBadge status={row.status} />
            {canEditRow(row) ? (
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="text-muted-foreground"
                  aria-label={`Edit ${row.title}`}
                  onClick={() => onEdit(row)}
                >
                  <Pencil aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Delete ${row.title}`}
                  onClick={() => onDelete(row)}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
