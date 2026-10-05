import { useUnsavedChangesContext } from "@/shared/unsaved-changes/unsavedChangesContext";
import { useRegisterUnsavedChanges } from "@/shared/unsaved-changes/useRegisterUnsavedChanges";

type UseUnsavedDialogCloseOptions = {
  id: string;
  open: boolean;
  isDirty: boolean;
  isCreate?: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => Promise<void>;
};

/**
 * Guards dialog dismiss (overlay / Escape / Cancel) when the form is dirty.
 */
export function useUnsavedDialogClose({
  id,
  open,
  isDirty,
  isCreate = false,
  onOpenChange,
  onSave,
}: UseUnsavedDialogCloseOptions) {
  const { confirmIfDirty } = useUnsavedChangesContext();

  useRegisterUnsavedChanges({
    id,
    enabled: open,
    isDirty: open && isDirty,
    isCreate,
    onSave,
  });

  function handleOpenChange(next: boolean) {
    if (next) {
      onOpenChange(true);
      return;
    }

    confirmIfDirty({
      proceed: () => onOpenChange(false),
      title: "Unsaved changes",
      description: isCreate
        ? "This hasn’t been created yet. Create it, or close without saving."
        : "You have changes that haven’t been saved. Save before closing, or close without saving.",
    });
  }

  return { handleOpenChange };
}
