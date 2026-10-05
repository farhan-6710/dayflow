import { DashboardPanel } from "@/features/workspace/dashboard/components/DashboardPanel";
import { TaskCompletionAreaChart } from "@/features/workspace/dashboard/components/TaskCompletionAreaChart";
import { TaskCompletionChartHeader } from "@/features/workspace/dashboard/components/TaskCompletionChartHeader";
import { useTaskCompletionChart } from "@/features/workspace/dashboard/hooks/useTaskCompletionChart";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import type { Task } from "@/services/tasksService";
import type { ChartConfig } from "@/shared/ui/chart";

function formatGrowthLabel(growthPercent: number | null, compareLabel: string): string | null {
  if (growthPercent === null) return null;
  const rounded = Math.round(growthPercent * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}% vs ${compareLabel}`;
}

export function TaskCompletionChart({ tasks, isLoading }: { tasks: Task[]; isLoading: boolean }) {
  const { primary, compare, setPrimary, setCompare, chart } = useTaskCompletionChart(tasks);
  const growthLabel = formatGrowthLabel(chart.growthPercent, chart.previousMonthLabel);
  const isUp = (chart.growthPercent ?? 0) >= 0;
  const gradientId = `task-completion-${primary.year}-${primary.month}-${compare.year}-${compare.month}`;

  const chartConfig = {
    currentMonth: {
      label: chart.currentMonthLabel,
      color: "var(--primary)",
    },
    previousMonth: {
      label: chart.previousMonthLabel,
      color: "var(--accent)",
    },
  } satisfies ChartConfig;

  return (
    <DashboardPanel className="p-6">
      <TaskCompletionChartHeader
        primaryYear={primary.year}
        primaryMonth={primary.month}
        compareYear={compare.year}
        compareMonth={compare.month}
        onSelectPrimary={(date) =>
          setPrimary({ year: date.getFullYear(), month: date.getMonth() + 1 })
        }
        onSelectCompare={(date) =>
          setCompare({ year: date.getFullYear(), month: date.getMonth() + 1 })
        }
        growthLabel={growthLabel}
        isUp={isUp}
      />

      <div className="h-75 w-full">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <TaskCompletionAreaChart
            config={chartConfig}
            points={chart.points}
            gradientId={gradientId}
          />
        )}
      </div>
    </DashboardPanel>
  );
}
