import type { TaskStatus } from "@/services/tasksService";
import type { TasksWeekDayCellProps } from "@/features/admin/tasks/types/components";
import {
  isClosedTaskStatus,
  TASK_STATUS_LABELS,
} from "@/features/admin/tasks/constants/taskStatus";
import { compareByPriority } from "@/features/admin/tasks/utils/taskCalendarSort";
import {
  formatMonthDayLabel,
  getDayLabel,
} from "@/features/admin/reminders/utils/calendarUtils";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

function isOverdue(dueDate: string, status: TaskStatus, todayStr: string): boolean {
  return !isClosedTaskStatus(status) && dueDate < todayStr;
}

export function TasksWeekDayCell({
  year,
  month,
  dateNumber,
  tasks,
  isSelected,
  statusColors,
  statusText,
  onOpenDay,
  onEdit,
}: TasksWeekDayCellProps) {
  const hasTasks = tasks.length > 0;
  const dayName = getDayLabel(year, month, dateNumber);
  const todayStr = new Date().toISOString().split("T")[0];
  const sortedTasks = [...tasks].sort(compareByPriority);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "group flex min-h-[140px] cursor-pointer flex-col border-r bg-card p-4 text-left transition-colors hover:bg-muted/30",
        isSelected ? "border-2 border-primary" : "border-border/70",
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
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Date</span>
        <span className="font-mono">
          {formatMonthDayLabel(year, month, dateNumber)}
        </span>
      </div>

      <div className="mt-3 flex max-h-[160px] flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
        {hasTasks ? (
          sortedTasks.map((task) => (
            <Tooltip key={task.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background/70 px-3 py-1.5 text-left transition hover:border-ring/50"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(task.id);
                  }}
                  aria-label={`Edit ${task.title}`}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 shrink-0 rounded-full ${statusColors[task.status]}`}
                      />
                      <span className="truncate text-sm font-medium">
                        {task.title}
                      </span>
                    </div>
                    {task.due_date && isOverdue(task.due_date, task.status, todayStr) ? (
                      <span className="pl-4 text-[10px] font-semibold text-destructive">
                        Overdue
                      </span>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    {task.due_time ? (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {task.due_time}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        statusText[task.status],
                      )}
                    >
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  {task.priority} priority
                </p>
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
