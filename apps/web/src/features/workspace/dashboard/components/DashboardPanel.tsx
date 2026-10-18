import type { ReactNode } from "react";

import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

type DashboardPanelProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardPanel({
  children,
  className,
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
