import { minutesOfDay } from "@/lib/time";
import type { Task } from "@/shared/types/types";

export const TIMELINE_START_HOUR = 6;
export const TIMELINE_END_HOUR = 23;
export const TIMELINE_SCROLL_HOUR = 8;
export const HOUR_HEIGHT = 64;
/** Tasks have only a start time, so blocks assume this length. */
const BLOCK_MINUTES = 60;

export type PositionedTask = { task: Task; top: number; height: number; leftPercent: number; widthPercent: number };

function timelineStart(task: Task): number | null {
  const start = minutesOfDay(task.due_time);
  return start !== null && start >= TIMELINE_START_HOUR * 60 && start < TIMELINE_END_HOUR * 60 ? start : null;
}

export function untimedTasks(tasks: Task[]) {
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
        top: ((start - TIMELINE_START_HOUR * 60) / 60) * HOUR_HEIGHT,
        height: (BLOCK_MINUTES / 60) * HOUR_HEIGHT,
        leftPercent: (column / columnEnds.length) * 100,
        widthPercent: 100 / columnEnds.length,
      });
    }
    cluster = [];
    columnEnds = [];
  };

  for (const entry of entries) {
    if (columnEnds.length > 0 && entry.start >= Math.max(...columnEnds)) flush();
    const free = columnEnds.findIndex((end) => end <= entry.start);
    const column = free === -1 ? columnEnds.length : free;
    columnEnds[column] = entry.start + BLOCK_MINUTES;
    cluster.push({ ...entry, column });
  }
  flush();
  return positioned;
}
