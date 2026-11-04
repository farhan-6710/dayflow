import { Circle, CircleCheck, Pencil, Trash2 } from "lucide-react";

import { ActivityStatusBadge } from "@/features/workspace/client-activities/components/ActivityStatusBadge";
import type { ActivityListProps } from "@/features/workspace/client-activities/types/components";
import { isClientActivityOpen } from "@/features/workspace/client-activities/utils/activityFormUtils";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { cn } from "@/shared/lib/utils";

export function ActivityList({
  clientLabel,
  rows,
  emptyLabel,
  canEditRow,
  togglingId = null,
  onToggleStatus,
  onEdit,
  onDelete,
}: ActivityListProps) {
  if (rows.length === 0) {
    return (
      <div className="mt-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
        <CircleCheck className="size-6" aria-hidden="true" />
        {emptyLabel}
      </div>
    );
  }

  return (
    <ul>
      {rows.map((row) => {
        const open = isClientActivityOpen(row.status);
        const canToggle = canEditRow(row);
        const busy = togglingId === row.id || togglingId !== null;
        const Icon = open ? Circle : CircleCheck;
        const meta = [...row.meta, ...(row.raisedBy === "client" ? [`Raised by ${clientLabel}`] : [])].join(" · ");

        return (
          <li
            key={row.id}
            className="flex items-start gap-3 border-b border-border px-2 py-2.5 transition-colors last:border-b-0 hover:bg-accent"
          >
            {canToggle ? (
              <button
                type="button"
                disabled={busy}
                aria-label={open ? `Mark "${row.title}" completed` : `Reopen "${row.title}"`}
                aria-pressed={!open}
                onClick={() => onToggleStatus(row)}
                className="mt-0.5 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
              >
                <Icon
                  className={cn("size-4 shrink-0", open ? "text-muted-foreground" : "text-primary")}
                  aria-hidden="true"
                />
              </button>
            ) : (
              <Icon className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              {canToggle ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onToggleStatus(row)}
                  className="w-full rounded-sm text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
                >
                  <p className="break-words">{row.title}</p>
                  <p className="text-sm text-muted-foreground">{meta}</p>
                </button>
              ) : (
                <>
                  <p className="break-words">{row.title}</p>
                  <p className="text-sm text-muted-foreground">{meta}</p>
                </>
              )}
            </div>
            <div className="flex min-h-10 shrink-0 items-center gap-1">
              <ActivityStatusBadge status={row.status} />
              {canToggle ? (
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
        );
      })}
    </ul>
  );
}
