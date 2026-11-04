import type { TaskStatus } from "@/shared/types/types";

export const CALENDAR_VIEWS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
] as const;

export type CalendarView = (typeof CALENDAR_VIEWS)[number]["value"];

/** Matches the task form's time options: 6:00 AM to 10:00 PM, with room for a block starting at 10. */
export const TIMELINE_START_HOUR = 6;
export const TIMELINE_END_HOUR = 23;
/** Timelines open here, with earlier hours a scroll away. */
export const TIMELINE_SCROLL_HOUR = 8;
export const TIMELINE_HOUR_HEIGHT_PX = 64;
export const TIMELINE_HEIGHT_PX = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * TIMELINE_HOUR_HEIGHT_PX;
/** Every hour line, from start to end inclusive. */
export const TIMELINE_HOURS = Array.from({ length: TIMELINE_END_HOUR - TIMELINE_START_HOUR + 1 }, (_, index) => TIMELINE_START_HOUR + index);
/** Room above and below so hour labels centred on their lines aren't clipped. */
export const TIMELINE_EDGE_PAD_PX = 12;
/** Tasks have only a start time, so blocks assume this length. */
export const TASK_BLOCK_MINUTES = 60;

/** Pastel block with a left accent. Mixed with the card so hour lines don't show through. */
export const TASK_BLOCK_CLASS: Record<TaskStatus, string> = {
  todo: "border-l-muted-foreground/60 bg-muted",
  in_progress: "border-l-chart-1 bg-[color-mix(in_oklab,var(--chart-1)_15%,var(--card))]",
  done: "border-l-success bg-[color-mix(in_oklab,var(--success)_15%,var(--card))]",
  missed: "border-l-destructive bg-[color-mix(in_oklab,var(--destructive)_10%,var(--card))]",
};
