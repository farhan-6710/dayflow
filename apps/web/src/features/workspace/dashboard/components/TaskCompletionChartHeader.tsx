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
        <h2 className="pl-1 text-2xl leading-none font-bold">Task Completion</h2>
        <p className="mt-2 pl-1 text-sm text-foreground/75">
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
                ? "flex h-8 items-center gap-1.5 rounded-full border border-success/40 bg-success/15 px-3 text-xs font-medium text-success-foreground"
                : "flex h-8 items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 text-xs font-medium text-destructive"
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
