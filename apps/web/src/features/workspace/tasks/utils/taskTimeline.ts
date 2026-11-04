import {
  TASK_BLOCK_MINUTES,
  TIMELINE_END_HOUR,
  TIMELINE_HOUR_HEIGHT_PX,
  TIMELINE_START_HOUR,
} from "@/features/workspace/tasks/constants/calendar";
import { formatTimeLabel } from "@/shared/constants/times";
import type { Task } from "@/shared/types/types";

export type PositionedTask = {
  task: Task;
  topPx: number;
  heightPx: number;
  leftPercent: number;
  widthPercent: number;
};

/** Reads the stored "10:00 AM" text, and "14:30" should any older row use it. */
export function parseTimeToMinutes(time: string | null): number | null {
  const match = time?.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) {
    return null;
  }
  const [, hour, minute, meridiem] = match;
  const period = meridiem?.toUpperCase();
  const hour24 = period ? (Number(hour) % 12) + (period === "PM" ? 12 : 0) : Number(hour);
  return hour24 * 60 + Number(minute);
}

export function formatTaskEndTime(time: string | null): string | null {
  const start = parseTimeToMinutes(time);
  if (start === null) {
    return null;
  }
  const end = (start + TASK_BLOCK_MINUTES) % (24 * 60);
  return formatTimeLabel(Math.floor(end / 60), end % 60);
}

export function formatTaskTimeRange(time: string | null): string | null {
  const end = formatTaskEndTime(time);
  return end ? `${time} – ${end}` : null;
}

/** Whether the task can sit on the timeline: it needs a readable time inside the visible hours. */
function timelineStart(task: Task): number | null {
  const start = parseTimeToMinutes(task.due_time);
  return start !== null && start >= TIMELINE_START_HOUR * 60 && start < TIMELINE_END_HOUR * 60 ? start : null;
}

export function untimedTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => timelineStart(task) === null);
}

/** Places a day's tasks on the timeline. Tasks that overlap share the width, so none hides another. */
export function positionTasks(tasks: Task[]): PositionedTask[] {
  const entries = tasks
    .map((task) => ({ task, start: timelineStart(task) }))
    .filter((entry): entry is { task: Task; start: number } => entry.start !== null)
    .sort((a, b) => a.start - b.start);

  const positioned: PositionedTask[] = [];
  let cluster: { task: Task; start: number; column: number }[] = [];
  let columnEnds: number[] = [];

  const flush = () => {
    for (const { task, start, column } of cluster) {
      positioned.push({
        task,
        topPx: ((start - TIMELINE_START_HOUR * 60) / 60) * TIMELINE_HOUR_HEIGHT_PX,
        heightPx: (TASK_BLOCK_MINUTES / 60) * TIMELINE_HOUR_HEIGHT_PX,
        leftPercent: (column / columnEnds.length) * 100,
        widthPercent: 100 / columnEnds.length,
      });
    }
    cluster = [];
    columnEnds = [];
  };

  for (const entry of entries) {
    if (columnEnds.length > 0 && entry.start >= Math.max(...columnEnds)) {
      flush();
    }
    const free = columnEnds.findIndex((end) => end <= entry.start);
    const column = free === -1 ? columnEnds.length : free;
    columnEnds[column] = entry.start + TASK_BLOCK_MINUTES;
    cluster.push({ ...entry, column });
  }
  flush();
  return positioned;
}
