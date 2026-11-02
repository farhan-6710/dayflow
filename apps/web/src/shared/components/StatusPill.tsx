import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type StatusPillProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
};

/** Active / inactive chip: success wash with a dot, or a muted neutral chip. */
export function StatusPill({ active, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
        active
          ? "border-success/40 bg-success/15 text-success-foreground"
          : "border-border bg-secondary text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", active ? "bg-success" : "bg-muted-foreground/60")}
      />
      {children}
    </span>
  );
}
