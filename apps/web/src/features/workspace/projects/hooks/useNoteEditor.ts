import { useState, type FormEvent } from "react";

import type { NoteSavePayload } from "@/features/workspace/projects/types/components";
import { DEFAULT_NOTE_CATEGORY, type NoteCategory } from "@/shared/constants/noteCategories";
import type { Note } from "@/shared/types/types";
import { useRegisterUnsavedChanges } from "@/shared/unsaved-changes/useRegisterUnsavedChanges";
import { showToast } from "@/shared/utils/showToast";

type UseNoteEditorOptions = {
  note: Note | null;
  /** Returns the created note's id when this was a draft. */
  onSave: (payload: NoteSavePayload) => Promise<string | null>;
  onCreated: (noteId: string) => void;
};

export function useNoteEditor({ note, onSave, onCreated }: UseNoteEditorOptions) {
  const initialTitle = note?.title ?? "";
  const initialBody = note?.body ?? "";
  const initialCategory = note?.category ?? DEFAULT_NOTE_CATEGORY;
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [category, setCategory] = useState<NoteCategory>(initialCategory);
  const [saving, setSaving] = useState(false);
  const isDirty = title !== initialTitle || body !== initialBody || category !== initialCategory;

  async function save() {
    const trimmed = title.trim();
    if (!trimmed) {
      showToast("error", "Give the note a title.");
      throw new Error("Note title is required.");
    }
    setSaving(true);
    try {
      return await onSave({ title: trimmed, body: body.trim() || null, category });
    } finally {
      setSaving(false);
    }
  }

  const { confirmIfDirty, leaveWithoutPrompt } = useRegisterUnsavedChanges({
    id: "project-note-editor",
    isDirty,
    isCreate: !note,
    // Leaving through the modal goes on to wherever the user was heading, so no redirect here.
    onSave: async () => {
      await save();
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save()
      .then((createdId) => {
        if (createdId) {
          void leaveWithoutPrompt(() => onCreated(createdId));
        }
      })
      .catch(() => undefined);
  }

  return {
    title,
    setTitle,
    body,
    setBody,
    category,
    setCategory,
    saving,
    isDirty,
    handleSubmit,
    confirmIfDirty,
    leaveWithoutPrompt,
  };
}
