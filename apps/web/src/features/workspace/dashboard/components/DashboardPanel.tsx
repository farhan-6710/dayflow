import type { ReactNode } from "react";

import { glassPanelClassName } from "@/shared/constants/layoutStyles";
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
        "relative transition-all",
        glassPanelClassName,
        className,
      )}
    >
      {children}
    </div>
  );
}
