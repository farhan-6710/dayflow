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
import { DayflowImage } from "@/shared/components/DayflowImage";
import { DAYFLOW_IMAGES } from "@/shared/constants/dayflowImages";
import { raisedStaticPanelClassName } from "@/shared/constants/layoutStyles";
import { FLUID_ITEM, FLUID_LIST } from "@/shared/constants/pageMotion";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";

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
        raisedStaticPanelClassName,
      )}
    >
      <div className="flex items-start justify-between gap-2 px-3 pt-4 pb-3 sm:gap-3 sm:px-5 sm:pt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={dateKey} {...FLUID_LIST} className="min-w-0">
            <span className="tabular inline-flex h-7 items-center gap-1.5 rounded-full border border-tint/40 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--tint)_55%,white),color-mix(in_srgb,var(--tint)_38%,var(--card)))] px-3 text-xs font-semibold tracking-wide text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_3px_color-mix(in_srgb,var(--tint)_28%,transparent)] dark:bg-none dark:bg-[color-mix(in_srgb,var(--tint)_25%,var(--card))] dark:shadow-none">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-[color-mix(in_srgb,var(--chart-5)_75%,var(--warning-foreground))]"
              />
              {format(date, "EEEE")}
            </span>
            <h3 className="mt-2.5 truncate text-[1.75rem] leading-tight font-bold">
              {format(date, "MMM d, yyyy")}
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <Progress
                value={tasks.length ? (doneCount / tasks.length) * 100 : 0}
                className="h-2 max-w-40 flex-1 bg-foreground/10"
                aria-label="Tasks completed for this day"
              />
              <span className="tabular shrink-0 text-xs text-muted-foreground">
                {tasks.length === 0
                  ? "No tasks scheduled"
                  : `${doneCount} of ${tasks.length} done`}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        <Button
          size="sm"
          className="shrink-0 gap-1.5 px-2.5 sm:px-3"
          onClick={onAddTask}
        >
          <Plus className="size-3.5" />
          <span className="hidden min-[360px]:inline">Add Task</span>
          <span className="min-[360px]:hidden">Add</span>
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-1 pb-4 sm:px-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={dateKey} {...FLUID_LIST}>
            {sorted.length === 0 ? (
              <motion.div
                variants={FLUID_ITEM}
                className="surface-chip mt-2 flex flex-col items-center gap-3 rounded-[0.8rem] px-4 py-10 text-center"
              >
                <DayflowImage
                  src={DAYFLOW_IMAGES.emptyTasks}
                  className="size-16"
                  fallback={
                    <CalendarPlus
                      className="size-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                  }
                />
                <p className="text-sm text-foreground/75">
                  Nothing planned for this day.
                </p>
                <Button
                  variant="outline"
                  size="sm"
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
                  <div className="space-y-2.5 pt-1">
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
