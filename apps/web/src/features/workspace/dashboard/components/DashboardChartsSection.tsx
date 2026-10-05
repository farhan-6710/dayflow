import { DashboardPlaceholderCard } from "@/features/workspace/dashboard/components/DashboardPlaceholderCard";
import { TaskCompletionChart } from "@/features/workspace/dashboard/components/TaskCompletionChart";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import type { Task } from "@/services/tasksService";

type DashboardChartsSectionProps = {
  tasks: Task[];
  isLoading: boolean;
};

export function DashboardChartsSection({
  tasks,
  isLoading,
}: DashboardChartsSectionProps) {
  return (
    <div className={cn("space-y-6 lg:col-span-2", containMinWidthClassName)}>
      <TaskCompletionChart tasks={tasks} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <DashboardPlaceholderCard
          title="Weekly insights"
          description="Placeholder for upcoming productivity insights."
        />
        <DashboardPlaceholderCard
          title="Activity snapshot"
          description="Placeholder for upcoming activity breakdown."
        />
      </div>
    </div>
  );
}
