import { Pencil, Trash2 } from "lucide-react";

import type { TaskRowProps } from "@/features/workspace/tasks/types/components";
import { DragHandle } from "@/shared/components/DragHandle";
import { TASK_PRIORITY_LABELS, TASK_STATUS_DOT_CLASS, TASK_STATUS_LABELS } from "@/shared/constants/taskStatus";
import { useSortableRow } from "@/shared/hooks/useSortableRow";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

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
        <p className="text-sm text-muted-foreground">{meta}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", TASK_STATUS_DOT_CLASS[task.status])} />
          {TASK_STATUS_LABELS[task.status]}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon-lg"
        className="text-muted-foreground"
        aria-label={`Edit ${task.title}`}
        onClick={() => onEdit(task)}
      >
        <Pencil aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon-lg"
        className="text-muted-foreground hover:text-destructive"
        aria-label={`Delete ${task.title}`}
        onClick={() => onDelete(task)}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </li>
  );
}
