import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, Clock3, Plus } from "lucide-react";

import {
  TASK_STATUS_BADGE_CLASS,
  TASK_STATUS_DOT_COLORS,
  TASK_STATUS_LABELS,
} from "@/features/workspace/tasks/constants/taskStatus";
import type { TasksDayPanelProps } from "@/features/workspace/tasks/types/components";
import { compareByPriority } from "@/features/workspace/tasks/utils/taskCalendarSort";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import { FLUID_ITEM, FLUID_LIST } from "@/shared/constants/pageMotion";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TasksDayPanel({ date, tasks, onAddTask, onEditTask }: TasksDayPanelProps) {
  const dateKey = format(date, "yyyy-MM-dd");
  const sorted = [...tasks].sort(compareByPriority);
  const doneCount = tasks.filter((task) => task.status === "done").length;

  return (
    <aside className={cn("flex h-full min-h-[420px] flex-col", glassPanelClassName)}>
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={dateKey} {...FLUID_LIST} className="min-w-0">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {format(date, "EEEE")}
            </p>
            <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
              {format(date, "MMMM d, yyyy")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {tasks.length === 0
                ? "No tasks scheduled"
                : `${doneCount} of ${tasks.length} completed`}
            </p>
          </motion.div>
        </AnimatePresence>
        <Button size="sm" className="shrink-0 gap-1.5 rounded-full" onClick={onAddTask}>
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={dateKey} {...FLUID_LIST} className="flex flex-col gap-1.5">
            {sorted.length === 0 ? (
              <motion.li
                variants={FLUID_ITEM}
                className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-4 py-10 text-center"
              >
                <CalendarPlus className="size-6 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Nothing planned for this day.</p>
                <Button variant="outline" size="sm" className="rounded-full" onClick={onAddTask}>
                  Plan a task
                </Button>
              </motion.li>
            ) : (
              sorted.map((task) => (
                <motion.li key={task.id} variants={FLUID_ITEM}>
                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="flex w-full items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span
                      className={cn("mt-1.5 size-2 shrink-0 rounded-full", TASK_STATUS_DOT_COLORS[task.status])}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-sm font-medium text-foreground",
                          task.status === "done" && "text-muted-foreground line-through",
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {task.due_time ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="size-3" aria-hidden="true" />
                            {task.due_time}
                          </span>
                        ) : null}
                        <span className={cn("rounded-full px-1.5 py-0.5 font-medium", TASK_STATUS_BADGE_CLASS[task.status])}>
                          {TASK_STATUS_LABELS[task.status]}
                        </span>
                        <span className="capitalize">{task.priority}</span>
                      </span>
                    </span>
                  </button>
                </motion.li>
              ))
            )}
          </motion.ul>
        </AnimatePresence>
      </div>
    </aside>
  );
}
