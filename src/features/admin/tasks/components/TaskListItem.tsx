import { Calendar, Clock3, Edit, MoreVertical, Trash2 } from "lucide-react";

import { tasksDirectoryConfig } from "@/features/admin/tasks/constants/tasksDirectory";
import type { TaskListItemProps } from "@/features/admin/tasks/types/components";
import {
  isClosedTaskStatus,
  TASK_STATUS_BADGE_CLASS,
  TASK_STATUS_LABELS,
} from "@/features/admin/tasks/constants/taskStatus";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
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
    <DirectoryTableRow
      onActivate={onEdit}
      className={cn(
        "group grid w-full items-center gap-4 px-6 py-4",
        tasksDirectoryConfig.gridClass,
        isClosed && "bg-muted/20",
      )}
    >
      <div className="min-w-0 text-left">
        <p className="truncate text-sm font-semibold text-foreground">
          {task.title}
        </p>
        {task.description?.trim() ? (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {task.description}
          </p>
        ) : null}
      </div>

      <div>
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
      </div>

      <div>
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            TASK_STATUS_BADGE_CLASS[task.status],
          )}
        >
          {TASK_STATUS_LABELS[task.status]}
        </span>
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        {task.due_date ? (
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{task.due_date}</span>
            {task.due_time ? (
              <>
                <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{task.due_time}</span>
              </>
            ) : null}
          </span>
        ) : (
          <span>—</span>
        )}
      </div>

      <div
        className="flex items-center justify-end"
        onClick={stopDirectoryRowNav}
        onKeyDown={(event) => event.stopPropagation()}
      >
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
    </DirectoryTableRow>
  );
}
