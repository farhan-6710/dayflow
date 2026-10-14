import { TasksCalendarMonthBar } from "@/features/workspace/tasks/components/TasksCalendarMonthBar";
import { TasksWeekDayCell } from "@/features/workspace/tasks/components/TasksWeekDayCell";
import {
  CALENDAR_DAY_COLUMN_MIN_WIDTH,
  CALENDAR_DAY_LABELS,
} from "@/features/workspace/tasks/constants/tasksCalendar";
import type { TasksWeeksTableProps } from "@/features/workspace/tasks/types/components";
import { isSameCalendarDay } from "@/features/workspace/reminders/utils/calendarUtils";
import { TABLE_HORIZONTAL_SCROLL_CLASS } from "@/shared/constants/directoryTable";
import { cn } from "@/shared/lib/utils";
import { TooltipProvider } from "@/shared/ui/tooltip";

const DAY_GAP_PX = 8;

export function TasksWeeksTable({
  year,
  month,
  weeks,
  selectedDate,
  tasksByDateKey,
  onSelectMonth,
  onOpenDay,
  onEdit,
  statusColors,
}: TasksWeeksTableProps) {
  const dayCount = CALENDAR_DAY_LABELS.length;
  const gridTemplateColumns = `repeat(${dayCount}, minmax(${CALENDAR_DAY_COLUMN_MIN_WIDTH}px, 1fr))`;
  const minTableWidth =
    dayCount * CALENDAR_DAY_COLUMN_MIN_WIDTH + (dayCount - 1) * DAY_GAP_PX;

  return (
    <TooltipProvider>
      <div
        className={cn(
          TABLE_HORIZONTAL_SCROLL_CLASS,
          "rounded-2xl border border-border bg-card shadow-sm",
        )}
      >
        <div
          className="sticky left-0 z-10 px-4 py-4 sm:px-5"
          style={{ minWidth: minTableWidth }}
        >
          <TasksCalendarMonthBar
            year={year}
            month={month}
            onSelect={onSelectMonth}
          />
        </div>

        <div className="space-y-2 p-3 sm:p-4" style={{ minWidth: minTableWidth }}>
          <div
            className="grid gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            style={{ gridTemplateColumns }}
          >
            {CALENDAR_DAY_LABELS.map((dayLabel) => (
              <div key={dayLabel} className="px-1 py-1 text-center">
                {dayLabel}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {weeks.map((week) => (
              <div
                key={week.label}
                className="grid gap-2"
                style={{ gridTemplateColumns }}
              >
                {week.cells.map((cell) => {
                  const isOutsideMonth =
                    cell.year !== year || cell.month !== month;
                  const dateKey = `${cell.year}-${String(cell.month).padStart(2, "0")}-${String(cell.date).padStart(2, "0")}`;

                  return (
                    <TasksWeekDayCell
                      key={`${week.label}-${dateKey}`}
                      year={cell.year}
                      month={cell.month}
                      dateNumber={cell.date}
                      tasks={tasksByDateKey.get(dateKey) ?? []}
                      isSelected={isSameCalendarDay(
                        selectedDate,
                        cell.year,
                        cell.month,
                        cell.date,
                      )}
                      isOutsideMonth={isOutsideMonth}
                      statusColors={statusColors}
                      onOpenDay={() =>
                        onOpenDay(cell.year, cell.month, cell.date)
                      }
                      onEdit={onEdit}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
