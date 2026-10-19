import { useEffect, useMemo, useState } from "react";
import { Copy, FileText, Save, Trash2 } from "lucide-react";

import {
  DEFAULT_NOTE_CATEGORY,
  NOTE_CATEGORIES,
  NOTE_CATEGORY_LABELS,
  type NoteCategory,
} from "@/features/workspace/projects/constants/noteCategories";
import type { ProjectNoteEditorProps } from "@/features/workspace/projects/types/components";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import {
  containMinWidthClassName,
  glassPanelClassName,
} from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { useRegisterUnsavedChanges } from "@/shared/unsaved-changes/useRegisterUnsavedChanges";
import { showToast } from "@/shared/utils/showToast";
import { Button } from "@/shared/ui/button";

const categoryOptions = NOTE_CATEGORIES.map((category) => ({
  value: category,
  label: NOTE_CATEGORY_LABELS[category],
}));

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
  const [category, setCategory] = useState<NoteCategory>(
    note?.category ?? DEFAULT_NOTE_CATEGORY,
  );

  useEffect(() => {
    setTitle(note?.title ?? "");
    setBody(note?.body ?? "");
    setCategory(note?.category ?? DEFAULT_NOTE_CATEGORY);
  }, [note]);

  const baselineTitle = note?.title ?? "";
  const baselineBody = note?.body ?? "";
  const baselineCategory = note?.category ?? DEFAULT_NOTE_CATEGORY;

  const isDirty = useMemo(() => {
    if (!note) return false;
    return (
      title !== baselineTitle ||
      body !== baselineBody ||
      category !== baselineCategory
    );
  }, [
    note,
    title,
    body,
    category,
    baselineTitle,
    baselineBody,
    baselineCategory,
  ]);

  const { confirmIfDirty } = useRegisterUnsavedChanges({
    id: note ? `project-note:${note.id}` : "project-note:none",
    enabled: Boolean(note),
    isDirty,
    isCreate: isDraft,
    onSave: async () => {
      if (!note || !title.trim()) {
        showToast("error", "Note title is required");
        throw new Error("Note title is required");
      }
      await onSave(note.id, {
        title: title.trim(),
        body: body.trim() || null,
        category,
      });
    },
  });

  if (!note) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-col items-center justify-center p-8 text-center",
          glassPanelClassName,
          containMinWidthClassName,
        )}
      >
        <FileText className="size-16 text-muted-foreground/40" />
        <h3 className="mt-4 text-sm font-semibold">No note selected</h3>
        <p className="mt-1 max-w-60 text-xs text-muted-foreground">
          Create a note or select one from the list to start editing without
          leaving this project.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-[32rem] min-w-0 flex-1 flex-col",
        glassPanelClassName,
        containMinWidthClassName,
      )}
    >
      {/* Compact chrome — stays secondary to the document title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-5 py-3 sm:px-6">
        <OptionDropdown
          value={category}
          onChange={(next) => setCategory(next as NoteCategory)}
          options={categoryOptions}
          disabled={saving}
          placeholder="Category"
          className="w-[9.5rem] sm:w-[10.5rem]"
        />
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {isDraft ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 shrink-0"
              onClick={() => {
                if (!onDiscard) return;
                confirmIfDirty({
                  proceed: onDiscard,
                  title: "Discard new note?",
                  description:
                    "This note hasn’t been created yet. Create it, or close without saving.",
                });
              }}
              disabled={saving}
            >
              Cancel
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 text-muted-foreground"
                disabled={saving}
                onClick={() => void onDuplicate(note)}
              >
                <Copy className="mr-1 size-3.5" />
                Duplicate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 shrink-0 text-destructive hover:text-destructive"
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
                category,
              })
            }
          >
            <Save className="mr-1 size-3.5" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Document body — title + note share the same content column */}
      <div className="flex min-h-0 flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={cn(
            "w-full min-w-0 border-0 bg-transparent p-0 text-[1.65rem] font-semibold leading-snug tracking-tight text-foreground shadow-none",
            "placeholder:text-muted-foreground/55",
            "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
            containMinWidthClassName,
          )}
          placeholder={isDraft ? "Untitled note" : "Note title"}
          aria-label="Note title"
          autoFocus={isDraft}
        />

        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className={cn(
            "mt-4 min-h-[18rem] w-full flex-1 resize-none border-0 bg-transparent p-0 text-[15px] leading-7 text-foreground shadow-none",
            "placeholder:text-muted-foreground/60",
            "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
            containMinWidthClassName,
          )}
          placeholder="Start typing your plans, links, or notes..."
        />
      </div>
    </div>
  );
}
