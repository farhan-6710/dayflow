import { addMonths, format, isSameMonth, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { TasksMonthBarProps } from "@/features/workspace/tasks/types/components";
import { TASK_STATUS_DOT_CLASS, TASK_STATUS_LABELS } from "@/shared/constants/taskStatus";
import { cn } from "@/shared/lib/utils";
import type { TaskStatus } from "@/shared/types/types";
import { Button } from "@/shared/ui/button";

const STATUSES = Object.keys(TASK_STATUS_LABELS) as TaskStatus[];

export function TasksMonthBar({ month, onSelectDate }: TasksMonthBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-lg" aria-label="Previous month" onClick={() => onSelectDate(subMonths(month, 1))}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <h2 className="min-w-40 text-center text-xl" aria-live="polite">
          {format(month, "MMMM yyyy")}
        </h2>
        <Button variant="ghost" size="icon-lg" aria-label="Next month" onClick={() => onSelectDate(addMonths(month, 1))}>
          <ChevronRight aria-hidden="true" />
        </Button>
        {isSameMonth(month, new Date()) ? null : (
          <Button variant="outline" className="ml-1 h-10" onClick={() => onSelectDate(new Date())}>
            Today
          </Button>
        )}
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("size-2 rounded-full", TASK_STATUS_DOT_CLASS[status])} />
            {TASK_STATUS_LABELS[status]}
          </li>
        ))}
      </ul>
    </div>
  );
}
