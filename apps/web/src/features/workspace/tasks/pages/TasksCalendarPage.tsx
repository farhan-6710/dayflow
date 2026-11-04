import { Plus } from "lucide-react";

import { TaskFormDialog } from "@/features/workspace/tasks/components/TaskFormDialog";
import { TasksCalendarGrid } from "@/features/workspace/tasks/components/TasksCalendarGrid";
import { TasksDayPanel } from "@/features/workspace/tasks/components/TasksDayPanel";
import { TasksMonthBar } from "@/features/workspace/tasks/components/TasksMonthBar";
import { useTasksCalendar } from "@/features/workspace/tasks/hooks/useTasksCalendar";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function TasksCalendarPage() {
  const page = useTasksCalendar();

  return (
    <>
      <PageHeader
        heading="Tasks Calendar"
        description="Pick a day to see its tasks, and plan from there."
        actions={
          <Button size="lg" onClick={page.openCreate}>
            <Plus aria-hidden="true" />
            New task
          </Button>
        }
      />
      {page.error ? (
        <div className="mb-4">
          <ErrorBanner message={page.error} onRetry={page.reload} />
        </div>
      ) : null}
      {page.loading ? (
        <TableSkeleton rows={8} />
      ) : (
        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className={cn(panelClassName, "min-w-0 p-3 sm:p-5")}>
            <TasksMonthBar month={page.selectedDate} onSelectDate={page.selectDate} />
            <TasksCalendarGrid
              month={page.selectedDate}
              selectedDate={page.selectedDate}
              tasksByDate={page.tasksByDate}
              onSelectDate={page.selectDate}
            />
          </section>
          <TasksDayPanel
            date={page.selectedDate}
            tasks={page.selectedTasks}
            onAdd={page.openCreate}
            onEdit={page.openEdit}
            onDelete={page.setTaskToDelete}
            onReorder={(ids) => void page.reorderDay(ids)}
          />
        </div>
      )}
      <TaskFormDialog
        open={page.dialogOpen}
        onOpenChange={page.setDialogOpen}
        task={page.editingTask}
        defaultDate={page.selectedKey}
        onSave={page.saveTask}
      />
      <ConfirmationModal
        open={page.taskToDelete !== null}
        onOpenChange={(open) => !open && page.setTaskToDelete(null)}
        title={`Delete "${page.taskToDelete?.title ?? ""}"?`}
        description="The task will be permanently removed."
        confirmLabel="Delete task"
        confirmVariant="destructive"
        loading={page.deleting}
        onConfirm={page.confirmDelete}
      />
    </>
  );
}
