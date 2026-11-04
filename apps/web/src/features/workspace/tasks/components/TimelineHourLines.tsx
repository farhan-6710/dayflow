import { TIMELINE_HOUR_HEIGHT_PX, TIMELINE_HOURS } from "@/features/workspace/tasks/constants/calendar";

export function TimelineHourLines() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {TIMELINE_HOURS.map((hour, index) => (
        <div key={hour} className="absolute inset-x-0 border-t border-dashed border-border" style={{ top: index * TIMELINE_HOUR_HEIGHT_PX }} />
      ))}
    </div>
  );
}
