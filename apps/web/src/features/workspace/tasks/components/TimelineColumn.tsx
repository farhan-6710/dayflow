import { format } from "date-fns";

import { TaskBlock } from "@/features/workspace/tasks/components/TaskBlock";
import { TIMELINE_END_HOUR, TIMELINE_HOUR_HEIGHT_PX, TIMELINE_START_HOUR } from "@/features/workspace/tasks/constants/calendar";
import type { TimelineColumnProps } from "@/features/workspace/tasks/types/components";
import { positionTasks } from "@/features/workspace/tasks/utils/taskTimeline";
import { formatTimeLabel } from "@/shared/constants/times";

const SLOT_HOURS = Array.from({ length: TIMELINE_END_HOUR - TIMELINE_START_HOUR }, (_, index) => TIMELINE_START_HOUR + index);

/** One day: an add-a-task button per hour, with the day's task blocks on top. */
export function TimelineColumn({ date, tasks, compact, onAddAt, onOpenTask }: TimelineColumnProps) {
  return (
    <>
      {SLOT_HOURS.map((hour, index) => {
        const time = formatTimeLabel(hour, 0);
        return (
          <button
            key={hour}
            type="button"
            aria-label={`Add task on ${format(date, "MMMM d")} at ${time}`}
            onClick={(event) => {
              event.stopPropagation();
              onAddAt(date, time);
            }}
            className="absolute inset-x-0 transition-colors outline-none hover:bg-muted/40 focus-visible:bg-muted/60"
            style={{ top: index * TIMELINE_HOUR_HEIGHT_PX, height: TIMELINE_HOUR_HEIGHT_PX }}
          />
        );
      })}
      {positionTasks(tasks).map((positioned) => (
        <TaskBlock key={positioned.task.id} positioned={positioned} compact={compact} onOpen={onOpenTask} />
      ))}
    </>
  );
}
