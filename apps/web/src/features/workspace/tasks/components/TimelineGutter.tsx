import { TIMELINE_EDGE_PAD_PX, TIMELINE_HOUR_HEIGHT_PX, TIMELINE_HOURS } from "@/features/workspace/tasks/constants/calendar";
import { formatTimeLabel } from "@/shared/constants/times";

/** Hour labels. Sticky so they stay put when a week scrolls sideways on a phone. */
export function TimelineGutter() {
  return (
    <div className="sticky left-0 z-[3] w-14 shrink-0 bg-card sm:w-16">
      {TIMELINE_HOURS.map((hour, index) => (
        <p
          key={hour}
          className="absolute right-2 -translate-y-1/2 text-[10px] whitespace-nowrap text-muted-foreground sm:text-xs"
          style={{ top: TIMELINE_EDGE_PAD_PX + index * TIMELINE_HOUR_HEIGHT_PX }}
        >
          {formatTimeLabel(hour, 0)}
        </p>
      ))}
    </div>
  );
}
