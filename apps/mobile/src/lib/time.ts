/** Times are stored as display text such as "10:00 AM" so web and mobile agree. */
export function parseTimeLabel(label: string | null | undefined): { hour: number; minute: number } | null {
  const match = label?.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number.parseInt(match[1] ?? "", 10);
  const minute = Number.parseInt(match[2] ?? "", 10);
  const period = match[3]?.toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

export function minutesOfDay(label: string | null | undefined): number | null {
  const parsed = parseTimeLabel(label);
  return parsed ? parsed.hour * 60 + parsed.minute : null;
}
