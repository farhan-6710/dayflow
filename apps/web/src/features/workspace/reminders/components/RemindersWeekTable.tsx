import { format } from "date-fns";

import type { RemindersWeekTableProps } from "@/features/workspace/reminders/types/components";
import {
  byTime,
  dayKeyForDate,
  isReminderActive,
  REMINDER_DAYS,
} from "@/features/workspace/reminders/utils/reminderSchedule";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { cn } from "@/shared/lib/utils";
import { parseDateValue } from "@/shared/utils/dateValue";

const GRID_CLASS = "md:grid-cols-[5rem_minmax(0,1fr)_repeat(7,1.75rem)]";

/** One row per reminder, one column per weekday. Rows open the edit dialog, which also holds delete. */
export function RemindersWeekTable({ reminders, isLoading, onEdit }: RemindersWeekTableProps) {
  const todayKey = dayKeyForDate(new Date());
  const columns = [
    { label: "Time" },
    { label: "Reminder" },
    ...REMINDER_DAYS.map((day) => ({
      label: day.label.slice(0, 2),
      align: "center" as const,
      className: day.key === todayKey ? "text-foreground" : undefined,
    })),
  ];

  return (
    <DirectoryTable gridClass={GRID_CLASS} columns={columns} isLoading={isLoading} isEmpty={false} emptyTitle="" emptyDescription="">
      {[...reminders].sort(byTime).map((reminder) => {
        const active = isReminderActive(reminder);
        const until = parseDateValue(reminder.disabled_until);
        const days = REMINDER_DAYS.filter((day) => reminder.days_of_week.includes(day.key));
        return (
          <DirectoryTableRow
            key={reminder.id}
            onActivate={() => onEdit(reminder)}
            label={`Edit ${reminder.title}, ${reminder.reminder_time}, ${days.map((day) => day.label).join(", ")}`}
            className={cn("grid items-center gap-x-2 gap-y-1.5 md:gap-x-4", GRID_CLASS)}
          >
            <span className="text-sm text-muted-foreground tabular-nums">{reminder.reminder_time}</span>
            <div className="min-w-0">
              <p className={cn("break-words", !active && "text-muted-foreground")}>{reminder.title}</p>
              {active ? null : (
                <p className="text-xs text-muted-foreground">Off{until ? ` until ${format(until, "MMM d")}` : ""}</p>
              )}
            </div>
            <div className="flex gap-1 md:contents" aria-hidden="true">
              {REMINDER_DAYS.map((day) => {
                const on = reminder.days_of_week.includes(day.key);
                return (
                  <span
                    key={day.key}
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-xs",
                      on && active && "bg-primary text-primary-foreground",
                      on && !active && "bg-muted text-muted-foreground",
                      !on && "text-muted-foreground",
                      day.key === todayKey && "ring-1 ring-border",
                    )}
                  >
                    {day.label.slice(0, 1)}
                  </span>
                );
              })}
            </div>
          </DirectoryTableRow>
        );
      })}
    </DirectoryTable>
  );
}
