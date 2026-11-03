import { DashboardPageSkeleton } from "@/features/workspace/dashboard/components/DashboardPageSkeleton";
import { DashboardPlaceholderCard } from "@/features/workspace/dashboard/components/DashboardPlaceholderCard";
import { DashboardTodoList } from "@/features/workspace/dashboard/components/DashboardTodoList";
import { TaskCompletionChart } from "@/features/workspace/dashboard/components/TaskCompletionChart";
import { TodoFormDialog } from "@/features/workspace/dashboard/components/TodoFormDialog";
import { TimeTracker } from "@/features/workspace/dashboard/components/TimeTracker";
import { useDashboard } from "@/features/workspace/dashboard/hooks/useDashboard";
import { useDashboardTodos } from "@/features/workspace/dashboard/hooks/useDashboardTodos";
import { getDashboardCards } from "@/features/workspace/dashboard/utils/getDashboardCards";
import { isDemoAccountEmail } from "@/features/workspace/auth/constants/demoAccount";
import { DateFilters } from "@/shared/components/DateFilters";
import { DayflowImage } from "@/shared/components/DayflowImage";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { FluidWaveItem } from "@/shared/components/FluidWaveItem";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { BRAND_NAME } from "@/shared/brand/brandManifest";
import { DAYFLOW_IMAGES } from "@/shared/constants/dayflowImages";
import {
  containMinWidthClassName,
  eyebrowTextClassName,
} from "@/shared/constants/layoutStyles";
import { useDateFilters } from "@/shared/hooks/useDateFilters";
import { cn } from "@/shared/lib/utils";
import { useTheme } from "@/shared/providers/ThemeProvider";
import { getWorkspaceDisplayName } from "@/shared/utils/authUserDisplay";

/**
 * Wave indices match the four stat-card delays (top-left → bottom-right):
 * 0 = 1st card · 1 = 2nd card · 2 = 3rd card · 3 = 4th card
 */
export function DashboardPage() {
  const { filter, dateFilterProps, periodLabel } = useDateFilters();
  const dashboard = useDashboard(filter);
  const todos = useDashboardTodos();
  const { isDarkMode } = useTheme();

  const pageReady = !dashboard.loading && !todos.loading;
  const cornerSrc = isDarkMode
    ? DAYFLOW_IMAGES.dashboardCornerDark
    : DAYFLOW_IMAGES.dashboardCornerLight;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const isDemoAccount = isDemoAccountEmail(dashboard.user?.email);
  const greetingName = getWorkspaceDisplayName(
    dashboard.user,
    dashboard.profile?.display_name,
  );
  const heading = isDemoAccount ? (
    <>
      Welcome to the{" "}
      <span className={eyebrowTextClassName}>{`${BRAND_NAME} Demo`}</span>
    </>
  ) : (
    <>
      Welcome, <span className={eyebrowTextClassName}>{greetingName}</span>
      <span aria-hidden className="ml-1.5 inline-block text-[0.8em]">
        👋
      </span>
    </>
  );

  const cards = getDashboardCards(dashboard.stats, periodLabel);

  return (
    <div className="relative isolate lg:-mx-4 min-[90rem]:-mx-7">
      <DayflowImage
        src={cornerSrc}
        alt=""
        className="animate-enter pointer-events-none absolute -right-4 -bottom-8 -z-10 hidden w-52 select-none sm:-right-6 md:block lg:-bottom-10"
        fallback={null}
      />

      <PageHeader
        eyebrow={`${today} · ${periodLabel === "All" ? "All time" : periodLabel}`}
        heading={heading}
        description="Here is your personal workspace summary for today."
        actions={<DateFilters {...dateFilterProps} />}
      />

      {!pageReady ? (
        <DashboardPageSkeleton />
      ) : (
        <div key={periodLabel} className="w-full min-w-0 space-y-6">
            {dashboard.error ? <ErrorBanner message={dashboard.error} /> : null}

            <StatsCards cards={cards} />

            <div
              className={cn(
                "grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_23.8rem]",
                containMinWidthClassName,
              )}
            >
              <div
                className={cn(
                  "space-y-5",
                  containMinWidthClassName,
                )}
              >
                <FluidWaveItem index={1}>
                  <TaskCompletionChart
                    tasks={dashboard.tasks}
                    isLoading={false}
                  />
                </FluidWaveItem>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FluidWaveItem index={2}>
                    <DashboardPlaceholderCard
                      title="Weekly insights"
                      description="Placeholder for upcoming productivity insights."
                    />
                  </FluidWaveItem>
                  <FluidWaveItem index={3}>
                    <DashboardPlaceholderCard
                      title="Activity snapshot"
                      description="Placeholder for upcoming activity breakdown."
                    />
                  </FluidWaveItem>
                </div>
              </div>

              <div className={cn("space-y-4.5", containMinWidthClassName)}>
                <FluidWaveItem index={2}>
                  <DashboardTodoList
                    pendingTodos={todos.pendingTodos}
                    completedTodos={todos.completedTodos}
                    loading={false}
                    busyTodoId={todos.busyTodoId}
                    exitingTodoId={todos.exitingTodoId}
                    completedOpen={todos.completedOpen}
                    onCompletedOpenChange={todos.setCompletedOpen}
                    onAdd={todos.handleOpenAdd}
                    onToggle={todos.handleToggle}
                    onEdit={todos.handleOpenEdit}
                    onDelete={todos.handleAskDelete}
                    onReorderPending={todos.handleReorderPending}
                    onExitComplete={todos.handleExitComplete}
                  />
                </FluidWaveItem>

                <FluidWaveItem index={3}>
                  <TimeTracker />
                </FluidWaveItem>
              </div>
            </div>
        </div>
      )}

      <TodoFormDialog
        open={todos.dialogOpen}
        onOpenChange={todos.handleDialogOpenChange}
        isEditing={Boolean(todos.editingTodo)}
        submitting={todos.submitting}
        title={todos.title}
        description={todos.description}
        status={todos.status}
        onTitleChange={todos.setTitle}
        onDescriptionChange={todos.setDescription}
        onStatusChange={todos.setStatus}
        onSubmit={todos.handleSubmit}
      />

      <ConfirmationModal
        open={todos.deleteOpen}
        onOpenChange={todos.setDeleteOpen}
        title="Delete todo?"
        description={
          todos.todoToDelete
            ? `“${todos.todoToDelete.title}” will be permanently removed.`
            : "This todo will be permanently removed."
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={todos.deleting}
        onConfirm={todos.handleConfirmDelete}
      />
    </div>
  );
}
