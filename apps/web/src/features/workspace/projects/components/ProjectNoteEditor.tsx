import { Bookmark, Copy, Trash2 } from "lucide-react";

import { useNoteEditor } from "@/features/workspace/projects/hooks/useNoteEditor";
import type { ProjectNoteEditorProps } from "@/features/workspace/projects/types/components";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { Reveal } from "@/shared/components/Reveal";
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
    <Reveal className="relative pb-1 pl-1">
    {/* A sheet behind, a bookmark and a folded corner, so the editor reads as a page. */}
    <div aria-hidden="true" className={cn(panelClassName, "absolute inset-x-0 top-1 bottom-0 right-1 bg-muted/40")} />
    <Bookmark aria-hidden="true" className="pointer-events-none absolute -top-1.5 left-5 z-10 size-6 fill-chart-1 text-chart-1" />
    <form onSubmit={editor.handleSubmit} className={cn(panelClassName, "relative flex min-h-[32rem] min-w-0 flex-col")}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 size-12 rounded-br-xl bg-linear-to-tl from-background from-50% to-muted to-50%"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3 pt-5">
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
    </Reveal>
  );
}
