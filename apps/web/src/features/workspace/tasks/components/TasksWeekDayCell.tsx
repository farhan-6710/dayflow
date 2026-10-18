import type { TaskStatus } from "@/services/tasksService";
import type { TasksWeekDayCellProps } from "@/features/workspace/tasks/types/components";
import { TASK_STATUS_DOT_COLORS } from "@/features/workspace/tasks/constants/taskStatus";
import { formatMonthDayLabel } from "@/features/workspace/reminders/utils/calendarUtils";
import { cn } from "@/shared/lib/utils";

const MAX_DOTS = 4;

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
        "group flex aspect-square min-h-16 flex-col justify-between rounded-xl p-2 text-left outline-none transition-colors sm:min-h-[4.5rem] sm:p-2.5",
        "focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? "bg-primary/12 ring-1 ring-primary"
          : "hover:bg-muted/70",
        isOutsideMonth && !isSelected && "opacity-40",
      )}
    >
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums",
          isToday && "bg-primary text-primary-foreground",
          !isToday && isSelected && "text-foreground",
          !isToday && !isSelected && "text-foreground/80",
        )}
      >
        {dateNumber}
      </span>

      {tasks.length > 0 ? (
        <span className="flex flex-wrap items-center gap-1">
          {visible.map((task) => (
            <span
              key={task.id}
              className={cn("size-1.5 rounded-full", TASK_STATUS_DOT_COLORS[task.status])}
            />
          ))}
          {extra > 0 ? (
            <span className="text-[10px] font-medium text-muted-foreground">+{extra}</span>
          ) : null}
        </span>
      ) : (
        <span className="h-1.5" />
      )}
    </button>
  );
}
