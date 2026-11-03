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
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { DateFilters } from "@/shared/components/DateFilters";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { StatsCards } from "@/shared/components/StatsCards";
import { useUserDisplay } from "@/shared/hooks/useUserDisplay";

export function DashboardPage() {
  const page = useDashboard();
  const { displayName } = useUserDisplay();
  const heading =
    page.userEmail === DEMO_ACCOUNT.email ? `Welcome to the ${BRAND_NAME} demo` : `Welcome, ${displayName}`;

  return (
    <>
      <DashboardHero heading={heading} today={format(new Date(), "EEEE, MMMM d")} />
      <div className="grid min-w-0 gap-4">
        <DateFilters {...page.dateFilterProps} />
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <StatsCards
          isLoading={page.loading}
          cards={getDashboardCards({
            stats: page.stats,
            projectsCount: page.projectsCount,
            sparklines: page.sparklines,
            periodLabel: page.periodLabel,
          })}
        />
        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid min-w-0 gap-4">
            <TaskCompletionChart
              chart={page.chart}
              primary={page.primaryMonth}
              compare={page.compareMonth}
              onPrimaryChange={page.setPrimaryMonth}
              onCompareChange={page.setCompareMonth}
            />
            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              <WeeklyInsightsCard {...page.insights} />
              <ActivitySnapshotCard counts={page.activityCounts} error={page.activityError} />
            </div>
          </div>
          <div className="grid min-w-0 gap-4">
            <DashboardTodoList />
            <TimeTracker />
          </div>
        </div>
      </div>
    </>
  );
}
