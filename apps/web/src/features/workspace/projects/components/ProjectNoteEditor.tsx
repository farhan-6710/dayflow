import { Copy, Trash2 } from "lucide-react";

import { useNoteEditor } from "@/features/workspace/projects/hooks/useNoteEditor";
import type { ProjectNoteEditorProps } from "@/features/workspace/projects/types/components";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { NOTE_CATEGORIES, NOTE_CATEGORY_LABELS, type NoteCategory } from "@/shared/constants/noteCategories";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

const categoryOptions = NOTE_CATEGORIES.map((category) => ({ value: category, label: NOTE_CATEGORY_LABELS[category] }));

export function ProjectNoteEditor({
  note,
  canEdit,
  onSave,
  onCreated,
  onDuplicate,
  onDelete,
  onDiscard,
}: ProjectNoteEditorProps) {
  const editor = useNoteEditor({ note, onSave, onCreated });

  return (
    <form onSubmit={editor.handleSubmit} className={cn(panelClassName, "flex min-h-[28rem] min-w-0 flex-col")}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
        <OptionDropdown
          label="Category"
          value={editor.category}
          onChange={(next) => editor.setCategory(next as NoteCategory)}
          options={categoryOptions}
          disabled={editor.saving || !canEdit}
          className="w-40 bg-background"
        />
        <div className="flex flex-wrap items-center gap-1">
          {note ? (
            <>
              <Button
                type="button"
                variant="ghost"
                className="h-10"
                disabled={editor.saving || !canEdit}
                onClick={() => editor.confirmIfDirty({ proceed: onDuplicate })}
              >
                <Copy aria-hidden="true" />
                Duplicate
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 [&_svg]:text-destructive"
                disabled={editor.saving}
                onClick={onDelete}
              >
                <Trash2 aria-hidden="true" />
                Delete
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="h-10"
              disabled={editor.saving}
              onClick={() =>
                editor.confirmIfDirty({
                  proceed: onDiscard,
                  description: "This note hasn't been created yet. Create it, or close without saving.",
                })
              }
            >
              Cancel
            </Button>
          )}
          <SubmitButton loading={editor.saving} disabled={!canEdit || !editor.title.trim() || (Boolean(note) && !editor.isDirty)}>
            {note ? "Save" : "Create note"}
          </SubmitButton>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
        <input
          value={editor.title}
          onChange={(event) => editor.setTitle(event.target.value)}
          placeholder="Untitled note"
          aria-label="Note title"
          autoFocus={!note}
          readOnly={!canEdit}
          className="w-full min-w-0 rounded-md bg-transparent text-3xl leading-tight outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
        <Textarea
          value={editor.body}
          onChange={(event) => editor.setBody(event.target.value)}
          placeholder="Plans, decisions, anything worth keeping…"
          aria-label="Note body"
          readOnly={!canEdit}
          className="min-h-72 flex-1 resize-none border-0 bg-transparent p-0 font-serif text-sm leading-7 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
    </form>
  );
}
