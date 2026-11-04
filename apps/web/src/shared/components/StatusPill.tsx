import { cn } from "@/shared/lib/utils";
import type { StatusPillProps } from "@/shared/types/components";

/** Active / inactive chip. */
export function StatusPill({ active, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-full border px-2.5 text-xs",
        active ? "border-success/25 bg-success/15 text-success-text" : "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", active ? "bg-success" : "bg-muted-foreground/60")}
      />
      {children}
    </span>
  );
}
