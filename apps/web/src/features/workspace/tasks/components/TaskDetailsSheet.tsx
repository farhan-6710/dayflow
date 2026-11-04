import { format } from "date-fns";
import { CalendarDays, Clock, Flag, Pencil, Trash2 } from "lucide-react";

import { TaskStatusBadge } from "@/features/workspace/tasks/components/TaskStatusBadge";
import type { TaskDetailsSheetProps } from "@/features/workspace/tasks/types/components";
import { formatTaskTimeRange } from "@/features/workspace/tasks/utils/taskTimeline";
import { TASK_PRIORITY_LABELS } from "@/shared/constants/taskStatus";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/shared/ui/sheet";
import { parseDateValue } from "@/shared/utils/dateValue";

export function TaskDetailsSheet({ task, onClose, onEdit, onDelete }: TaskDetailsSheetProps) {
  const due = parseDateValue(task?.due_date);
  const rows = task
    ? [
        { icon: CalendarDays, label: "Due date", value: due ? format(due, "EEEE, d MMM yyyy") : "No date" },
        { icon: Clock, label: "Time", value: formatTaskTimeRange(task.due_time) ?? "No time" },
        { icon: Flag, label: "Priority", value: TASK_PRIORITY_LABELS[task.priority] },
      ]
    : [];

  return (
    <Sheet open={task !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle className="text-xl break-words">{task?.title}</SheetTitle>
          <SheetDescription className="sr-only">Task details</SheetDescription>
        </SheetHeader>
        {task ? (
          <>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              <TaskStatusBadge status={task.status} />
              <dl className="divide-y divide-border text-sm">
                {rows.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 py-2.5">
                    <dt className="flex w-28 shrink-0 items-center gap-2 text-muted-foreground">
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      {label}
                    </dt>
                    <dd className="min-w-0 break-words">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="font-serif text-sm leading-7 whitespace-pre-wrap text-pretty text-muted-foreground">
                {task.description || "No description."}
              </p>
            </div>
            <SheetFooter className="flex-row justify-end gap-2 border-t border-border">
              <Button variant="outline" className="[&_svg]:text-destructive" onClick={() => onDelete(task)}>
                <Trash2 aria-hidden="true" />
                Delete
              </Button>
              <Button onClick={() => onEdit(task)}>
                <Pencil aria-hidden="true" />
                Edit
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
