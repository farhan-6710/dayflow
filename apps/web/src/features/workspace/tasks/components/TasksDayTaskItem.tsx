import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { Clock3, Edit, GripVertical, MoreVertical, Trash2 } from "lucide-react";
import type { CSSProperties } from "react";

import {
  TASK_STATUS_BADGE_CLASS,
  TASK_STATUS_DOT_COLORS,
  TASK_STATUS_LABELS,
} from "@/features/workspace/tasks/constants/taskStatus";
import type { Task } from "@/services/tasksService";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export type TasksDayTaskItemProps = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: DraggableSyntheticListeners;
  sortableStyle?: CSSProperties;
  setSortableRef?: (node: HTMLElement | null) => void;
  isDragging?: boolean;
};

export function TasksDayTaskItem({
  task,
  onEdit,
  onDelete,
  dragHandleAttributes,
  dragHandleListeners,
  sortableStyle,
  setSortableRef,
  isDragging = false,
}: TasksDayTaskItemProps) {
  return (
    <div
      ref={setSortableRef}
      data-slot="day-task-row"
      style={sortableStyle}
      className={cn(isDragging && "relative z-10")}
    >
      <div
        className={cn(
          "flex min-w-0 items-start gap-2 py-3",
          isDragging && "rounded-md bg-card/90 opacity-70",
        )}
      >
        <button
          type="button"
          className="mt-0.5 flex size-5 shrink-0 cursor-grab items-center justify-center text-muted-foreground touch-none hover:text-foreground active:cursor-grabbing"
          aria-label={`Reorder ${task.title}`}
          {...dragHandleAttributes}
          {...dragHandleListeners}
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="min-w-0 flex-1 text-left"
        >
          <span className="flex min-w-0 items-start gap-2">
            <span
              className={cn(
                "mt-1.5 size-2 shrink-0 rounded-full",
                TASK_STATUS_DOT_COLORS[task.status],
              )}
            />
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block truncate text-sm font-medium text-foreground",
                  task.status === "done" && "text-muted-foreground line-through",
                )}
              >
                {task.title}
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                {task.due_time ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-3" aria-hidden="true" />
                    {task.due_time}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-medium",
                    TASK_STATUS_BADGE_CLASS[task.status],
                  )}
                >
                  {TASK_STATUS_LABELS[task.status]}
                </span>
                <span className="capitalize">{task.priority}</span>
              </span>
            </span>
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${task.title}`}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
