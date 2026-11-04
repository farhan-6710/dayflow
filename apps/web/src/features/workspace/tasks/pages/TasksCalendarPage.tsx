import { TaskDetailsSheet } from "@/features/workspace/tasks/components/TaskDetailsSheet";
import { TaskFormDialog } from "@/features/workspace/tasks/components/TaskFormDialog";
import { TasksCalendarToolbar } from "@/features/workspace/tasks/components/TasksCalendarToolbar";
import { TasksDayPanel } from "@/features/workspace/tasks/components/TasksDayPanel";
import { TasksDayView } from "@/features/workspace/tasks/components/TasksDayView";
import { TasksMonthView } from "@/features/workspace/tasks/components/TasksMonthView";
import { TasksWeekView } from "@/features/workspace/tasks/components/TasksWeekView";
import { useTasksCalendar } from "@/features/workspace/tasks/hooks/useTasksCalendar";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { Phantom } from "@/shared/components/Phantom";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { TASK_STATUS_DOT_CLASS, TASK_STATUS_LABELS } from "@/shared/constants/taskStatus";
import { cn } from "@/shared/lib/utils";
import type { TaskStatus } from "@/shared/types/types";

const STATUSES = Object.keys(TASK_STATUS_LABELS) as TaskStatus[];

export function TasksCalendarPage() {
  const page = useTasksCalendar();
  const views = {
    month: (
      <TasksMonthView month={page.cursorDate} selectedDate={page.selectedDate} tasksByDate={page.tasksByDate} onSelectDate={page.selectDate} />
    ),
    week: (
      <TasksWeekView
        cursor={page.cursorDate}
        selectedDate={page.selectedDate}
        tasksByDate={page.tasksByDate}
        onSelectDate={page.selectDate}
        onAddAt={page.openCreateAt}
        onOpenTask={page.openDetails}
      />
    ),
    day: <TasksDayView date={page.selectedDate} tasks={page.selectedTasks} onAddAt={page.openCreateAt} onOpenTask={page.openDetails} />,
  };
  const calendar = (
    <Reveal
      as="section"
      className={cn(panelClassName, "flex h-[min(40rem,82dvh)] min-w-0 flex-col overflow-hidden p-3 sm:p-5 xl:h-full xl:min-h-0")}
    >
      <TasksCalendarToolbar
        title={page.title}
        view={page.view}
        onViewChange={page.setView}
        onPrevious={page.goPrevious}
        onNext={page.goNext}
        onToday={page.goToday}
      />
      {views[page.view]}
      <ul className="mt-2 flex shrink-0 flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={cn("size-2 rounded-full", TASK_STATUS_DOT_CLASS[status])} />
            {TASK_STATUS_LABELS[status]}
          </li>
        ))}
      </ul>
    </Reveal>
  );

  return (
    <>
      <PageHeader heading="Tasks Calendar" description="View and manage your tasks by month, week or day." />
      {page.error ? (
        <div className="mb-4">
          <ErrorBanner message={page.error} onRetry={page.reload} />
        </div>
      ) : null}
      <div className="grid min-w-0 grid-cols-1 gap-4 xl:h-[calc(100dvh-15rem)] xl:min-h-[36rem] xl:grid-cols-[minmax(0,1.75fr)_minmax(20rem,1fr)]">
        {page.loading ? <Phantom className="min-h-0">{calendar}</Phantom> : calendar}
        <TasksDayPanel
          date={page.selectedDate}
          tasks={page.selectedTasks}
          isLoading={page.loading}
          onAdd={page.openCreate}
          onOpen={page.openDetails}
          onEdit={page.openEdit}
          onDelete={page.setTaskToDelete}
          onReorder={(ids) => void page.reorderDay(ids)}
        />
      </div>
      <TaskDetailsSheet
        task={page.detailTask}
        onClose={page.closeDetails}
        onEdit={(task) => {
          page.closeDetails();
          page.openEdit(task);
        }}
        onDelete={(task) => {
          page.closeDetails();
          page.setTaskToDelete(task);
        }}
      />
      <TaskFormDialog
        open={page.dialogOpen}
        onOpenChange={page.setDialogOpen}
        task={page.editingTask}
        defaultDate={page.createAt?.date ?? page.selectedKey}
        defaultTime={page.createAt?.time}
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
