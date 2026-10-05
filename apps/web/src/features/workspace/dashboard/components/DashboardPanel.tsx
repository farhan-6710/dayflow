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
        "relative rounded-2xl border border-white/70 bg-white/60 shadow-[0_8px_32px_0_rgba(15,23,42,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl backdrop-saturate-150 transition-all dark:border-white/12 dark:bg-card/45 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.08)]",
        variant === "hero" &&
          "border-white/80 bg-white/70 dark:border-white/15 dark:bg-card/55",
        className,
      )}
    >
      {children}
    </div>
  );
}
