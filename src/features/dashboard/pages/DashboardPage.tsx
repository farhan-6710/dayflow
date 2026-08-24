import { CheckCircle2, Circle, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router";

import { TaskCompletionChart } from "@/features/dashboard/components/TaskCompletionChart";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { PageContent } from "@/shared/components/PageContent";
import { DateFilters } from "@/shared/components/DateFilters";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { useDateFilters } from "@/shared/hooks/useDateFilters";
import {
  clientsSparklineData,
  employeesSparklineData,
  missedPostsSparklineData,
  totalPostsSparklineData,
} from "@/shared/fixtures/sparklines";
import { cn } from "@/shared/lib/utils";

export function DashboardPage() {
  const { filter, dateFilterProps, periodLabel } = useDateFilters();
  const {
    profile,
    loading,
    stats,
    tasks,
    urgentTasks,
    handleToggleTaskStatus,
  } = useDashboard(filter);

  const greetingName = profile?.display_name || "there";
  const isAll = periodLabel === "All";
  const periodDescription = isAll ? "all time" : periodLabel.toLowerCase();

  const cards = [
    {
      id: "pending-tasks",
      label: "Pending Tasks",
      value: stats.pending,
      icon: Clock,
      description: isAll
        ? "Tasks left to complete across all time"
        : `Tasks left to complete in ${periodDescription}`,
      href: "/tasks",
      sparklineData: employeesSparklineData,
      sparklineColor: "var(--primary)",
    },
    {
      id: "overdue-tasks",
      label: "Overdue Tasks",
      value: stats.overdue,
      icon: Clock,
      description: isAll
        ? "Tasks past their due date across all time"
        : `Tasks past their due date in ${periodDescription}`,
      href: "/tasks",
      sparklineData: missedPostsSparklineData,
      sparklineColor: "var(--accent)",
    },
    {
      id: "projects",
      label: "Projects",
      value: stats.projectsCount,
      icon: CheckCircle2,
      description: isAll
        ? "Note folders in your workspace"
        : `Note folders created in ${periodDescription}`,
      href: "/projects",
      sparklineData: clientsSparklineData,
      sparklineColor: "var(--primary)",
    },
    {
      id: "completed-tasks",
      label: "Completed Tasks",
      value: `${stats.completed}/${stats.total}`,
      icon: CheckCircle,
      description: isAll
        ? "Tasks finished successfully across all time"
        : `Tasks finished successfully in ${periodDescription}`,
      href: "/tasks",
      sparklineData: totalPostsSparklineData,
      sparklineColor: "var(--accent)",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        heading={`Welcome, ${greetingName}!`}
        description="Here is your personal workspace summary for today."
        actions={<DateFilters {...dateFilterProps} />}
      />

      <PageContent>
        <StatsCards cards={cards} isLoading={loading} />

        <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-3", containMinWidthClassName)}>
          <div className={cn("space-y-6 lg:col-span-2", containMinWidthClassName)}>

            <TaskCompletionChart tasks={tasks} isLoading={loading} />
          </div>

          <div className={cn("space-y-6", containMinWidthClassName)}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Focus List</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your active upcoming action items.</p>
                </div>
                <Link to="/tasks" className="text-xs font-semibold text-primary hover:underline">
                  View All Tasks
                </Link>
              </div>

              <div className="mt-4 divide-y divide-border">
                {loading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading tasks...</div>
                ) : urgentTasks.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">All caught up! No tasks left.</p>
                    <Link to="/tasks" className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
                      Create a Task
                    </Link>
                  </div>
                ) : (
                  urgentTasks.map((task) => (
                    <div key={task.id} className="flex min-w-0 items-center justify-between py-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <button
                          onClick={() => void handleToggleTaskStatus(task.id, task.status)}
                          className="mt-0.5 shrink-0 text-muted-foreground transition hover:text-primary"
                        >
                          {task.status === "done" ? (
                            <CheckCircle2 className="size-5 fill-primary/10 text-primary" />
                          ) : (
                            <Circle className="size-5" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <span
                            className={cn(
                              "block truncate text-sm font-medium text-foreground",
                              task.status === "done" && "text-muted-foreground line-through",
                            )}
                          >
                            {task.title}
                          </span>
                          {task.description && (
                            <span className="block truncate text-xs text-muted-foreground">{task.description}</span>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex shrink-0 items-center gap-2">
                        {task.due_date && (
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-2xs font-semibold text-secondary-foreground">
                            {task.due_date}
                          </span>
                        )}
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-2xs font-bold tracking-wider uppercase",
                            task.priority === "high" && "bg-destructive/10 text-destructive",
                            task.priority === "medium" && "bg-accent/10 text-accent",
                            task.priority === "low" && "bg-secondary text-secondary-foreground",
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
}
