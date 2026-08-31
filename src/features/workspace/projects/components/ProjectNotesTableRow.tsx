import { format } from "date-fns";
import { Trash2 } from "lucide-react";

import { NOTES_DIRECTORY_ROW_GRID_CLASS } from "@/features/workspace/projects/constants/notesDirectory";
import { buildProjectNotePath } from "@/features/workspace/projects/constants/routes";
import type { ProjectNotesTableRowProps } from "@/features/workspace/projects/types/components";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

function noteDescriptionPreview(body: string | null): string | null {
  const text = body?.replace(/\s+/g, " ").trim();
  return text || null;
}

export function ProjectNotesTableRow({
  projectId,
  note,
  onDeleteNote,
}: ProjectNotesTableRowProps) {
  const notePath = buildProjectNotePath(projectId, note.id);
  const title = note.title.trim() || "Untitled note";
  const description = noteDescriptionPreview(note.body);

  return (
    <DirectoryTableRow
      to={notePath}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        NOTES_DIRECTORY_ROW_GRID_CLASS,
      )}
    >
      <div className="min-w-0 text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          NOTE TITLE
        </span>
        <span className="block truncate">{title}</span>
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          DESCRIPTION
        </span>
        {description ? (
          <p className="truncate" title={description}>
            {description}
          </p>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          UPDATED
        </span>
        {note.updated_at
          ? format(new Date(note.updated_at), "MMM d, yyyy")
          : "—"}
      </div>

      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-destructive"
          onClick={(event) => {
            stopDirectoryRowNav(event);
            onDeleteNote(note);
          }}
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only">Delete {title}</span>
        </Button>
      </div>
    </DirectoryTableRow>
  );
}
