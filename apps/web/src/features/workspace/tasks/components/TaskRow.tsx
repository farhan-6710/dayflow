import { Pencil, Trash2 } from "lucide-react";

import type { TaskRowProps } from "@/features/workspace/tasks/types/components";
import { DragHandle } from "@/shared/components/DragHandle";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { TASK_PRIORITY_LABELS, TASK_STATUS_DOT_CLASS, TASK_STATUS_LABELS } from "@/shared/constants/taskStatus";
import { useSortableRow } from "@/shared/hooks/useSortableRow";
import { cn } from "@/shared/lib/utils";

export function TaskRow({ task, onEdit, onDelete }: TaskRowProps) {
  const { setNodeRef, style, handleProps, isDragging } = useSortableRow(task.id);
  const meta = [task.due_time, `${TASK_PRIORITY_LABELS[task.priority]} priority`].filter(Boolean).join(" · ");

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn("relative flex items-start gap-1 bg-card py-2", isDragging && "z-10 opacity-70 shadow-md")}
    >
      <DragHandle label={`Reorder ${task.title}`} handleProps={handleProps} />
      <div className="min-w-0 flex-1 py-1">
        <p className={cn("break-words", task.status === "done" && "text-muted-foreground line-through")}>{task.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {meta}
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("size-1.5 rounded-full", TASK_STATUS_DOT_CLASS[task.status])} />
            {TASK_STATUS_LABELS[task.status]}
          </span>
        </p>
      </div>
      <RowActionsMenu
        label={`Actions for ${task.title}`}
        actions={[
          { label: "Edit", icon: Pencil, onSelect: () => onEdit(task) },
          { label: "Delete", icon: Trash2, destructive: true, onSelect: () => onDelete(task) },
        ]}
      />
    </li>
  );
}
