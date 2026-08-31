import { Trash2 } from "lucide-react";

import { formatNoteIndex } from "@/features/workspace/projects/constants/projectNotes";
import type { ProjectNotesListProps } from "@/features/workspace/projects/types/components";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function ProjectNotesList({
  notes,
  draftNote,
  selectedNoteId,
  loading,
  onSelect,
  onDelete,
}: ProjectNotesListProps) {
  const items = draftNote ? [draftNote, ...notes] : notes;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col rounded-2xl border border-border bg-card p-4 md:col-span-1",
        containMinWidthClassName,
      )}
    >
      <h3 className="border-b border-border pb-3 text-sm font-semibold tracking-tight">
        Project Notes
      </h3>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">Loading notes...</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">No notes in this project yet.</div>
        ) : (
          items.map((note, index) => {
            const isDraft = Boolean(draftNote && note.id === draftNote.id);
            const selected = selectedNoteId === note.id;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => onSelect(note.id)}
                className={cn(
                  "group flex w-full cursor-pointer flex-col gap-1.5 rounded-xl border border-border/80 p-3 text-left transition",
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "bg-background text-foreground hover:bg-muted",
                )}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 font-mono text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {formatNoteIndex(isDraft ? notes.length : index - (draftNote ? 1 : 0))}
                    </span>
                    <span className="truncate text-sm leading-snug font-semibold">
                      {isDraft ? note.title || "New note" : note.title || "Untitled Note"}
                    </span>
                  </span>
                  {isDraft ? null : (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(note.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          onDelete(note.id);
                        }
                      }}
                      className="shrink-0 p-0.5 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </span>
                  )}
                </div>
                <span className="text-3xs text-muted-foreground">
                  {isDraft
                    ? "Unsaved draft"
                    : note.updated_at
                      ? new Date(note.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
