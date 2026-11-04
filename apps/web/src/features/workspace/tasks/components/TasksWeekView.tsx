import { useEffect, useRef } from "react";
import { format, isSameDay, isToday } from "date-fns";

import { TimelineColumn } from "@/features/workspace/tasks/components/TimelineColumn";
import { TimelineGutter } from "@/features/workspace/tasks/components/TimelineGutter";
import { TimelineHourLines } from "@/features/workspace/tasks/components/TimelineHourLines";
import { UntimedTaskChip } from "@/features/workspace/tasks/components/UntimedTaskChip";
import { TIMELINE_EDGE_PAD_PX, TIMELINE_HEIGHT_PX, TIMELINE_HOUR_HEIGHT_PX, TIMELINE_SCROLL_HOUR, TIMELINE_START_HOUR } from "@/features/workspace/tasks/constants/calendar";
import type { TasksWeekViewProps } from "@/features/workspace/tasks/types/components";
import { buildWeekDays } from "@/features/workspace/tasks/utils/calendarGrid";
import { untimedTasks } from "@/features/workspace/tasks/utils/taskTimeline";
import { cn } from "@/shared/lib/utils";
import { serializeDateValue } from "@/shared/utils/dateValue";

const COLUMNS = "grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] sm:grid-cols-[4rem_repeat(7,minmax(0,1fr))]";

/** The day headers sit inside the scroller, so they stay lined up with their columns when a phone scrolls sideways. */
export function TasksWeekView({ cursor, selectedDate, tasksByDate, onSelectDate, onAddAt, onOpenTask }: TasksWeekViewProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const days = buildWeekDays(cursor);
  const tasksFor = (day: Date) => tasksByDate.get(serializeDateValue(day)) ?? [];
  const hasUntimed = days.some((day) => untimedTasks(tasksFor(day)).length > 0);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: (TIMELINE_SCROLL_HOUR - TIMELINE_START_HOUR) * TIMELINE_HOUR_HEIGHT_PX });
  }, []);

  return (
    <div ref={scrollerRef} className="mt-4 min-h-0 flex-1 overflow-auto">
      <div className="min-w-[32rem] sm:min-w-[36rem]">
        <div className="sticky top-0 z-[4] bg-card">
          <div className={cn("grid", COLUMNS)}>
            <div className="sticky left-0 bg-card" />
            {days.map((day) => {
              const selected = isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  aria-pressed={selected}
                  aria-label={format(day, "EEEE, MMMM d")}
                  onClick={() => onSelectDate(day)}
                  className="flex flex-col items-center gap-1 rounded-lg pb-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className="text-[10px] text-muted-foreground sm:text-xs">{format(day, "EEE")}</span>
                  <span
                    className={cn(
                      "inline-flex size-7 items-center justify-center rounded-full text-sm tabular-nums sm:size-8",
                      selected && "bg-primary text-primary-foreground",
                      isToday(day) && !selected && "ring-1 ring-primary/50",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </button>
              );
            })}
          </div>
          {hasUntimed ? (
            <div className={cn("grid border-t border-border py-1", COLUMNS)}>
              <div className="sticky left-0 bg-card pr-2 text-right text-[10px] text-muted-foreground sm:text-xs">No time</div>
              {days.map((day) => (
                <div key={day.toISOString()} className="grid min-w-0 content-start gap-0.5 px-0.5">
                  {untimedTasks(tasksFor(day)).map((task) => (
                    <UntimedTaskChip key={task.id} task={task} onOpen={onOpenTask} />
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex" style={{ height: TIMELINE_HEIGHT_PX + TIMELINE_EDGE_PAD_PX * 2 }}>
          <TimelineGutter />
          <div
            className="relative grid flex-1 grid-cols-7"
            style={{ marginTop: TIMELINE_EDGE_PAD_PX, marginBottom: TIMELINE_EDGE_PAD_PX, height: TIMELINE_HEIGHT_PX }}
          >
            <TimelineHourLines />
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={cn("relative min-h-0 border-l border-border first:border-l-0", isSameDay(day, selectedDate) && "bg-accent/50")}
              >
                <TimelineColumn date={day} tasks={tasksFor(day)} compact onAddAt={onAddAt} onOpenTask={onOpenTask} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
