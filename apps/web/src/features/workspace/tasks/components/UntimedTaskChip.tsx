import { TASK_BLOCK_CLASS } from "@/features/workspace/tasks/constants/calendar";
import type { UntimedTaskChipProps } from "@/features/workspace/tasks/types/components";
import { cn } from "@/shared/lib/utils";

/** A task with no time on the timeline. */
export function UntimedTaskChip({ task, onOpen }: UntimedTaskChipProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className={cn(
        "w-full truncate rounded border-l-4 px-1.5 py-0.5 text-left text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        TASK_BLOCK_CLASS[task.status],
      )}
    >
      {task.title}
    </button>
  );
}
