import { TaskStatusBadge } from "@/features/workspace/tasks/components/TaskStatusBadge";
import { TASK_BLOCK_CLASS } from "@/features/workspace/tasks/constants/calendar";
import type { TaskBlockProps } from "@/features/workspace/tasks/types/components";
import { formatTaskTimeRange } from "@/features/workspace/tasks/utils/taskTimeline";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/shared/constants/taskStatus";
import { cn } from "@/shared/lib/utils";

export function TaskBlock({ positioned, compact, onOpen }: TaskBlockProps) {
  const { task, topPx, heightPx, leftPercent, widthPercent } = positioned;
  const range = formatTaskTimeRange(task.due_time);
  const priority = `${TASK_PRIORITY_LABELS[task.priority]} priority`;

  return (
    <button
      type="button"
      aria-label={`${task.title}, ${range ?? "no time"}, ${TASK_STATUS_LABELS[task.status]}`}
      onClick={(event) => {
        event.stopPropagation();
        onOpen(task);
      }}
      style={{ top: topPx, height: heightPx, left: `calc(${leftPercent}% + 2px)`, width: `calc(${widthPercent}% - 4px)` }}
      className={cn(
        "absolute z-[1] overflow-hidden rounded-md border-l-4 text-left shadow-xs transition-opacity outline-none hover:opacity-90 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        compact ? "px-1.5 py-1" : "flex items-start justify-between gap-3 px-3 py-2",
        TASK_BLOCK_CLASS[task.status],
      )}
    >
      {compact ? (
        <>
          <span className="block truncate text-xs leading-tight">{task.title}</span>
          <span className="mt-0.5 block truncate text-[10px] leading-tight text-muted-foreground">{range}</span>
          <span className="block truncate text-[10px] leading-tight text-muted-foreground">{priority}</span>
        </>
      ) : (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm leading-tight">{task.title}</span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">{priority}</span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">{range}</span>
          </span>
          <span className="hidden min-[420px]:inline-flex">
            <TaskStatusBadge status={task.status} />
          </span>
        </>
      )}
    </button>
  );
}
