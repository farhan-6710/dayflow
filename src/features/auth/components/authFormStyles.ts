import { formControlFocusRingClassName, formLabelClassName } from "@/shared/constants/formStyles";

export const authFormStyles = {
  label: formLabelClassName,
  input: `h-10 rounded-lg border border-ring/60 bg-background px-3 text-sm text-foreground shadow-xs transition-[border-color,box-shadow] placeholder:text-muted-foreground dark:bg-card/80 dark:border-border ${formControlFocusRingClassName}`,
  googleButton:
    "h-10 w-full rounded-full border border-ring/60 bg-card text-sm font-medium text-foreground shadow-xs hover:bg-muted/50",
  oauthButton:
    "h-10 w-full rounded-full border border-ring/60 bg-card text-sm font-medium text-foreground shadow-xs hover:bg-muted/50",
  submitButton: "h-10 w-full rounded-full font-medium shadow-sm",
  divider:
    "bg-card px-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase",
  errorAlert:
    "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive",
  successAlert:
    "rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm text-foreground",
} as const;
