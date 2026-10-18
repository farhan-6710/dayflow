import { DashboardChartsSection } from "@/features/workspace/dashboard/components/DashboardChartsSection";
import { DashboardTodoList } from "@/features/workspace/dashboard/components/DashboardTodoList";
import { TodoFormDialog } from "@/features/workspace/dashboard/components/TodoFormDialog";
import { TimeTracker } from "@/features/workspace/dashboard/components/TimeTracker";
import { useDashboard } from "@/features/workspace/dashboard/hooks/useDashboard";
import { useDashboardTodos } from "@/features/workspace/dashboard/hooks/useDashboardTodos";
import { getDashboardCards } from "@/features/workspace/dashboard/utils/getDashboardCards";
import { isDemoAccountEmail } from "@/features/workspace/auth/constants/demoAccount";
import { DateFilters } from "@/shared/components/DateFilters";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { useDateFilters } from "@/shared/hooks/useDateFilters";
import { cn } from "@/shared/lib/utils";
import { getWorkspaceDisplayName } from "@/shared/utils/authUserDisplay";

export function DashboardPage() {
  const { filter, dateFilterProps, periodLabel } = useDateFilters();
  const dashboard = useDashboard(filter);
  const todos = useDashboardTodos();

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

      <PageContent motionKey={periodLabel}>
        {dashboard.error ? <ErrorBanner message={dashboard.error} /> : null}

        <StatsCards cards={cards} isLoading={dashboard.loading} />

        <div
          className={cn(
            "grid grid-cols-1 gap-4 lg:grid-cols-3",
            containMinWidthClassName,
          )}
        >
          <DashboardChartsSection
            tasks={dashboard.tasks}
            isLoading={dashboard.loading}
          />

          <div className={cn("space-y-4", containMinWidthClassName)}>
            <DashboardTodoList
              pendingTodos={todos.pendingTodos}
              completedTodos={todos.completedTodos}
              loading={todos.loading}
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
            <TimeTracker />
          </div>
        </div>
      </PageContent>

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
