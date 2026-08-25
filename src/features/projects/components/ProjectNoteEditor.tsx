import { useEffect, useState } from "react";
import { Copy, FileText, Save, Trash2 } from "lucide-react";

import type { ProjectNoteEditorProps } from "@/features/projects/types/components";
import {
  containMinWidthClassName,
  toolbarActionsClassName,
  toolbarRowClassName,
} from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function ProjectNoteEditor({
  note,
  isDraft,
  saving,
  onSave,
  onDuplicate,
  onDelete,
  onDiscard,
}: ProjectNoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.body ?? "");

  useEffect(() => {
    setTitle(note?.title ?? "");
    setBody(note?.body ?? "");
  }, [note]);

  if (!note) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-2xs",
          containMinWidthClassName,
        )}
      >
        <FileText className="size-16 text-muted-foreground/40" />
        <h3 className="mt-4 text-sm font-semibold">No note selected</h3>
        <p className="mt-1 max-w-60 text-xs text-muted-foreground">
          Create a note or select one from the list to start editing without leaving this project.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-6 shadow-2xs",
        containMinWidthClassName,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        <div className={cn(toolbarRowClassName, "border-b border-border pb-4")}>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={cn(
              "h-8 w-full min-w-0 border-none p-0 text-lg font-bold shadow-none focus-visible:ring-0",
              containMinWidthClassName,
            )}
            placeholder={isDraft ? "New note title" : "Note Title"}
            autoFocus={isDraft}
          />
          <div className={toolbarActionsClassName}>
            {isDraft ? (
              <Button variant="outline" size="sm" className="h-8 shrink-0" onClick={onDiscard} disabled={saving}>
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0"
                  disabled={saving}
                  onClick={() => void onDuplicate(note)}
                >
                  <Copy className="mr-1 size-3.5" />
                  Duplicate
                </Button>
                <Button
                  variant="destructive-outline"
                  size="sm"
                  className="h-8 shrink-0"
                  disabled={saving}
                  onClick={() => onDelete(note.id)}
                >
                  <Trash2 className="mr-1 size-3.5" />
                  Delete
                </Button>
              </>
            )}
            <Button
              size="sm"
              className="h-8 shrink-0"
              disabled={saving || !title.trim()}
              onClick={() =>
                void onSave(note.id, {
                  title: title.trim(),
                  body: body.trim() || null,
                })
              }
            >
              <Save className="mr-1 size-3.5" />
              {saving ? "Saving..." : "Save Note"}
            </Button>
          </div>
        </div>

        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="w-full flex-1 resize-none border-none bg-transparent p-0 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
          placeholder="Start typing your plans, links, or notes..."
        />
      </div>
    </div>
  );
}
