import { cn } from "@/shared/lib/utils";

/** Prevent grid/flex children from forcing horizontal overflow. */
export const containMinWidthClassName = "min-w-0";

/** Filter/toolbar row: search or input + one or more fixed controls. */
export const filterBarClassName =
  "grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-4 shadow-2xs sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center";

/** Editor/toolbar row: primary field + trailing actions. */
export const toolbarRowClassName =
  "grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center";

/** Trailing actions beside a flexible field (dropdowns, buttons). */
export const toolbarActionsClassName =
  "flex min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end";

/** Compact inline form: input + submit button. */
export const inlineFormClassName = "flex min-w-0 items-center gap-2";

/** Standard width for compact filter/action dropdowns. */
export const compactDropdownClassName = "w-full sm:w-40";

export function toolbarRowClassNames(className?: string) {
  return cn(toolbarRowClassName, className);
}

export function toolbarActionsClassNames(className?: string) {
  return cn(toolbarActionsClassName, className);
}
