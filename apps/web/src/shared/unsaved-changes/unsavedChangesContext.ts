import { createContext, useContext } from "react";

import type { UnsavedChangesContextValue } from "@/shared/unsaved-changes/types";

export const UnsavedChangesContext =
  createContext<UnsavedChangesContextValue | null>(null);

export function useUnsavedChangesContext(): UnsavedChangesContextValue {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error(
      "useUnsavedChangesContext must be used within UnsavedChangesProvider",
    );
  }
  return context;
}

/** Safe for optional wiring (e.g. page transition) outside the provider. */
export function useOptionalUnsavedChangesContext(): UnsavedChangesContextValue | null {
  return useContext(UnsavedChangesContext);
}
