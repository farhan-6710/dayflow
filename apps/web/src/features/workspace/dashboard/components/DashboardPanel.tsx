import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type DashboardPanelProps = {
  children: ReactNode;
  className?: string;
  variant?: "panel" | "hero";
};

export function DashboardPanel({
  children,
  className,
  variant = "panel",
}: DashboardPanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card shadow-sm transition-all",
        variant === "hero" && "border-border bg-card shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
