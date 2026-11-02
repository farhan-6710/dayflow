import { cn } from "@/shared/lib/utils";

/** Prevent grid/flex children from forcing horizontal overflow. */
export const containMinWidthClassName = "min-w-0";

/** Raised cream panel — the base surface for every card, table and section. */
export const glassPanelClassName = "surface-elevated rounded-[1.25rem]";

/** Raised panel that lifts on hover (clickable cards). */
export const raisedPanelClassName = cn(
  glassPanelClassName,
  "transition-transform hover:-translate-y-0.5",
);

/** Same surface without hover lift — large tables, editors, calendars. */
export const raisedStaticPanelClassName = glassPanelClassName;

/** Nested row / chip inside a raised panel. */
export const insetChipClassName = "surface-chip rounded-[0.8rem]";

/** Section heading inside a raised panel (Ovo, bold). */
export const panelTitleClassName = "pl-1 text-2xl leading-none font-bold";

/** Supporting copy under a panel heading. */
export const panelDescriptionClassName = "mt-2 pl-1 text-sm text-foreground/75";

/** Filter/toolbar row: search or input + one or more fixed controls. */
export const filterBarClassName = cn(
  "grid grid-cols-1 gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center",
  glassPanelClassName,
);

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

/** Amber eyebrow text used for kickers above headings. */
export const eyebrowTextClassName = "text-primary-text";

export function toolbarRowClassNames(className?: string) {
  return cn(toolbarRowClassName, className);
}

export function toolbarActionsClassNames(className?: string) {
  return cn(toolbarActionsClassName, className);
}
