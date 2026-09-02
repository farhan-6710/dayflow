import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { format } from "date-fns";

import type { Task } from "@/services/tasksService";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

type FocusListItemProps = {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
};

function formatDueDate(dueDate: string) {
  return format(new Date(`${dueDate}T00:00:00`), "MMM d");
}

export function FocusListItem({ task, onEdit, onDelete }: FocusListItemProps) {
  return (
    <div className="flex min-w-0 items-start gap-2 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
        {task.description ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {task.description}
          </p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {task.due_date ? (
            <span className="rounded px-1.5 py-px text-[10px] font-medium text-muted-foreground">
              {formatDueDate(task.due_date)}
              {task.due_time ? ` · ${task.due_time}` : ""}
            </span>
          ) : null}
          <span
            className={cn(
              "rounded px-1.5 py-px text-[10px] font-medium uppercase tracking-wide",
              task.priority === "high" && "text-destructive",
              task.priority === "medium" && "text-accent",
              task.priority === "low" && "text-muted-foreground",
            )}
          >
            {task.priority}
          </span>
        </div>
      </div>

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
  );
}
