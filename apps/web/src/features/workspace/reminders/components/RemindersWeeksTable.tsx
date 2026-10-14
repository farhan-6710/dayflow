import { ReminderWeekDayCell } from "@/features/workspace/reminders/components/ReminderWeekDayCell";
import {
  CALENDAR_DAY_COLUMN_WIDTH,
  CALENDAR_DAY_LABELS,
  CALENDAR_WEEK_COLUMN_MIN_WIDTH,
} from "@/features/workspace/reminders/constants/remindersCalendar";
import type { RemindersWeeksTableProps } from "@/features/workspace/reminders/types/components";
import { isSameCalendarDay } from "@/features/workspace/reminders/utils/calendarUtils";
import { TABLE_HORIZONTAL_SCROLL_CLASS } from "@/shared/constants/directoryTable";
import { cn } from "@/shared/lib/utils";
import { TooltipProvider } from "@/shared/ui/tooltip";

export function RemindersWeeksTable({
  year,
  month,
  weeks,
  selectedDate,
  getSlot,
  onOpenDay,
  onEdit,
}: RemindersWeeksTableProps) {
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
                  const cell = week.cells[dayIndex];
                  if (!cell) {
                    return (
                      <div
                        key={`${dayLabel}-${week.label}-empty`}
                        className="min-h-[140px] border-r border-border/70 bg-card"
                      />
                    );
                  }

                  const inMonth =
                    cell.year === year && cell.month === month;

                  return (
                    <ReminderWeekDayCell
                      key={`${dayLabel}-${week.label}-${cell.year}-${cell.month}-${cell.date}`}
                      year={cell.year}
                      month={cell.month}
                      dateNumber={cell.date}
                      slot={
                        inMonth
                          ? getSlot(cell.year, cell.month, cell.date)
                          : null
                      }
                      isSelected={isSameCalendarDay(
                        selectedDate,
                        cell.year,
                        cell.month,
                        cell.date,
                      )}
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
