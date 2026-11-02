import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type FluidWaveItemProps = {
  /** Kept for call-site ordering; the entrance choreographer cascades in document order. */
  index?: number;
  className?: string;
  children: ReactNode;
};

/** Content section that rises in once it scrolls into view (`animate-enter`). */
export function FluidWaveItem({ className, children }: FluidWaveItemProps) {
  return <div className={cn("animate-enter min-w-0", className)}>{children}</div>;
}
