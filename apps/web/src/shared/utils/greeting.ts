export type GreetingRange = {
  label: "Good Morning" | "Good Afternoon" | "Good Evening";
  /** Inclusive local hour 0–23. */
  startHour: number;
  /** Exclusive local hour 0–23. May be less than startHour when the range wraps midnight. */
  endHour: number;
};

/** Morning 5–12, afternoon 12–17, evening 17–5 (wraps midnight). */
export const GREETING_RANGES = [
  { label: "Good Morning", startHour: 5, endHour: 12 },
  { label: "Good Afternoon", startHour: 12, endHour: 17 },
  { label: "Good Evening", startHour: 17, endHour: 5 },
] as const satisfies readonly GreetingRange[];

function hourInRange(hour: number, startHour: number, endHour: number): boolean {
  return startHour < endHour ? hour >= startHour && hour < endHour : hour >= startHour || hour < endHour;
}

export function getGreeting(now: Date = new Date()): GreetingRange["label"] {
  const hour = now.getHours();
  const range = GREETING_RANGES.find((item) => hourInRange(hour, item.startHour, item.endHour));
  return range?.label ?? "Good Evening";
}
