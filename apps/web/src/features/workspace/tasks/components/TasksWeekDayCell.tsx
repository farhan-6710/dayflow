import type { TaskStatus } from "@/services/tasksService";
import type { TasksWeekDayCellProps } from "@/features/workspace/tasks/types/components";
import { TASK_STATUS_DOT_COLORS } from "@/features/workspace/tasks/constants/taskStatus";
import { formatMonthDayLabel } from "@/features/workspace/reminders/utils/calendarUtils";
import { cn } from "@/shared/lib/utils";

const MAX_DOTS = 10;

const STATUS_ORDER: Record<TaskStatus, number> = {
  missed: 0,
  in_progress: 1,
  todo: 2,
  done: 3,
};

export function TasksWeekDayCell({
  year,
  month,
  dateNumber,
  tasks,
  isSelected,
  isToday,
  isOutsideMonth = false,
  onSelect,
}: TasksWeekDayCellProps) {
  const visible = [...tasks]
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
    .slice(0, MAX_DOTS);
  const extra = tasks.length - visible.length;
  const taskLabel = tasks.length === 1 ? "1 task" : `${tasks.length} tasks`;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-current={isToday ? "date" : undefined}
      aria-label={`${formatMonthDayLabel(year, month, dateNumber)}, ${taskLabel}`}
      className={cn(
        "group flex min-h-14 flex-col justify-between gap-1 p-1 text-left outline-none transition-colors sm:min-h-[4.75rem] sm:p-2",
        "focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        isSelected
          ? "z-[1] bg-primary/15 ring-1 ring-inset ring-primary"
          : "bg-card hover:bg-muted/70",
        isOutsideMonth && !isSelected && "bg-muted/30 opacity-50",
      )}
    >
      <span
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums sm:size-7 sm:text-[13px]",
          isToday && "bg-primary text-primary-foreground",
          !isToday && isSelected && "text-foreground",
          !isToday && !isSelected && "text-foreground/80",
        )}
      >
        {dateNumber}
      </span>

      {tasks.length > 0 ? (
        <span className="flex flex-wrap items-center gap-0.5 sm:gap-1">
          {visible.map((task) => (
            <span
              key={task.id}
              className={cn(
                "size-2 shrink-0 rounded-full sm:size-2.5",
                TASK_STATUS_DOT_COLORS[task.status],
              )}
            />
          ))}
          {extra > 0 ? (
            <span className="text-[9px] font-semibold text-muted-foreground sm:text-[10px]">
              +{extra}
            </span>
          ) : null}
        </span>
      ) : (
        <span className="h-2 sm:h-2.5" />
      )}
    </button>
  );
}
