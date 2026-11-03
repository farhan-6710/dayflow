import { cn } from "@/shared/lib/utils";
import type { AuthFormAlertProps } from "@/shared/auth/types/components";

export function AuthFormAlert({ message, variant }: AuthFormAlertProps) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3 py-2.5 text-sm text-pretty",
        variant === "error" ? "border-destructive/40 bg-destructive/10" : "border-border bg-card",
      )}
    >
      {message}
    </p>
  );
}
