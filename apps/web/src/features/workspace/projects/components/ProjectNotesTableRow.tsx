import { format } from "date-fns";
import { FileText, Trash2 } from "lucide-react";

import { buildProjectNotePath } from "@/app/constants/workspaceRoutes";
import { NOTES_GRID_CLASS } from "@/features/workspace/projects/constants/directory";
import type { ProjectNotesTableRowProps } from "@/features/workspace/projects/types/components";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { DragHandle } from "@/shared/components/DragHandle";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { NOTE_CATEGORY_LABELS } from "@/shared/constants/noteCategories";
import { useSortableRow } from "@/shared/hooks/useSortableRow";
import { cn } from "@/shared/lib/utils";

export function ProjectNotesTableRow({ projectId, note, onDelete }: ProjectNotesTableRowProps) {
  const { setNodeRef, style, handleProps, isDragging } = useSortableRow(note.id);
  const title = note.title.trim() || "Untitled note";

  const menu = (
    <RowActionsMenu
      label={`Actions for ${title}`}
      actions={[{ label: "Delete", icon: Trash2, destructive: true, onSelect: () => onDelete(note) }]}
    />
  );

  return (
    <DirectoryTableRow
      ref={setNodeRef}
      style={style}
      to={buildProjectNotePath(projectId, note.id)}
      label={`Open ${title}`}
      className={cn(
        "grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-x-2 gap-y-0.5 px-3 md:gap-x-4",
        NOTES_GRID_CLASS,
        isDragging && "z-10 opacity-70 shadow-md",
      )}
    >
      <DragHandle label={`Reorder ${title}`} handleProps={handleProps} />
      <p className="flex min-w-0 items-center gap-2.5">
        <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="truncate">{title}</span>
      </p>
      <div className="col-start-3 row-start-1 md:hidden">{menu}</div>
      <p className="col-start-2 w-fit rounded-full bg-muted px-2.5 py-0.5 text-xs md:col-start-auto">
        {NOTE_CATEGORY_LABELS[note.category]}
      </p>
      <p className="col-start-2 text-sm text-muted-foreground tabular-nums md:col-start-auto">
        {format(new Date(note.updated_at), "MMM d, yyyy")}
      </p>
      <div className="hidden md:flex md:justify-end">{menu}</div>
    </DirectoryTableRow>
  );
}
