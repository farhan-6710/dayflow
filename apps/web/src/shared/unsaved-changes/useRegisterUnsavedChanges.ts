import { useEffect, useLayoutEffect, useRef } from "react";

import { useUnsavedChangesContext } from "@/shared/unsaved-changes/unsavedChangesContext";

type UseRegisterUnsavedChangesOptions = {
  id: string;
  isDirty: boolean;
  isCreate?: boolean;
  onSave: () => Promise<void>;
  /** When false, the registration is removed (e.g. dialog closed). */
  enabled?: boolean;
};

/** Registers a form with the shell's unsaved-changes guard (in-app navigation and tab close). */
export function useRegisterUnsavedChanges({
  id,
  isDirty,
  isCreate = false,
  onSave,
  enabled = true,
}: UseRegisterUnsavedChangesOptions) {
  const { register, unregister, confirmIfDirty, leaveWithoutPrompt } = useUnsavedChangesContext();

  const onSaveRef = useRef(onSave);
  useLayoutEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!enabled) {
      unregister(id);
      return;
    }
    register({ id, isDirty, isCreate, onSave: () => onSaveRef.current() });
    return () => unregister(id);
  }, [enabled, id, isDirty, isCreate, register, unregister]);

  return { confirmIfDirty, leaveWithoutPrompt };
}
