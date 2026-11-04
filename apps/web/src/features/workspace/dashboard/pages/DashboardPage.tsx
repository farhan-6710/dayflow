import { format } from "date-fns";

import { ActivitySnapshotCard } from "@/features/workspace/dashboard/components/ActivitySnapshotCard";
import { DashboardHero } from "@/features/workspace/dashboard/components/DashboardHero";
import { DashboardTodoList } from "@/features/workspace/dashboard/components/DashboardTodoList";
import { TaskCompletionChart } from "@/features/workspace/dashboard/components/TaskCompletionChart";
import { TimeTracker } from "@/features/workspace/dashboard/components/TimeTracker";
import { WeeklyInsightsCard } from "@/features/workspace/dashboard/components/WeeklyInsightsCard";
import { useDashboard } from "@/features/workspace/dashboard/hooks/useDashboard";
import { getDashboardCards } from "@/features/workspace/dashboard/utils/getDashboardCards";
import { DEMO_ACCOUNT } from "@/shared/auth/constants/demoAccount";
import { DateFilters } from "@/shared/components/DateFilters";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { StatsCards } from "@/shared/components/StatsCards";
import { useUserDisplay } from "@/shared/hooks/useUserDisplay";
import { getGreeting } from "@/shared/utils/greeting";

export function DashboardPage() {
  const page = useDashboard();
  const { displayName } = useUserDisplay();
  const name = page.userEmail === DEMO_ACCOUNT.email ? "Demo User" : displayName;

  return (
    <>
      <DashboardHero
        greeting={getGreeting()}
        name={name}
        today={format(new Date(), "EEEE, MMMM d")}
        filters={<DateFilters {...page.dateFilterProps} />}
      />
      <div className="grid min-w-0 grid-cols-1 gap-4">
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <StatsCards
          isLoading={page.loading}
          cards={getDashboardCards({
            stats: page.stats,
            projectsCount: page.projectsCount,
            activeProjectsCount: page.activeProjectsCount,
            sparklines: page.sparklines,
            periodLabel: page.periodLabel,
          })}
        />
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <TaskCompletionChart
            isLoading={page.loading}
            chart={page.chart}
            primary={page.primaryMonth}
            compare={page.compareMonth}
            onPrimaryChange={page.setPrimaryMonth}
            onCompareChange={page.setCompareMonth}
          />
          <DashboardTodoList />
        </div>
        <div className="grid min-w-0 grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          <WeeklyInsightsCard isLoading={page.loading} {...page.insights} />
          <ActivitySnapshotCard counts={page.activityCounts} error={page.activityError} />
          <TimeTracker />
        </div>
      </div>
    </>
  );
}
