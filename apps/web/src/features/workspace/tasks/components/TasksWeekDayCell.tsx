import type { TasksWeekDayCellProps } from "@/features/workspace/tasks/types/components";
import { compareByPriority } from "@/features/workspace/tasks/utils/taskCalendarSort";
import {
  formatMonthDayLabel,
  getDayLabel,
} from "@/features/workspace/reminders/utils/calendarUtils";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

export function TasksWeekDayCell({
  year,
  month,
  dateNumber,
  tasks,
  isSelected,
  isOutsideMonth = false,
  statusColors,
  onOpenDay,
  onEdit,
}: TasksWeekDayCellProps) {
  const hasTasks = tasks.length > 0;
  const dayName = getDayLabel(year, month, dateNumber);
  const sortedTasks = [...tasks].sort(compareByPriority);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group flex cursor-pointer flex-col rounded-xl border p-3 text-left transition-colors",
        isOutsideMonth
          ? "border-border/60 bg-muted/20 hover:bg-muted/35"
          : "border-border bg-muted/40 hover:bg-muted/60",
        isSelected && "border-primary ring-1 ring-primary",
      )}
      aria-label={`View tasks for ${dayName} ${formatMonthDayLabel(year, month, dateNumber)}`}
      aria-current={isSelected ? "date" : undefined}
      onClick={onOpenDay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDay();
        }
      }}
    >
      <div className="flex justify-start">
        <span
          className={cn(
            "inline-flex size-8 items-center justify-center text-base font-semibold tabular-nums",
            isSelected
              ? "rounded-full bg-primary text-primary-foreground"
              : isOutsideMonth
                ? "text-muted-foreground/55"
                : "text-foreground",
          )}
        >
          {dateNumber}
        </span>
      </div>

      <div className="mt-2 flex max-h-[90px] flex-1 flex-col gap-1 overflow-y-auto pr-0.5">
        {hasTasks ? (
          sortedTasks.map((task) => (
            <Tooltip key={task.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex w-full min-w-0 items-center gap-2 rounded-full border border-border bg-background/70 px-2.5 py-1 text-left transition hover:border-ring/50"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(task.id);
                  }}
                  aria-label={`Edit ${task.title}`}
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${statusColors[task.status]}`}
                  />
                  <span className="truncate text-xs font-medium">{task.title}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.priority} priority</p>
              </TooltipContent>
            </Tooltip>
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            Click to view day
          </div>
        )}
      </div>
    </div>
  );
}
