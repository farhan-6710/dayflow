import { TASK_STATUS_DOT_CLASS, TASK_STATUS_LABELS } from "@/shared/constants/taskStatus";
import { cn } from "@/shared/lib/utils";
import type { TaskStatus } from "@/shared/types/types";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-xs">
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", TASK_STATUS_DOT_CLASS[status])} />
      {TASK_STATUS_LABELS[status]}
    </span>
  );
}
