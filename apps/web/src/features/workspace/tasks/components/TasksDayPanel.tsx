import { format, isToday } from "date-fns";
import { Plus } from "lucide-react";

import { TaskRow } from "@/features/workspace/tasks/components/TaskRow";
import type { TasksDayPanelProps } from "@/features/workspace/tasks/types/components";
import { EmptyState } from "@/shared/components/EmptyState";
import { SortableList } from "@/shared/components/SortableList";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TasksDayPanel({ date, tasks, isLoading, onAdd, onEdit, onDelete, onReorder }: TasksDayPanelProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 p-5 xl:sticky xl:top-4")}>
      <h2 className="truncate text-xl">{isToday(date) ? "Today" : format(date, "EEEE")}</h2>
      <p className="text-sm text-muted-foreground">{format(date, "MMMM d, yyyy")}</p>
      {isLoading ? (
        <TableSkeleton rows={3} flush cells={[["A task title goes here", "A time, priority and status"], "··"]} />
      ) : tasks.length === 0 ? (
        <EmptyState
          bare
          className="px-2 py-8"
          image="icon-empty-tasks"
          title="Nothing planned"
          description="Add a task for this day, or pick another date."
          action={
            <Button variant="outline" className="h-10" onClick={onAdd}>
              <Plus aria-hidden="true" />
              Add task
            </Button>
          }
        />
      ) : (
        <ul className="mt-2 divide-y divide-border">
          <SortableList ids={tasks.map((task) => task.id)} onReorder={onReorder}>
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </SortableList>
        </ul>
      )}
    </Reveal>
  );
}
