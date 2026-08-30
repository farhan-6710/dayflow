import { cn } from "@/shared/lib/utils";

/** Clean, tight focus ring without offset for buttons, toggles, and selectors. */
export const focusRingClassName =
  "outline-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

/** Clean, tight focus ring for text inputs and textareas — primary border + soft glow. */
export const formControlFocusRingClassName =
  "outline-none transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary";

export const formLabelClassName =
  "block text-xs font-semibold uppercase tracking-wider leading-snug text-muted-foreground";

export const formFieldGroupClassName = "flex flex-col gap-3";

/** Canonical text input styles — used by shared/ui/input and auth forms. */
export const formInputClassName = cn(
  "h-10 w-full min-w-0 rounded-lg border border-ring/60 bg-background px-3 py-2 text-sm text-foreground shadow-xs transition-[border-color,box-shadow]",
  "placeholder:text-muted-foreground",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
  "dark:border-input dark:bg-muted/40 dark:disabled:bg-muted/30",
  "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/30",
  formControlFocusRingClassName,
);

/** Canonical textarea styles — same surface as inputs. */
export const formTextareaClassName = cn(
  formInputClassName,
  "h-auto min-h-20 resize-y py-2",
);

/** Raw input/textarea on labeled fields (adds top margin). */
export const formFieldClassName = cn(formInputClassName, "mt-2");

export function colorSwatchClassName(selected: boolean) {
  return cn(
    "size-8 shrink-0 rounded-full outline-none transition hover:scale-105 cursor-pointer",
    focusRingClassName,
    selected
      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
      : "ring-1 ring-border/60 hover:ring-border",
  );
}
