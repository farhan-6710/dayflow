import { AnimatePresence } from "framer-motion";

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
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { FluidWaveItem } from "@/shared/components/FluidWaveItem";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { useDateFilters } from "@/shared/hooks/useDateFilters";
import { cn } from "@/shared/lib/utils";
import { getWorkspaceDisplayName } from "@/shared/utils/authUserDisplay";

/**
 * Wave indices match the four stat-card delays (top-left → bottom-right):
 * 0 = 1st card · 1 = 2nd card · 2 = 3rd card · 3 = 4th card
 */
export function DashboardPage() {
  const { filter, dateFilterProps, periodLabel } = useDateFilters();
  const dashboard = useDashboard(filter);
  const todos = useDashboardTodos();

  const pageReady = !dashboard.loading && !todos.loading;

  const isDemoAccount = isDemoAccountEmail(dashboard.user?.email);
  const greetingName = getWorkspaceDisplayName(
    dashboard.user,
    dashboard.profile?.display_name,
  );
  const heading = isDemoAccount
    ? "Welcome to the DayFlow Demo"
    : `Welcome, ${greetingName}!`;

  const cards = getDashboardCards(dashboard.stats, periodLabel);

  return (
    <div className="relative space-y-4">
      <PageHeader
        heading={heading}
        description="Here is your personal workspace summary for today."
        actions={<DateFilters {...dateFilterProps} />}
      />

      {!pageReady ? (
        <DashboardPageSkeleton />
      ) : (
        <AnimatePresence mode="wait">
          <div key={periodLabel} className="w-full min-w-0 space-y-4">
            {dashboard.error ? <ErrorBanner message={dashboard.error} /> : null}

            <StatsCards cards={cards} />

            <div
              className={cn(
                "grid grid-cols-1 gap-4 lg:grid-cols-3",
                containMinWidthClassName,
              )}
            >
              <div
                className={cn("space-y-4 lg:col-span-2", containMinWidthClassName)}
              >
                <FluidWaveItem index={1}>
                  <TaskCompletionChart
                    tasks={dashboard.tasks}
                    isLoading={false}
                  />
                </FluidWaveItem>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <div className={cn("space-y-4", containMinWidthClassName)}>
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
        </AnimatePresence>
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
