export const DATE_FILTER_PERIODS = [
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "last_3_months", label: "Last 3 Months" },
] as const;

export type DateFilterPeriodId =
  (typeof DATE_FILTER_PERIODS)[number]["id"];
