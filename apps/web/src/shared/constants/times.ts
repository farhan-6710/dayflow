/** Stored as display text (e.g. "10:00 AM") in the existing tables, so web and mobile must both use this format. */
export const DEFAULT_TIME = "10:00 AM";

function formatTimeLabel(hour24: number, minute: number): string {
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${hour24 >= 12 ? "PM" : "AM"}`;
}

/** 6:00 AM to 10:00 PM, every half hour. */
export const AVAILABLE_TIMES = Array.from({ length: 33 }, (_, index) =>
  formatTimeLabel(6 + Math.floor(index / 2), index % 2 === 0 ? 0 : 30),
);
