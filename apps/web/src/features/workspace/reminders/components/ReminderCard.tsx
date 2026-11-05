import { format, isToday, isTomorrow } from "date-fns";
import { CalendarClock, Pencil, Trash2 } from "lucide-react";

import type { ReminderCardProps } from "@/features/workspace/reminders/types/components";
import {
  dayKeyForDate,
  isReminderActive,
  nextOccurrenceDate,
  REMINDER_DAYS,
} from "@/features/workspace/reminders/utils/reminderSchedule";
import { Reveal } from "@/shared/components/Reveal";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { parseDateValue } from "@/shared/utils/dateValue";

/** "Next: Today, 9:30 AM", or when it is off, "Off until Nov 12, 9:30 AM". */
function scheduleLabel(reminder: ReminderCardProps["reminder"], active: boolean): string {
  if (!active) {
    const until = parseDateValue(reminder.disabled_until);
    return `Off${until ? ` until ${format(until, "MMM d")}` : ""}, ${reminder.reminder_time}`;
  }
  const next = nextOccurrenceDate(reminder);
  if (!next) {
    return reminder.reminder_time;
  }
  const day = isToday(next) ? "Today" : isTomorrow(next) ? "Tomorrow" : format(next, "EEE, MMM d");
  return `Next: ${day}, ${reminder.reminder_time}`;
}

/** The whole card opens the edit dialog; the menu sits above that click area. */
export function ReminderCard({ reminder, onEdit, onDelete }: ReminderCardProps) {
  const active = isReminderActive(reminder);
  const todayKey = dayKeyForDate(new Date());
  const days = REMINDER_DAYS.filter((day) => reminder.days_of_week.includes(day.key));

  return (
    <Reveal className="h-full min-w-0">
      <article className={cn(panelClassName, "relative flex h-full min-w-0 flex-col gap-3 p-4 transition-colors hover:bg-accent sm:p-5")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className={cn("text-lg leading-snug break-words", !active && "text-muted-foreground")}>
              <button
                type="button"
                onClick={() => onEdit(reminder)}
                aria-label={`Edit ${reminder.title}`}
                className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
              >
                {reminder.title}
              </button>
            </h2>
            {reminder.description ? (
              <p className="mt-1 line-clamp-2 text-sm break-words text-muted-foreground">{reminder.description}</p>
            ) : null}
          </div>
          <div className="relative -mt-1 -mr-1 shrink-0">
            <RowActionsMenu
              label={`Actions for ${reminder.title}`}
              actions={[
                { label: "Edit", icon: Pencil, onSelect: () => onEdit(reminder) },
                { label: "Delete", icon: Trash2, destructive: true, onSelect: () => onDelete(reminder) },
              ]}
            />
          </div>
        </div>

        <div className="mt-auto grid gap-3">
          <p data-shimmer-no-children className="flex items-center gap-2 text-sm tabular-nums">
            <CalendarClock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {scheduleLabel(reminder, active)}
          </p>
          <p className="sr-only">Repeats on {days.map((day) => day.label).join(", ")}</p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {REMINDER_DAYS.map((day) => {
              const on = reminder.days_of_week.includes(day.key);
              return (
                <span
                  key={day.key}
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs",
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
        </div>
      </article>
    </Reveal>
  );
}
