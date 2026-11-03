import { format } from "date-fns";

import { parseDateValue } from "@/shared/utils/dateValue";

export function formatActivityDateTime(date: string, time: string): string {
  const parsed = parseDateValue(date);
  return `${parsed ? format(parsed, "MMM d, yyyy") : date} · ${time}`;
}
