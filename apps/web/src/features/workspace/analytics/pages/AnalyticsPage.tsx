import { NotesByProjectChart } from "@/features/workspace/analytics/components/NotesByProjectChart";
import { TaskStatusChart } from "@/features/workspace/analytics/components/TaskStatusChart";
import { useAnalytics } from "@/features/workspace/analytics/hooks/useAnalytics";
import { ChartSkeleton } from "@/shared/components/ChartSkeleton";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import type { StatCardItem } from "@/shared/types/components";

export function AnalyticsPage() {
  const page = useAnalytics();
  const cards: StatCardItem[] = [
    { id: "total", label: "Total tasks", value: page.totalTasks, image: "icon-stat-tasks", description: "Personal tasks" },
    {
      id: "completed",
      label: "Completed",
      value: `${page.completedTasks}/${page.totalTasks}`,
      image: "icon-stat-completed",
      description: "Tasks marked done",
    },
    { id: "rate", label: "Completion rate", value: `${page.completionRate}%`, image: "icon-stat-rate", description: "Share of tasks done" },
    { id: "notes", label: "Total notes", value: page.totalNotes, image: "icon-stat-notes", description: "Across all projects" },
  ];

  return (
    <>
      <PageHeader heading="Analytics" description="How your tasks are moving, and where your notes live." />
      <div className="grid min-w-0 gap-4">
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <StatsCards cards={cards} isLoading={page.loading} />
        {page.loading ? (
          <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <ChartSkeleton title="Tasks by status" chartClassName="h-72" />
            <ChartSkeleton title="Notes per project" chartClassName="h-[32rem]" />
          </div>
        ) : page.error ? null : (
          <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <TaskStatusChart data={page.statusData} />
            <NotesByProjectChart data={page.notesByProject} />
          </div>
        )}
      </div>
    </>
  );
}
