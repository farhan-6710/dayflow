import { GripVertical } from "lucide-react";

import type { DragHandleProps } from "@/shared/types/components";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";

export function DragHandle({ label, handleProps }: DragHandleProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={stopDirectoryRowNav}
      className="flex size-10 cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 active:cursor-grabbing"
      {...handleProps}
    >
      <GripVertical className="size-4" aria-hidden="true" />
    </button>
  );
}
