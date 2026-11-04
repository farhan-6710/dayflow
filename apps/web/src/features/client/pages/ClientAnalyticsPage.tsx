import { ActivitiesByStatusChart } from "@/features/client/components/ActivitiesByStatusChart";
import { ProjectActivityTable } from "@/features/client/components/ProjectActivityTable";
import { useClientAnalytics } from "@/features/client/hooks/useClientAnalytics";
import { ChartSkeleton } from "@/shared/components/ChartSkeleton";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import type { StatCardItem } from "@/shared/types/components";

export function ClientAnalyticsPage() {
  const page = useClientAnalytics();
  const cards: StatCardItem[] = [
    { id: "total", label: "All activities", value: page.total, image: "icon-stat-tasks", description: "Tasks, meetings and calls" },
    { id: "open", label: "Open", value: page.open, image: "icon-stat-pending", description: "Pending or in progress" },
    { id: "completed", label: "Completed", value: page.completed, image: "icon-stat-completed", description: "Finished so far" },
    { id: "rate", label: "Completion rate", value: `${page.completionRate}%`, image: "icon-stat-rate", description: "Share of activities done" },
  ];

  return (
    <>
      <PageHeader heading="Analytics" description="How the work on your projects is moving." />
      <div className="grid min-w-0 gap-4">
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <StatsCards cards={cards} isLoading={page.loading} />
        {page.loading ? (
          <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
            <ChartSkeleton title="Activities by status" chartClassName="h-64" />
            <TableSkeleton rows={4} panel title="By project" cells={["A project name goes here", "00", "00"]} />
          </div>
        ) : page.error ? null : (
          <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
            <ActivitiesByStatusChart rows={page.statusRows} />
            <ProjectActivityTable rows={page.projectRows} />
          </div>
        )}
      </div>
    </>
  );
}
