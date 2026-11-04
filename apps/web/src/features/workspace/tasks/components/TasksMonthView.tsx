import { format, isSameDay, isSameMonth, isToday } from "date-fns";

import type { TasksMonthViewProps } from "@/features/workspace/tasks/types/components";
import { buildMonthDays, WEEKDAY_SHORT } from "@/features/workspace/tasks/utils/calendarGrid";
import { TASK_STATUS_DOT_CLASS } from "@/shared/constants/taskStatus";
import { cn } from "@/shared/lib/utils";
import { serializeDateValue } from "@/shared/utils/dateValue";

const MAX_DOTS = 4;

export function TasksMonthView({ month, selectedDate, tasksByDate, onSelectDate }: TasksMonthViewProps) {
  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden" role="grid" aria-label={format(month, "MMMM yyyy")}>
      <div className="grid shrink-0 grid-cols-7 gap-1 border-b border-border pb-2">
        {WEEKDAY_SHORT.map((label) => (
          <div key={label} role="columnheader" className="text-center text-xs text-muted-foreground">
            {label}
          </div>
        ))}
      </div>
      <div className="mt-1 grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1">
        {buildMonthDays(month).map((day) => {
          const tasks = tasksByDate.get(serializeDateValue(day)) ?? [];
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-current={today ? "date" : undefined}
              aria-label={`${format(day, "EEEE, MMMM d")}, ${tasks.length === 1 ? "1 task" : `${tasks.length} tasks`}`}
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex min-h-0 flex-col items-center gap-1 rounded-xl p-1 transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-1.5 sm:p-1.5",
                selected ? "bg-accent" : "hover:bg-accent/60",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs tabular-nums sm:size-8 sm:text-sm",
                  !isSameMonth(day, month) && "text-muted-foreground",
                  selected && "bg-primary text-primary-foreground",
                  today && !selected && "ring-1 ring-primary/50",
                )}
              >
                {format(day, "d")}
              </span>
              {tasks.length > 0 ? (
                <span className="flex items-center justify-center gap-0.5 sm:gap-1" aria-hidden="true">
                  {tasks.slice(0, MAX_DOTS).map((task) => (
                    <span key={task.id} className={cn("size-1.5 shrink-0 rounded-full", TASK_STATUS_DOT_CLASS[task.status])} />
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
