export type UnsavedChangesRegistration = {
  id: string;
  isDirty: boolean;
  /** When true, primary action label becomes "Create" instead of "Save". */
  isCreate?: boolean;
  onSave: () => Promise<void>;
};

export type UnsavedChangesConfirmOptions = {
  /** Called after save/discard when the user confirms leaving. */
  proceed: () => void | Promise<void>;
  /** Optional override when multiple dirty forms exist. */
  title?: string;
  description?: string;
};

export type UnsavedChangesContextValue = {
  isDirty: boolean;
  register: (registration: UnsavedChangesRegistration) => void;
  unregister: (id: string) => void;
  /** If dirty, show modal; otherwise run proceed immediately. */
  confirmIfDirty: (options: UnsavedChangesConfirmOptions) => void;
};
