import { useMemo, useState } from "react";
import { format } from "date-fns";

import { TasksDayPanel } from "@/features/workspace/tasks/components/TasksDayPanel";
import { TaskFormDialog } from "@/features/workspace/tasks/components/TaskFormDialog";
import { TasksWeeksTable } from "@/features/workspace/tasks/components/TasksWeeksTable";
import { useTasksCalendarSelection } from "@/features/workspace/tasks/hooks/useTasksCalendarSelection";
import { useTasksManagement } from "@/features/workspace/tasks/hooks/useTasksManagement";
import type { Task } from "@/services/tasksService";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { FluidReveal } from "@/shared/components/FluidReveal";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function TasksCalendarPage() {
  const { selectedDate, calendarWeeks, year, month, selectDate } =
    useTasksCalendarSelection();
  const tasks = useTasksManagement();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  const tasksByDateKey = useMemo(() => {
    const map = new Map<string, typeof tasks.tasks>();
    for (const task of tasks.tasks) {
      if (!task.due_date) continue;
      const existing = map.get(task.due_date) ?? [];
      map.set(task.due_date, [...existing, task]);
    }
    return map;
  }, [tasks.tasks]);

  const selectedKey = format(selectedDate, "yyyy-MM-dd");
  const selectedTasks = tasksByDateKey.get(selectedKey) ?? [];

  const selectDay = (nextYear: number, nextMonth: number, date: number) => {
    selectDate(new Date(nextYear, nextMonth - 1, date));
  };

  return (
    <PageContent>
      <PageHeader
        heading="Tasks Calendar"
        description="Pick a day to review its tasks. Add a new one from the side panel."
      />

      <FluidReveal
        motionKey={tasks.loading ? "loading" : "ready"}
        className={cn(
          tasks.loading
            ? cn(
                "flex min-h-[320px] items-center justify-center sm:min-h-[420px]",
                glassPanelClassName,
              )
            : "grid min-w-0 grid-cols-1 items-stretch gap-3 sm:gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(240px,3fr)]",
        )}
      >
        {tasks.loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TasksWeeksTable
              year={year}
              month={month}
              weeks={calendarWeeks}
              selectedDate={selectedDate}
              tasksByDateKey={tasksByDateKey}
              onSelectMonth={selectDate}
              onSelectDay={selectDay}
            />
            <TasksDayPanel
              date={selectedDate}
              tasks={selectedTasks}
              onAddTask={() => tasks.handleOpenCreateDialog(selectedKey)}
              onEditTask={tasks.handleOpenEditDialog}
              onDeleteTask={setTaskToDelete}
              onReorderTasks={tasks.handleReorderDayTasks}
            />
          </>
        )}
      </FluidReveal>

      <TaskFormDialog
        open={tasks.dialogOpen}
        onOpenChange={tasks.setDialogOpen}
        isEditing={Boolean(tasks.editingTask)}
        submitting={tasks.submitting}
        title={tasks.taskTitle}
        description={tasks.taskDesc}
        priority={tasks.taskPriority}
        status={tasks.taskStatus}
        dueDate={tasks.taskDueDate}
        dueTime={tasks.taskDueTime}
        onTitleChange={tasks.setTaskTitle}
        onDescriptionChange={tasks.setTaskDesc}
        onPriorityChange={tasks.setTaskPriority}
        onStatusChange={tasks.setTaskStatus}
        onDueDateChange={tasks.handleDueDateChange}
        onDueTimeChange={tasks.setTaskDueTime}
        onClearDueDateTime={tasks.handleClearDueDateTime}
        onSubmit={(event) => void tasks.handleSubmit(event)}
        onDelete={
          tasks.editingTask
            ? () => tasks.handleDeleteTask(tasks.editingTask!.id)
            : undefined
        }
      />

      <ConfirmationModal
        open={Boolean(taskToDelete)}
        onOpenChange={(open) => {
          if (!open) setTaskToDelete(null);
        }}
        title="Delete task?"
        description={
          taskToDelete
            ? `“${taskToDelete.title}” will be permanently removed.`
            : "This task will be permanently removed."
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        loading={deleting}
        onConfirm={async () => {
          if (!taskToDelete) return;
          setDeleting(true);
          try {
            await tasks.handleDeleteTask(taskToDelete.id);
            setTaskToDelete(null);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </PageContent>
  );
}

export default TasksCalendarPage;
