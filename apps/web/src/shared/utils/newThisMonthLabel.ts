import { isSameMonth } from "date-fns";

/** Chip text for a total stat, or nothing when no items were added this month. */
export function newThisMonthLabel(items: { created_at: string }[]): string | undefined {
  const now = new Date();
  const count = items.filter((item) => isSameMonth(new Date(item.created_at), now)).length;
  return count > 0 ? `+${count} new` : undefined;
}
