import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, Plus } from "lucide-react";

import { SortableTasksDayTaskItem } from "@/features/workspace/tasks/components/SortableTasksDayTaskItem";
import type { TasksDayPanelProps } from "@/features/workspace/tasks/types/components";
import { compareBySortOrder } from "@/features/workspace/tasks/utils/taskCalendarSort";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import { FLUID_ITEM, FLUID_LIST } from "@/shared/constants/pageMotion";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TasksDayPanel({
  date,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onReorderTasks,
}: TasksDayPanelProps) {
  const dateKey = format(date, "yyyy-MM-dd");
  const sorted = [...tasks].sort(compareBySortOrder);
  const taskIds = sorted.map((task) => task.id);
  const doneCount = tasks.filter((task) => task.status === "done").length;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = taskIds.indexOf(String(active.id));
    const newIndex = taskIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    onReorderTasks(arrayMove(taskIds, oldIndex, newIndex));
  }

  return (
    <aside
      className={cn(
        "flex h-full min-h-[320px] min-w-0 flex-col sm:min-h-[420px]",
        glassPanelClassName,
      )}
    >
      <div className="flex items-start justify-between gap-2 border-b border-border px-3 py-3 sm:gap-3 sm:px-5 sm:py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={dateKey} {...FLUID_LIST} className="min-w-0">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-xs">
              {format(date, "EEEE")}
            </p>
            <h3 className="mt-0.5 truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {format(date, "MMM d, yyyy")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {tasks.length === 0
                ? "No tasks scheduled"
                : `${doneCount} of ${tasks.length} completed`}
            </p>
          </motion.div>
        </AnimatePresence>
        <Button
          size="sm"
          className="shrink-0 gap-1.5 rounded-full px-2.5 sm:px-3"
          onClick={onAddTask}
        >
          <Plus className="size-3.5" />
          <span className="hidden min-[360px]:inline">Add Task</span>
          <span className="min-[360px]:hidden">Add</span>
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-1 sm:px-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={dateKey} {...FLUID_LIST}>
            {sorted.length === 0 ? (
              <motion.div
                variants={FLUID_ITEM}
                className="mt-2 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-4 py-10 text-center"
              >
                <CalendarPlus className="size-6 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Nothing planned for this day.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={onAddTask}
                >
                  Plan a task
                </Button>
              </motion.div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={taskIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="[&>[data-slot=day-task-row]+[data-slot=day-task-row]]:border-t [&>[data-slot=day-task-row]+[data-slot=day-task-row]]:border-border">
                    {sorted.map((task) => (
                      <SortableTasksDayTaskItem
                        key={task.id}
                        task={task}
                        onEdit={() => onEditTask(task)}
                        onDelete={() => onDeleteTask(task)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}
