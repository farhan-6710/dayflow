import { useMemo } from "react";
import { Plus } from "lucide-react";

import { useTasksCalendarSelection } from "@/features/tasks/hooks/useTasksCalendarSelection";
import { useTasksManagement } from "@/features/tasks/hooks/useTasksManagement";
import { TasksWeeksTable } from "@/features/tasks/components/TasksWeeksTable";
import { TaskDateTimePicker } from "@/features/tasks/components/TaskDateTimePicker";
import {
  TASK_STATUS_DOT_COLORS,
  TASK_STATUS_LEGEND,
  TASK_STATUS_OPTIONS,
  TASK_STATUS_TEXT_COLORS,
} from "@/features/tasks/constants/taskStatus";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/ui/button";
import { MonthSelector } from "@/shared/ui/MonthSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { cn } from "@/shared/lib/utils";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TasksCalendarPage() {
  const { selectedDate, calendarWeeks, year, month, selectDate } =
    useTasksCalendarSelection();

  const {
    tasks,
    loading,
    dialogOpen,
    setDialogOpen,
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
    handleDueDateChange,
    handleClearDueDateTime,
    submitting,
    editingTask,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleSubmit,
  } = useTasksManagement();

  // Build a map: "yyyy-MM-dd" → Task[]
  const tasksByDateKey = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    for (const task of tasks) {
      if (!task.due_date) continue;
      const existing = map.get(task.due_date) ?? [];
      map.set(task.due_date, [...existing, task]);
    }
    return map;
  }, [tasks]);

  const openEditFromCell = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      handleOpenEditDialog(task);
    }
  };

  const openDayWithCreate = (y: number, m: number, d: number) => {
    const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    selectDate(new Date(y, m - 1, d));
    handleOpenCreateDialog(iso);
  };

  return (
    <PageContent>
      <PageHeader
        heading="Tasks Calendar"
        description="Browse and manage tasks by day. Open any date to add a task or edit an existing one."
        actions={
          <Button
            className="gap-2 rounded-full px-5 shadow-sm"
            onClick={() => handleOpenCreateDialog()}
          >
            <Plus className="size-4" />
            Add Task
          </Button>
        }
      />

      <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        {/* Status legend */}
        <div className="flex flex-wrap items-center gap-3">
          {TASK_STATUS_LEGEND.map(({ status, label }) => (
            <div key={status} className="flex items-center gap-1.5">
              <span
                className={cn("size-2.5 shrink-0 rounded-full", TASK_STATUS_DOT_COLORS[status])}
              />
              <span className="text-[11px] font-medium">{label}</span>
            </div>
          ))}
        </div>

        <MonthSelector
          year={year}
          month={month}
          onSelect={selectDate}
          className="w-full sm:w-auto"
        />
      </div>

      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-card">
          <LoadingSpinner />
        </div>
      ) : (
        <TasksWeeksTable
          year={year}
          month={month}
          weeks={calendarWeeks}
          selectedDate={selectedDate}
          tasksByDateKey={tasksByDateKey}
          onOpenDay={openDayWithCreate}
          onEdit={openEditFromCell}
          statusColors={TASK_STATUS_DOT_COLORS}
          statusText={TASK_STATUS_TEXT_COLORS}
        />
      )}

      {/* Add / Edit Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex max-h-[85vh] max-w-lg! flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Update the task details below."
                : "Fill in the details to create a new task."}
            </DialogDescription>
          </DialogHeader>

          <form
            id="task-calendar-form"
            onSubmit={(e) => void handleSubmit(e)}
            className="flex flex-col gap-4 overflow-y-auto py-1 pr-1"
          >
            <label className="block text-xs font-semibold text-muted-foreground">
              Title *
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Write blog post"
                disabled={submitting}
                required
                className="mt-1.5"
              />
            </label>

            <label className="block text-xs font-semibold text-muted-foreground">
              Description
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Optional details…"
                disabled={submitting}
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Priority
                </span>
                <OptionDropdown
                  value={taskPriority}
                  options={PRIORITY_OPTIONS}
                  placeholder="Priority"
                  onChange={(v) => setTaskPriority(v as typeof taskPriority)}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Status
                </span>
                <OptionDropdown
                  value={taskStatus}
                  options={TASK_STATUS_OPTIONS}
                  placeholder="Status"
                  onChange={(v) => setTaskStatus(v as typeof taskStatus)}
                  disabled={submitting}
                />
              </div>
            </div>

            <TaskDateTimePicker
              dateValue={taskDueDate}
              timeValue={taskDueTime}
              onDateChange={handleDueDateChange}
              onTimeChange={setTaskDueTime}
              onClear={handleClearDueDateTime}
              disabled={submitting}
            />
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="task-calendar-form"
              disabled={submitting || !taskTitle.trim()}
            >
              {submitting
                ? "Saving…"
                : editingTask
                  ? "Save Changes"
                  : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContent>
  );
}

export default TasksCalendarPage;
