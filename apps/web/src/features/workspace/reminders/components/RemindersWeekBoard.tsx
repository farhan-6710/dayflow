import { format } from "date-fns";
import { Plus } from "lucide-react";

import type { RemindersWeekBoardProps } from "@/features/workspace/reminders/types/components";
import {
  byTime,
  dayKeyForDate,
  isReminderActive,
  REMINDER_DAYS,
} from "@/features/workspace/reminders/utils/reminderSchedule";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { parseDateValue } from "@/shared/utils/dateValue";

export function RemindersWeekBoard({ reminders, onAdd, onEdit }: RemindersWeekBoardProps) {
  const todayKey = dayKeyForDate(new Date());

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
      {REMINDER_DAYS.map((day) => {
        const dayReminders = reminders.filter((reminder) => reminder.days_of_week.includes(day.key)).sort(byTime);
        return (
          <section
            key={day.key}
            aria-label={day.label}
            className={cn(panelClassName, "min-w-0 p-3", day.key === todayKey && "border-primary")}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg">
                {day.label}
                {day.key === todayKey ? <span className="ml-2 text-xs text-muted-foreground">Today</span> : null}
              </h2>
              <Button
                variant="ghost"
                size="icon-lg"
                className="text-muted-foreground"
                aria-label={`Add reminder on ${day.label}`}
                onClick={() => onAdd(day.key)}
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
            {dayReminders.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">Nothing set.</p>
            ) : (
              <ul className="grid gap-1">
                {dayReminders.map((reminder) => {
                  const active = isReminderActive(reminder);
                  const until = parseDateValue(reminder.disabled_until);
                  return (
                    <li key={reminder.id}>
                      <button
                        type="button"
                        onClick={() => onEdit(reminder)}
                        className={cn(
                          "w-full min-h-10 rounded-lg px-2 py-1.5 text-left outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          !active && "text-muted-foreground",
                        )}
                      >
                        <span className="block text-xs text-muted-foreground tabular-nums">{reminder.reminder_time}</span>
                        <span className="block text-sm break-words">{reminder.title}</span>
                        {active ? null : (
                          <span className="block text-xs">Off{until ? ` until ${format(until, "MMM d")}` : ""}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
