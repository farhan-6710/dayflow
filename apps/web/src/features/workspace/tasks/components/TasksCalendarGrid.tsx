import { format, isSameDay, isSameMonth, isToday } from "date-fns";

import type { TasksCalendarGridProps } from "@/features/workspace/tasks/types/components";
import { TASK_STATUS_DOT_CLASS } from "@/shared/constants/taskStatus";
import { cn } from "@/shared/lib/utils";
import { buildMonthWeeks, WEEKDAY_LABELS } from "@/shared/utils/calendar";
import { serializeDateValue } from "@/shared/utils/dateValue";

const MAX_DOTS = 4;

export function TasksCalendarGrid({ month, selectedDate, tasksByDate, onSelectDate }: TasksCalendarGridProps) {
  return (
    <div className="mt-3 grid grid-cols-7 gap-1" role="grid" aria-label={format(month, "MMMM yyyy")}>
      {WEEKDAY_LABELS.map((label) => (
        <div key={label} role="columnheader" className="pb-1 text-center text-xs text-muted-foreground">
          {label}
        </div>
      ))}
      {buildMonthWeeks(month)
        .flat()
        .map((day) => {
          const tasks = tasksByDate.get(serializeDateValue(day)) ?? [];
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const taskLabel = tasks.length === 1 ? "1 task" : `${tasks.length} tasks`;
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-current={today ? "date" : undefined}
              aria-label={`${format(day, "EEEE, MMMM d")}, ${taskLabel}`}
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex min-h-14 flex-col items-center gap-1.5 rounded-lg border border-transparent p-1.5 transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:min-h-16 sm:items-start sm:p-2",
                !isSameMonth(day, month) && "text-muted-foreground",
                selected && "border-primary bg-accent",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-sm tabular-nums",
                  today && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </span>
              {tasks.length > 0 ? (
                <span className="flex flex-wrap items-center justify-center gap-1 sm:justify-start" aria-hidden="true">
                  {tasks.slice(0, MAX_DOTS).map((task) => (
                    <span key={task.id} className={cn("size-1.5 rounded-full", TASK_STATUS_DOT_CLASS[task.status])} />
                  ))}
                  {tasks.length > MAX_DOTS ? (
                    <span className="text-[0.625rem] leading-none text-muted-foreground tabular-nums">
                      +{tasks.length - MAX_DOTS}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </button>
          );
        })}
    </div>
  );
}
