import {
  Check,
  Edit,
  GripVertical,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import type { TodoListItemProps } from "@/features/workspace/dashboard/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function TodoListItem({
  todo,
  busy,
  exiting = false,
  sortable = false,
  dragHandleAttributes,
  dragHandleListeners,
  sortableStyle,
  isDragging = false,
  setSortableRef,
  onToggle,
  onEdit,
  onDelete,
  onExitComplete,
}: TodoListItemProps) {
  const completed = todo.status === "completed";

  return (
    <div
      ref={setSortableRef}
      data-slot="todo-row"
      style={sortableStyle}
      className={cn(isDragging && "relative z-10")}
    >
      <motion.div
        layout={!exiting && !isDragging}
        initial={false}
        animate={
          exiting
            ? { x: 56, opacity: 0 }
            : { x: 0, opacity: isDragging ? 0.55 : 1 }
        }
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (exiting) onExitComplete?.();
        }}
        className={cn(
          "surface-chip flex min-w-0 items-start gap-2 rounded-[0.65rem] bg-[color-mix(in_srgb,var(--tint)_5%,var(--card))] py-2.5 pr-1.5 pl-2 transition-colors hover:border-tint/40",
          isDragging && "shadow-md",
        )}
      >
        {sortable ? (
          <button
            type="button"
            className="mt-0.5 flex size-5 shrink-0 cursor-grab items-center justify-center text-muted-foreground touch-none hover:text-foreground active:cursor-grabbing"
            aria-label={`Reorder ${todo.title}`}
            disabled={busy || exiting}
            {...dragHandleAttributes}
            {...dragHandleListeners}
          >
            <GripVertical className="size-4" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={onToggle}
          disabled={busy || exiting}
          aria-label={
            completed ? `Mark ${todo.title} pending` : `Complete ${todo.title}`
          }
          className={cn(
            "mt-0.5 flex size-[1.15rem] shrink-0 items-center justify-center rounded-full border transition-colors",
            completed
              ? "border-primary bg-primary text-primary-foreground"
              : "border-foreground/25 bg-transparent hover:border-primary",
            (busy || exiting) && "opacity-60",
          )}
        >
          {busy ? (
            <Loader2 className="size-3 animate-spin" aria-hidden="true" />
          ) : completed ? (
            <Check
              className="size-3.5 animate-check-pop"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          ) : null}
        </button>

        <button
          type="button"
          onClick={onEdit}
          disabled={busy || exiting}
          className="min-w-0 flex-1 text-left disabled:opacity-60"
        >
          <p
            className={cn(
              "truncate text-sm font-medium text-foreground",
              completed && "text-muted-foreground line-through",
            )}
          >
            {todo.title}
          </p>
          {todo.description ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {todo.description}
            </p>
          ) : null}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-muted-foreground"
              disabled={busy || exiting}
              aria-label={`Actions for ${todo.title}`}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              variant="destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </div>
  );
}
