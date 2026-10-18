import { TasksCalendarMonthBar } from "@/features/workspace/tasks/components/TasksCalendarMonthBar";
import { TasksWeekDayCell } from "@/features/workspace/tasks/components/TasksWeekDayCell";
import { CALENDAR_DAY_LABELS } from "@/features/workspace/tasks/constants/tasksCalendar";
import {
  TASK_STATUS_DOT_COLORS,
  TASK_STATUS_LEGEND,
} from "@/features/workspace/tasks/constants/taskStatus";
import type { TasksWeeksTableProps } from "@/features/workspace/tasks/types/components";
import { isSameCalendarDay } from "@/features/workspace/reminders/utils/calendarUtils";
import { FluidReveal } from "@/shared/components/FluidReveal";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

function toDateKey(year: number, month: number, date: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
}

export function TasksWeeksTable({
  year,
  month,
  weeks,
  selectedDate,
  tasksByDateKey,
  onSelectMonth,
  onSelectDay,
}: TasksWeeksTableProps) {
  const today = new Date();

  return (
    <div
      className={cn(
        "flex h-full min-h-[360px] min-w-0 flex-col sm:min-h-[420px]",
        glassPanelClassName,
      )}
    >
      <div className="px-2 pt-3 sm:px-5 sm:pt-5">
        <TasksCalendarMonthBar year={year} month={month} onSelect={onSelectMonth} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-1.5 pb-2 pt-2 sm:px-3">
        <div className="grid grid-cols-7 border-b border-border">
          {CALENDAR_DAY_LABELS.map((dayLabel) => (
            <div
              key={dayLabel}
              className="py-1.5 text-center text-[10px] font-medium tracking-wide text-muted-foreground uppercase sm:py-2 sm:text-[11px] sm:tracking-[0.16em]"
            >
              <span className="sm:hidden">{dayLabel.slice(0, 1)}</span>
              <span className="hidden sm:inline">{dayLabel}</span>
            </div>
          ))}
        </div>

        <FluidReveal
          motionKey={`${year}-${month}`}
          className="grid min-w-0 flex-1 grid-cols-7 content-start gap-px overflow-hidden rounded-b-lg border border-t-0 border-border bg-border"
        >
          {weeks.flatMap((week) =>
            week.cells.map((cell) => (
              <TasksWeekDayCell
                key={toDateKey(cell.year, cell.month, cell.date)}
                year={cell.year}
                month={cell.month}
                dateNumber={cell.date}
                tasks={
                  tasksByDateKey.get(toDateKey(cell.year, cell.month, cell.date)) ??
                  []
                }
                isSelected={isSameCalendarDay(
                  selectedDate,
                  cell.year,
                  cell.month,
                  cell.date,
                )}
                isToday={isSameCalendarDay(today, cell.year, cell.month, cell.date)}
                isOutsideMonth={cell.year !== year || cell.month !== month}
                onSelect={() => onSelectDay(cell.year, cell.month, cell.date)}
              />
            )),
          )}
        </FluidReveal>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border px-2 py-2.5 sm:gap-x-4 sm:px-5 sm:py-3">
        {TASK_STATUS_LEGEND.map(({ status, label }) => (
          <span
            key={status}
            className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground sm:text-[11px]"
          >
            <span
              className={cn("size-2 rounded-full sm:size-2.5", TASK_STATUS_DOT_COLORS[status])}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
