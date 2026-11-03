export type UnsavedChangesRegistration = {
  id: string;
  isDirty: boolean;
  /** When true, the primary action reads "Create" instead of "Save". */
  isCreate?: boolean;
  onSave: () => Promise<void>;
};

export type UnsavedChangesConfirmOptions = {
  /** Called after save or discard, when the user confirms leaving. */
  proceed: () => void | Promise<void>;
  title?: string;
  description?: string;
};

export type UnsavedChangesContextValue = {
  isDirty: boolean;
  register: (registration: UnsavedChangesRegistration) => void;
  unregister: (id: string) => void;
  /** If dirty, shows the modal; otherwise runs `proceed` immediately. */
  confirmIfDirty: (options: UnsavedChangesConfirmOptions) => void;
  /** Runs a navigation that must not prompt, e.g. right after saving or deleting. */
  leaveWithoutPrompt: (proceed: () => void | Promise<void>) => Promise<void>;
};

export type UnsavedChangesModalProps = {
  open: boolean;
  title: string;
  description: string;
  saveLabel: string;
  loading: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
  onSave: () => void;
};
