import { format } from "date-fns";
import { Plus } from "lucide-react";

import { TaskRow } from "@/features/workspace/tasks/components/TaskRow";
import type { TasksDayPanelProps } from "@/features/workspace/tasks/types/components";
import { EmptyState } from "@/shared/components/EmptyState";
import { Reveal } from "@/shared/components/Reveal";
import { SortableList } from "@/shared/components/SortableList";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TasksDayPanel({ date, tasks, isLoading, onAdd, onOpen, onEdit, onDelete, onReorder }: TasksDayPanelProps) {
  const count = isLoading ? "Loading tasks" : tasks.length === 0 ? "No tasks" : `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;

  return (
    <Reveal as="section" className={cn(panelClassName, "flex h-[min(32rem,70dvh)] min-w-0 flex-col overflow-hidden p-4 sm:p-5 xl:h-full xl:min-h-0")}>
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg leading-tight sm:text-xl">{format(date, "EEEE, d MMM yyyy")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{count}</p>
        </div>
        <Button variant="outline" className="h-10 shrink-0" onClick={onAdd}>
          <Plus aria-hidden="true" />
          Add Task
        </Button>
      </div>
      <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <TableSkeleton rows={3} flush cells={[["A task title goes here", "A time, priority and status"], "··"]} />
        ) : tasks.length === 0 ? (
          <EmptyState
            bare
            className="rounded-xl border border-dashed border-border px-4 py-8"
            image="icon-empty-tasks"
            title="Nothing planned"
            description="Add a task for this day, or pick another date."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-2.5">
            <SortableList ids={tasks.map((task) => task.id)} onReorder={onReorder}>
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </SortableList>
          </ul>
        )}
      </div>
    </Reveal>
  );
}
