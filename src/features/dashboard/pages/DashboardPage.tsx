import { CheckCircle2, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { FocusListItem } from "@/features/dashboard/components/FocusListItem";
import { TaskCompletionChart } from "@/features/dashboard/components/TaskCompletionChart";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { TaskFormDialog } from "@/features/tasks/components/TaskFormDialog";
import { PageContent } from "@/shared/components/PageContent";
import { DateFilters } from "@/shared/components/DateFilters";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
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
    handleOpenEditDialog,
    handleDeleteTask,
    dialogOpen,
    setDialogOpen,
    editingTask,
    taskTitle,
    setTaskTitle,
    taskDesc,
    setTaskDesc,
    taskPriority,
    setTaskPriority,
    taskStatus,
    setTaskStatus,
    taskDueDate,
    taskDueTime,
    setTaskDueTime,
    submitting,
    handleDueDateChange,
    handleClearDueDateTime,
    handleSubmit,
  } = useDashboard(filter);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setTaskToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await handleDeleteTask(taskToDelete);
    }
    setDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const greetingName = profile?.display_name?.trim() || "there";
  const isDemoAccount = greetingName === "Demo User";
  const dashboardHeading = isDemoAccount
    ? "Welcome to the DayFlow Demo"
    : `Welcome, ${greetingName}!`;
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
      href: "/tasks-calendar",
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
      href: "/tasks-calendar",
      sparklineData: missedPostsSparklineData,
      sparklineColor: "var(--accent)",
    },
    {
      id: "projects",
      label: "Total Projects",
      value: stats.projectsCount,
      icon: CheckCircle2,
      description: isAll
        ? "Note folders in your workspace"
        : `Note folders created in ${periodDescription}`,
      href: "/projects-management",
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
      href: "/tasks-calendar",
      sparklineData: totalPostsSparklineData,
      sparklineColor: "var(--accent)",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        heading={dashboardHeading}
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
                <Link to="/tasks-calendar" className="text-xs font-semibold text-primary hover:underline">
                  View Tasks Calendar
                </Link>
              </div>

              <div className="mt-4 divide-y divide-border">
                {loading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading tasks...</div>
                ) : urgentTasks.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">All caught up! No tasks left.</p>
                    <Link to="/tasks-calendar" className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">
                      Create a Task
                    </Link>
                  </div>
                ) : (
                  urgentTasks.map((task) => (
                    <FocusListItem
                      key={task.id}
                      task={task}
                      onEdit={() => handleOpenEditDialog(task)}
                      onDelete={() => confirmDelete(task.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContent>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={Boolean(editingTask)}
        submitting={submitting}
        title={taskTitle}
        description={taskDesc}
        priority={taskPriority}
        status={taskStatus}
        dueDate={taskDueDate}
        dueTime={taskDueTime}
        onTitleChange={setTaskTitle}
        onDescriptionChange={setTaskDesc}
        onPriorityChange={setTaskPriority}
        onStatusChange={setTaskStatus}
        onDueDateChange={handleDueDateChange}
        onDueTimeChange={setTaskDueTime}
        onClearDueDateTime={handleClearDueDateTime}
        onSubmit={(event) => void handleSubmit(event)}
      />

      <ConfirmationModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Task?"
        description="This action is irreversible. The task will be deleted permanently."
        confirmLabel="Delete permanently"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
