import {
  formInputClassName,
  formLabelClassName,
} from "@/shared/constants/formStyles";

export const authFormStyles = {
  label: formLabelClassName,
  input: formInputClassName,
  googleButton: "h-10 w-full",
  oauthButton: "h-10 w-full",
  submitButton: "h-10 w-full",
  divider:
    "bg-background px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase",
  switchLink: "font-medium text-foreground underline-offset-4 hover:underline",
  errorAlert:
    "rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive",
  successAlert:
    "rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-foreground",
} as const;
