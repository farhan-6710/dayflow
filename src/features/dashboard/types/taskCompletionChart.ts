export type TaskCompletionMonthSelection = {
  year: number;
  month: number;
};

export type TaskCompletionChartPoint = {
  day: string;
  currentMonth: number;
  previousMonth: number;
};

export type TaskCompletionChartData = {
  points: TaskCompletionChartPoint[];
  currentMonthLabel: string;
  previousMonthLabel: string;
  currentTotal: number;
  previousTotal: number;
  growthPercent: number | null;
};
