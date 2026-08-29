import { cn } from "@/shared/lib/utils";

/** Clean, tight focus ring without offset for buttons, toggles, and selectors. */
export const focusRingClassName =
  "outline-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

/** Clean, tight focus ring for text inputs and textareas — direct primary border highlight with a soft primary glow. */
export const formControlFocusRingClassName =
  "outline-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring focus-visible:ring-primary";

export const formLabelClassName =
  "block text-xs font-semibold uppercase tracking-wider leading-snug text-muted-foreground";

export const formFieldGroupClassName = "flex flex-col gap-3";

export const formFieldClassName = cn(
  "mt-2 w-full rounded-lg border border-ring/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors",
  "placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring focus-visible:ring-primary",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "dark:border-input dark:bg-muted/40",
);

export function colorSwatchClassName(selected: boolean) {
  return cn(
    "size-8 shrink-0 rounded-full outline-none transition hover:scale-105 cursor-pointer",
    focusRingClassName,
    selected
      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
      : "ring-1 ring-border/60 hover:ring-border",
  );
}
