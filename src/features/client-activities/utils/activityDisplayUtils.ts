import { format } from "date-fns";

import { parseUrlDateParam } from "@/shared/utils/urlDateParams";

export function formatActivityDateTime(date: string, time: string): string {
  const parsed = parseUrlDateParam(date);
  if (!parsed) return `${date} · ${time}`;
  return `${format(parsed, "MMM d, yyyy")} · ${time}`;
}
