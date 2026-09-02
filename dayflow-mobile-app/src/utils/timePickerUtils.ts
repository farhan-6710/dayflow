export type TimePeriod = "AM" | "PM";

export function to12HourParts(hour24: number, minute: number) {
  const safeHour = Number.isFinite(hour24) ? Math.max(0, Math.min(23, hour24)) : 9;
  const safeMinute = Number.isFinite(minute) ? Math.max(0, Math.min(59, minute)) : 0;
  const period: TimePeriod = safeHour >= 12 ? "PM" : "AM";
  const hour12 = safeHour % 12 === 0 ? 12 : safeHour % 12;

  return {
    hour12,
    minute: safeMinute,
    period,
  };
}

export function to24Hour(hour12: number, minute: number, period: TimePeriod) {
  const safeHour12 = Math.max(1, Math.min(12, hour12));
  const safeMinute = Math.max(0, Math.min(59, minute));

  let hour24 = safeHour12 % 12;
  if (period === "PM") {
    hour24 += 12;
  }

  return { hour: hour24, minute: safeMinute };
}

export function formatTimeLabel(hour24: number, minute: number): string {
  const { hour12, minute: min, period } = to12HourParts(hour24, minute);
  return `${hour12}:${String(min).padStart(2, "0")} ${period}`;
}
