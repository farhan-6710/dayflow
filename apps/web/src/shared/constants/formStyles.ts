import { cn } from "@/shared/lib/utils";

/** Focus ring for buttons, toggles, and selectors — ring token at half strength. */
export const focusRingClassName =
  "outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/** Focus ring for text inputs and textareas. */
export const formControlFocusRingClassName =
  "outline-none transition-[color,border-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export const formLabelClassName =
  "flex w-fit items-center gap-2 text-sm leading-snug font-medium select-none";

export const formFieldGroupClassName = "flex flex-col gap-3";

/** Canonical text input styles — used by shared/ui/input and auth forms. */
export const formInputClassName = cn(
  "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base md:text-sm text-foreground",
  "placeholder:text-muted-foreground",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
  "dark:bg-input/30 dark:disabled:bg-input/80",
  "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  formControlFocusRingClassName,
);

/** Shared trigger surface for selects / dropdowns — same field surface as inputs. */
export const formTriggerClassName = cn(
  "rounded-lg border border-input bg-transparent text-sm text-foreground",
  "dark:bg-input/30 dark:hover:bg-input/50",
  focusRingClassName,
);

/** Canonical textarea styles — same surface as inputs. */
export const formTextareaClassName = cn(
  formInputClassName,
  "field-sizing-content h-auto min-h-20 resize-y py-2",
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
