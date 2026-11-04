import { endOfDay, endOfMonth, format, isSameDay, startOfDay, startOfMonth, subMonths } from "date-fns";

export const DATE_FILTER_PERIODS = [
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "last_3_months", label: "Last 3 Months" },
] as const;

export type DateFilterPeriodId = (typeof DATE_FILTER_PERIODS)[number]["id"];

export type DateFilterState =
  | { mode: "all" }
  | { mode: "period"; period: DateFilterPeriodId }
  | { mode: "range"; from: Date; to: Date };

export type DateRange = { from: Date; to: Date };

export function resolveDateRange(filter: DateFilterState, referenceDate = new Date()): DateRange | null {
  const today = endOfDay(referenceDate);
  if (filter.mode === "all") return null;
  if (filter.mode === "range") return { from: startOfDay(filter.from), to: endOfDay(filter.to) };
  if (filter.period === "this_month") return { from: startOfMonth(today), to: today };
  if (filter.period === "last_month") {
    const lastMonth = subMonths(today, 1);
    return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
  }
  return { from: startOfMonth(subMonths(today, 2)), to: today };
}

export function dateFilterLabel(filter: DateFilterState): string {
  if (filter.mode === "all") return "All";
  if (filter.mode === "period") return DATE_FILTER_PERIODS.find((period) => period.id === filter.period)?.label ?? "All";
  const from = format(filter.from, "MMM d");
  return isSameDay(filter.from, filter.to) ? from : `${from} – ${format(filter.to, "MMM d")}`;
}
