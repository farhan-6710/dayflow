import { useState } from "react";

import { DashboardChartsSection } from "@/features/workspace/dashboard/components/DashboardChartsSection";
import { DashboardFocusList } from "@/features/workspace/dashboard/components/DashboardFocusList";
import { DashboardTasksDialogs } from "@/features/workspace/dashboard/components/DashboardTasksDialogs";
import { TimeTracker } from "@/features/workspace/dashboard/components/TimeTracker";
import { useDashboard } from "@/features/workspace/dashboard/hooks/useDashboard";
import { getDashboardCards } from "@/features/workspace/dashboard/utils/getDashboardCards";
import { isDemoAccountEmail } from "@/features/workspace/auth/constants/demoAccount";
import { DateFilters } from "@/shared/components/DateFilters";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { containMinWidthClassName } from "@/shared/constants/layoutStyles";
import { useDateFilters } from "@/shared/hooks/useDateFilters";
import { cn } from "@/shared/lib/utils";
import { getWorkspaceDisplayName } from "@/shared/utils/authUserDisplay";

export function DashboardPage() {
  const { filter, dateFilterProps, periodLabel } = useDateFilters();
  const dashboard = useDashboard(filter);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setTaskToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await dashboard.handleDeleteTask(taskToDelete);
    }
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const isDemoAccount = isDemoAccountEmail(dashboard.user?.email);
  const greetingName = getWorkspaceDisplayName(dashboard.user, dashboard.profile?.display_name);
  const heading = isDemoAccount
    ? "Welcome to the DayFlow Demo"
    : `Welcome, ${greetingName}!`;

  const cards = getDashboardCards(dashboard.stats, periodLabel);

  return (
    <div className="relative isolate space-y-6">
      <PageHeader
        heading={heading}
        description="Here is your personal workspace summary for today."
        actions={<DateFilters {...dateFilterProps} />}
      />

      <PageContent>
        {dashboard.error ? <ErrorBanner message={dashboard.error} /> : null}

        <StatsCards cards={cards} isLoading={dashboard.loading} />

        <div className={cn("grid grid-cols-1 gap-6 lg:grid-cols-3", containMinWidthClassName)}>
          <DashboardChartsSection
            tasks={dashboard.tasks}
            isLoading={dashboard.loading}
          />

          <div className={cn("space-y-6", containMinWidthClassName)}>
            <DashboardFocusList
              urgentTasks={dashboard.urgentTasks}
              loading={dashboard.loading}
              onEdit={dashboard.handleOpenEditDialog}
              onDelete={confirmDelete}
            />
            <TimeTracker />
          </div>
        </div>
      </PageContent>

      <DashboardTasksDialogs
        dialogOpen={dashboard.dialogOpen}
        setDialogOpen={dashboard.setDialogOpen}
        editingTask={dashboard.editingTask}
        submitting={dashboard.submitting}
        taskTitle={dashboard.taskTitle}
        taskDesc={dashboard.taskDesc}
        taskPriority={dashboard.taskPriority}
        taskStatus={dashboard.taskStatus}
        taskDueDate={dashboard.taskDueDate}
        taskDueTime={dashboard.taskDueTime}
        onTitleChange={dashboard.setTaskTitle}
        onDescriptionChange={dashboard.setTaskDesc}
        onPriorityChange={dashboard.setTaskPriority}
        onStatusChange={dashboard.setTaskStatus}
        onDueDateChange={dashboard.handleDueDateChange}
        onDueTimeChange={dashboard.setTaskDueTime}
        onClearDueDateTime={dashboard.handleClearDueDateTime}
        onSubmit={dashboard.handleSubmit}
        onDeleteTask={dashboard.handleDeleteTask}
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
