import { Calendar, Clock3, Edit, MoreVertical, Trash2 } from "lucide-react";

import type { TaskListItemProps } from "@/features/tasks/types/components";
import {
  isClosedTaskStatus,
  TASK_STATUS_BADGE_CLASS,
  TASK_STATUS_LABELS,
} from "@/features/tasks/constants/taskStatus";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

export function TaskListItem({
  task,
  onEdit,
  onDelete,
}: TaskListItemProps) {
  const isClosed = isClosedTaskStatus(task.status);

  return (
    <div
      className={cn(
        "group flex min-w-0 items-start gap-3 px-4 py-3.5 transition-colors sm:items-center sm:gap-4 sm:px-5",
        "hover:bg-muted/40",
        isClosed && "bg-muted/20",
      )}
    >
      <button
        type="button"
        onClick={onEdit}
        className="min-w-0 flex-1 cursor-pointer text-left"
      >
        <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate text-sm font-semibold text-foreground",
                isClosed && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </p>
            {task.description?.trim() ? (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {task.description}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                task.priority === "high" && "bg-destructive/10 text-destructive",
                task.priority === "medium" && "bg-accent/10 text-accent",
                task.priority === "low" && "bg-secondary text-secondary-foreground",
              )}
            >
              {task.priority}
            </span>

            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                TASK_STATUS_BADGE_CLASS[task.status],
              )}
            >
              {TASK_STATUS_LABELS[task.status]}
            </span>

            {task.due_date ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Calendar className="size-3" aria-hidden="true" />
                {task.due_date}
                {task.due_time ? (
                  <>
                    <Clock3 className="ml-0.5 size-3" aria-hidden="true" />
                    {task.due_time}
                  </>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground opacity-70 transition group-hover:opacity-100"
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
  );
}
