import { useEffect, useRef } from "react";

import { TimelineColumn } from "@/features/workspace/tasks/components/TimelineColumn";
import { TimelineGutter } from "@/features/workspace/tasks/components/TimelineGutter";
import { TimelineHourLines } from "@/features/workspace/tasks/components/TimelineHourLines";
import { UntimedTaskChip } from "@/features/workspace/tasks/components/UntimedTaskChip";
import { TIMELINE_EDGE_PAD_PX, TIMELINE_HEIGHT_PX, TIMELINE_HOUR_HEIGHT_PX, TIMELINE_SCROLL_HOUR, TIMELINE_START_HOUR } from "@/features/workspace/tasks/constants/calendar";
import type { TasksDayViewProps } from "@/features/workspace/tasks/types/components";
import { untimedTasks } from "@/features/workspace/tasks/utils/taskTimeline";

export function TasksDayView({ date, tasks, onAddAt, onOpenTask }: TasksDayViewProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const untimed = untimedTasks(tasks);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: (TIMELINE_SCROLL_HOUR - TIMELINE_START_HOUR) * TIMELINE_HOUR_HEIGHT_PX });
  }, []);

  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
      {untimed.length > 0 ? (
        <div className="mb-2 flex shrink-0 gap-2 border-b border-border pb-2">
          <span className="w-12 shrink-0 pr-0 text-right text-[10px] text-muted-foreground sm:w-14 sm:text-xs">No time</span>
          <div className="grid min-w-0 flex-1 gap-1">
            {untimed.map((task) => (
              <UntimedTaskChip key={task.id} task={task} onOpen={onOpenTask} />
            ))}
          </div>
        </div>
      ) : null}
      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex" style={{ height: TIMELINE_HEIGHT_PX + TIMELINE_EDGE_PAD_PX * 2 }}>
          <TimelineGutter />
          <div
            className="relative min-w-0 flex-1"
            style={{ marginTop: TIMELINE_EDGE_PAD_PX, marginBottom: TIMELINE_EDGE_PAD_PX, height: TIMELINE_HEIGHT_PX }}
          >
            <TimelineHourLines />
            <TimelineColumn date={date} tasks={tasks} onAddAt={onAddAt} onOpenTask={onOpenTask} />
          </div>
        </div>
      </div>
    </div>
  );
}
