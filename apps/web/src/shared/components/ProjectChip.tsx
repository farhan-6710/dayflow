import { Folder } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { ProjectChipProps } from "@/shared/types/components";

/** The project's own colour from the database, the one hex exception in DESIGN.md. */
export function ProjectChip({ color, className }: ProjectChipProps) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: color }}
      className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-white", className)}
    >
      <Folder className="size-4" />
    </span>
  );
}
