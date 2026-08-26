import { TasksWeekDayCell } from "@/features/tasks/components/TasksWeekDayCell";
import {
  CALENDAR_DAY_COLUMN_WIDTH,
  CALENDAR_DAY_LABELS,
  CALENDAR_WEEK_COLUMN_MIN_WIDTH,
} from "@/features/tasks/constants/tasksCalendar";
import type { TasksWeeksTableProps } from "@/features/tasks/types/components";
import { isSameCalendarDay } from "@/features/reminders/utils/calendarUtils";
import { TABLE_HORIZONTAL_SCROLL_CLASS } from "@/shared/constants/directoryTable";
import { cn } from "@/shared/lib/utils";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function TasksWeeksTable({
  year,
  month,
  weeks,
  selectedDate,
  tasksByDateKey,
  onOpenDay,
  onEdit,
  statusColors,
  statusText,
}: TasksWeeksTableProps) {
  const weekCount = weeks.length;
  const gridTemplateColumns = `${CALENDAR_DAY_COLUMN_WIDTH}px repeat(${weekCount}, minmax(${CALENDAR_WEEK_COLUMN_MIN_WIDTH}px, 1fr))`;
  const minTableWidth =
    CALENDAR_DAY_COLUMN_WIDTH + weekCount * CALENDAR_WEEK_COLUMN_MIN_WIDTH;

  return (
    <TooltipProvider>
      <div
        className={cn(
          TABLE_HORIZONTAL_SCROLL_CLASS,
          "rounded-2xl border border-border bg-card shadow-sm",
        )}
      >
        <div style={{ minWidth: minTableWidth }}>
          <div
            className="grid border-b border-border bg-card text-xs font-semibold tracking-wider text-muted-foreground"
            style={{ gridTemplateColumns }}
          >
            <div className="sticky left-0 z-10 border-r border-border bg-card px-4 py-3">
              Day
            </div>
            {weeks.map((week) => (
              <div key={week.label} className="px-4 py-3 text-center">
                <div className="whitespace-nowrap">{week.label}</div>
                <div className="whitespace-nowrap text-[11px] text-muted-foreground">
                  {week.range}
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-border">
            {CALENDAR_DAY_LABELS.map((dayLabel, dayIndex) => (
              <div
                key={dayLabel}
                className="grid"
                style={{ gridTemplateColumns }}
              >
                <div className="sticky left-0 z-10 flex items-center border-r border-border bg-card px-4 py-6 text-sm font-semibold">
                  {dayLabel}
                </div>
                {weeks.map((week) => {
                  const dateNumber = week.dates[dayIndex];

                  if (!dateNumber) {
                    return (
                      <div
                        key={`${dayLabel}-${week.label}-empty`}
                        className="min-h-[140px] border-r border-border/70 bg-card"
                      />
                    );
                  }

                  const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(dateNumber).padStart(2, "0")}`;

                  return (
                    <TasksWeekDayCell
                      key={`${dayLabel}-${week.label}-${dateNumber}`}
                      year={year}
                      month={month}
                      dateNumber={dateNumber}
                      tasks={tasksByDateKey.get(dateKey) ?? []}
                      isSelected={isSameCalendarDay(
                        selectedDate,
                        year,
                        month,
                        dateNumber,
                      )}
                      statusColors={statusColors}
                      statusText={statusText}
                      onOpenDay={() => onOpenDay(year, month, dateNumber)}
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
