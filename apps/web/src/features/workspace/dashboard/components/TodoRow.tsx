import { Pencil, Trash2 } from "lucide-react";

import type { TodoRowProps } from "@/features/workspace/dashboard/types/components";
import { DragHandle } from "@/shared/components/DragHandle";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { useSortableRow } from "@/shared/hooks/useSortableRow";
import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@/shared/ui/checkbox";

export function TodoRow({ todo, sortable, onToggle, onEdit, onDelete }: TodoRowProps) {
  const { setNodeRef, style, handleProps, isDragging } = useSortableRow(todo.id);
  const done = todo.status ==="completed";
  const checkboxId = `todo-${todo.id}`;

  return (
    <li
      ref={sortable ? setNodeRef : undefined}
      style={sortable ? style : undefined}
      className={cn("relative flex items-center gap-1 bg-card py-1", isDragging && "z-10 opacity-70")}
    >
      {sortable ? <DragHandle label={`Reorder ${todo.title}`} handleProps={handleProps} /> : null}
      <label htmlFor={checkboxId} className="flex min-h-10 min-w-0 flex-1 cursor-pointer items-center gap-2.5 py-1">
        <Checkbox id={checkboxId} checked={done} onCheckedChange={() => onToggle(todo)} />
        <span className="min-w-0">
          <span className={cn("block break-words", done && "text-muted-foreground line-through")}>{todo.title}</span>
          {todo.description ? <span className="line-clamp-2 text-sm break-words text-muted-foreground">{todo.description}</span> : null}
        </span>
      </label>
      <RowActionsMenu
        label={`Actions for ${todo.title}`}
        actions={[
          { label: "Edit", icon: Pencil, onSelect: () => onEdit(todo) },
          { label: "Delete", icon: Trash2, destructive: true, onSelect: () => onDelete(todo) },
        ]}
      />
    </li>
  );
}
