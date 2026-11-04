import { CalendarClock, FileText, Pencil, Trash2 } from "lucide-react";

import { TaskStatusBadge } from "@/features/workspace/tasks/components/TaskStatusBadge";
import type { TaskRowProps } from "@/features/workspace/tasks/types/components";
import { formatTaskEndTime } from "@/features/workspace/tasks/utils/taskTimeline";
import { DragHandle } from "@/shared/components/DragHandle";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { TASK_PRIORITY_LABELS } from "@/shared/constants/taskStatus";
import { useSortableRow } from "@/shared/hooks/useSortableRow";
import { cn } from "@/shared/lib/utils";

export function TaskRow({ task, onOpen, onEdit, onDelete }: TaskRowProps) {
  const { setNodeRef, style, handleProps, isDragging } = useSortableRow(task.id);
  const end = formatTaskEndTime(task.due_time);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn("relative flex items-start rounded-xl border border-border bg-card shadow-xs", isDragging && "z-10 opacity-70 shadow-md")}
    >
      <DragHandle label={`Reorder ${task.title}`} handleProps={handleProps} />
      <button
        type="button"
        onClick={() => onOpen(task)}
        className="flex min-w-0 flex-1 gap-3 rounded-lg py-2.5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className="hidden w-14 shrink-0 text-xs leading-snug text-muted-foreground min-[400px]:block">
          <span className="block text-foreground">{task.due_time ?? "No time"}</span>
          {end}
        </span>
        <span className="grid min-w-0 flex-1 justify-items-start gap-1">
          <span className={cn("max-w-full truncate", task.status === "done" && "text-muted-foreground line-through")}>{task.title}</span>
          <TaskStatusBadge status={task.status} />
          <span className="flex max-w-full items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <span className="min-[400px]:hidden">{task.due_time ? `${task.due_time} · ` : ""}</span>
              {TASK_PRIORITY_LABELS[task.priority]} priority
            </span>
          </span>
          <span className="flex max-w-full items-center gap-1.5 text-xs text-muted-foreground">
            <FileText className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{task.description || "No description"}</span>
          </span>
        </span>
      </button>
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
