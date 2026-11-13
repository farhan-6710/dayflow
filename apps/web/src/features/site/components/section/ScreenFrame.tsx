import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

/**
 * An app window around workspace screenshots: a slim title bar with three dots, then the content at the
 * captures' own ratio so nothing is cropped. Used by the home hero and the "Our features" chapters.
 */
export function ScreenFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-xl", className)}>
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-muted-foreground/40" />
        <span className="size-2.5 rounded-full bg-muted-foreground/40" />
        <span className="size-2.5 rounded-full bg-muted-foreground/40" />
      </div>
      <div className="relative aspect-[2000/1098]">{children}</div>
    </div>
  );
}
