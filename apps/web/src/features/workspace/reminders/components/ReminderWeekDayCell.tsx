import type { ReminderWeekDayCellProps } from "@/features/workspace/reminders/types/components";
import {
  compareReminderTimes,
  formatMonthDayLabel,
  getDayLabel,
} from "@/features/workspace/reminders/utils/calendarUtils";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function ReminderWeekDayCell({
  year,
  month,
  dateNumber,
  slot,
  isSelected,
  onOpenDay,
  onEdit,
}: ReminderWeekDayCellProps) {
  const reminders = slot?.reminders ?? [];
  const hasReminders = reminders.length > 0;
  const dayName = getDayLabel(year, month, dateNumber);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group flex min-h-[140px] cursor-pointer flex-col border-r border-foreground/10 p-4 text-left transition-colors outline-none hover:bg-[color-mix(in_srgb,var(--primary)_6%,var(--card))] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
        isSelected && "bg-[color-mix(in_srgb,var(--primary)_14%,var(--card))] shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--primary)_70%,transparent)]",
      )}
      aria-label={`View reminders for ${dayName} ${formatMonthDayLabel(year, month, dateNumber)}`}
      aria-current={isSelected ? "date" : undefined}
      onClick={onOpenDay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDay();
        }
      }}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Date</span>
        <span className="font-mono">
          {formatMonthDayLabel(year, month, dateNumber)}
        </span>
      </div>

      <div className="mt-3 flex max-h-[160px] flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
        {hasReminders ? (
          [...reminders]
            .sort((a, b) => compareReminderTimes(a.reminderTime, b.reminderTime))
            .map((reminder) => (
              <Tooltip key={reminder.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="surface-chip flex w-full items-center justify-between gap-2 rounded-[0.65rem] bg-[color-mix(in_srgb,var(--primary)_5%,var(--card))] px-3 py-1.5 text-left transition-colors hover:border-primary/40"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(reminder.id);
                    }}
                    aria-label={`Edit ${reminder.title}`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full bg-primary" />
                      <span className="truncate text-sm font-medium">
                        {reminder.title}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {reminder.reminderTime}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{reminder.title}</p>
                </TooltipContent>
              </Tooltip>
            ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-[0.65rem] border border-dashed border-foreground/15 px-3 py-6 text-center text-xs text-muted-foreground">
            Click to view day
          </div>
        )}
      </div>
    </div>
  );
}
