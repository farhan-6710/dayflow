import { useState, type FormEvent } from "react";

import { useUnsavedDialogClose } from "@/shared/unsaved-changes/useUnsavedDialogClose";

type Options<V> = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreate: boolean;
  initialValues: V;
  canSave: (values: V) => boolean;
  /** Throws on failure. The caller's save shows the toast. */
  save: (values: V) => Promise<void>;
};

/** Form state for a dialog: resets on open, tracks dirty for the unsaved-changes guard. */
export function useDialogForm<V extends object>({
  id,
  open,
  onOpenChange,
  isCreate,
  initialValues,
  canSave,
  save,
}: Options<V>) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(initialValues);
    }
  }

  async function submit() {
    setSaving(true);
    try {
      await save(values);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  const { handleOpenChange } = useUnsavedDialogClose({
    id,
    open,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    isCreate,
    onOpenChange,
    onSave: submit,
  });

  function setField<K extends keyof V>(field: K, value: V[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function patch(changes: Partial<V>) {
    setValues((current) => ({ ...current, ...changes }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSave(values)) {
      submit().catch(() => undefined);
    }
  }

  return { values, setField, patch, saving, handleOpenChange, handleSubmit, canSubmit: canSave(values) };
}
