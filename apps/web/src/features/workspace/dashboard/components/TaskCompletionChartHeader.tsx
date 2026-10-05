import { TrendingDown, TrendingUp } from "lucide-react";

import { MonthSelector } from "@/shared/ui/MonthSelector";

type TaskCompletionChartHeaderProps = {
  primaryYear: number;
  primaryMonth: number;
  compareYear: number;
  compareMonth: number;
  onSelectPrimary: (date: Date) => void;
  onSelectCompare: (date: Date) => void;
  growthLabel: string | null;
  isUp: boolean;
};

export function TaskCompletionChartHeader({
  primaryYear,
  primaryMonth,
  compareYear,
  compareMonth,
  onSelectPrimary,
  onSelectCompare,
  growthLabel,
  isUp,
}: TaskCompletionChartHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight">Task Completion</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Completed tasks by day — pick any two months to compare.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <MonthSelector
          year={primaryYear}
          month={primaryMonth}
          onSelect={onSelectPrimary}
        />
        <span className="text-xs text-muted-foreground">vs</span>
        <MonthSelector
          year={compareYear}
          month={compareMonth}
          onSelect={onSelectCompare}
        />

        {growthLabel ? (
          <div
            className={
              isUp
                ? "flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
            }
          >
            {isUp ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            <span>{growthLabel}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
