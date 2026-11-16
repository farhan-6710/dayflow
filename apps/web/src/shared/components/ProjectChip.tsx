import type { CSSProperties } from "react";
import { Folder } from "lucide-react";

import { resolveProjectColor } from "@/shared/constants/projectColors";
import { cn } from "@/shared/lib/utils";
import type { ProjectChipProps } from "@/shared/types/components";

/** The project's own colour from the database, shown as its theme shade (see projectColors.ts). */
export function ProjectChip({ color, className }: ProjectChipProps) {
  return (
    <span
      aria-hidden="true"
      style={{ "--chip": resolveProjectColor(color) } as CSSProperties}
      className={cn("project-chip inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-white", className)}
    >
      <Folder className="size-4 drop-shadow-[0_1px_1px_rgb(0_0_0/0.18)]" />
    </span>
  );
}
