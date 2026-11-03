import { format } from "date-fns";
import { Trash2 } from "lucide-react";

import { buildProjectNotePath } from "@/app/constants/workspaceRoutes";
import { NOTES_GRID_CLASS } from "@/features/workspace/projects/constants/directory";
import type { ProjectNotesTableRowProps } from "@/features/workspace/projects/types/components";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { DragHandle } from "@/shared/components/DragHandle";
import { NOTE_CATEGORY_LABELS } from "@/shared/constants/noteCategories";
import { useSortableRow } from "@/shared/hooks/useSortableRow";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";

export function ProjectNotesTableRow({ projectId, note, onDelete }: ProjectNotesTableRowProps) {
  const { setNodeRef, style, handleProps, isDragging } = useSortableRow(note.id);
  const title = note.title.trim() || "Untitled note";
  const preview = note.body?.replace(/\s+/g, " ").trim();

  const deleteButton = (
    <Button
      variant="ghost"
      size="icon-lg"
      className="text-muted-foreground hover:text-destructive"
      aria-label={`Delete ${title}`}
      onClick={(event) => {
        stopDirectoryRowNav(event);
        onDelete(note);
      }}
    >
      <Trash2 aria-hidden="true" />
    </Button>
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
      <p className="min-w-0 truncate">{title}</p>
      <div className="col-start-3 row-start-1 md:hidden">{deleteButton}</div>
      <p className="col-start-2 truncate text-sm text-muted-foreground md:col-start-auto">
        {NOTE_CATEGORY_LABELS[note.category]}
      </p>
      <p className="col-start-2 truncate text-sm text-muted-foreground md:col-start-auto">{preview || "No content yet"}</p>
      <p className="col-start-2 text-sm text-muted-foreground tabular-nums md:col-start-auto">
        {format(new Date(note.updated_at), "MMM d, yyyy")}
      </p>
      <div className="hidden md:block">{deleteButton}</div>
    </DirectoryTableRow>
  );
}
