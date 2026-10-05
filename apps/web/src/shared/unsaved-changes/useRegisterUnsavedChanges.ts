import { useEffect, useRef } from "react";

import { useUnsavedChangesContext } from "@/shared/unsaved-changes/unsavedChangesContext";
import type { UnsavedChangesRegistration } from "@/shared/unsaved-changes/types";

type UseRegisterUnsavedChangesOptions = {
  id: string;
  isDirty: boolean;
  isCreate?: boolean;
  onSave: () => Promise<void>;
  /** When false, registration is removed (e.g. dialog closed). Default true. */
  enabled?: boolean;
};

/**
 * Registers the current form with the app-wide unsaved-changes guard
 * (in-app navigation, browser tab close, desktop window close).
 */
export function useRegisterUnsavedChanges({
  id,
  isDirty,
  isCreate = false,
  onSave,
  enabled = true,
}: UseRegisterUnsavedChangesOptions) {
  const { register, unregister, confirmIfDirty } = useUnsavedChangesContext();
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!enabled) {
      unregister(id);
      return;
    }

    const registration: UnsavedChangesRegistration = {
      id,
      isDirty,
      isCreate,
      onSave: () => onSaveRef.current(),
    };
    register(registration);

    return () => unregister(id);
  }, [enabled, id, isDirty, isCreate, register, unregister]);

  return { confirmIfDirty };
}
