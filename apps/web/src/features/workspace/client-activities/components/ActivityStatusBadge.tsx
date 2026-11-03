import { STATUS_LABELS } from "@/features/workspace/client-activities/constants/activityOptions";
import type { ActivityStatusBadgeProps } from "@/features/workspace/client-activities/types/components";
import { cn } from "@/shared/lib/utils";

const DOT_CLASS = {
  pending: "bg-muted-foreground/60",
  in_progress: "bg-chart-1",
  completed: "bg-primary",
};

export function ActivityStatusBadge({ status }: ActivityStatusBadgeProps) {
  return (
    <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-xs">
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", DOT_CLASS[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
