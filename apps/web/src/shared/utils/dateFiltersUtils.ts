import { endOfDay, endOfMonth, format, isSameDay, startOfDay, startOfMonth, subMonths } from "date-fns";

import { DATE_FILTER_PERIODS } from "@/shared/constants/dateFilters";
import type { DateFiltersFilterState } from "@/shared/types/components";

export type DateFiltersResolvedRange = {
  from: Date;
  to: Date;
};

export function resolveDateFiltersRange(
  filter: DateFiltersFilterState,
  referenceDate = new Date(),
): DateFiltersResolvedRange | null {
  const today = endOfDay(referenceDate);

  if (filter.mode === "all") {
    return null;
  }
  if (filter.mode === "range") {
    return { from: startOfDay(filter.from), to: endOfDay(filter.to) };
  }
  if (filter.period === "this_month") {
    return { from: startOfMonth(today), to: today };
  }
  if (filter.period === "last_month") {
    const lastMonth = subMonths(today, 1);
    return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
  }
  return { from: startOfMonth(subMonths(today, 2)), to: today };
}

export function formatDateFiltersLabel(filter: DateFiltersFilterState): string {
  if (filter.mode === "all") {
    return "All";
  }
  if (filter.mode === "period") {
    return DATE_FILTER_PERIODS.find((period) => period.id === filter.period)?.label ?? "All";
  }
  const from = format(filter.from, "MMM d, yyyy");
  return isSameDay(filter.from, filter.to) ? from : `${from} – ${format(filter.to, "MMM d, yyyy")}`;
}
