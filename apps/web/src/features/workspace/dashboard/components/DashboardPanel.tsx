import type { ReactNode } from "react";

import { raisedPanelClassName } from "@/shared/constants/layoutStyles";
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
    <div className={cn("relative", raisedPanelClassName, className)}>
      {children}
    </div>
  );
}
