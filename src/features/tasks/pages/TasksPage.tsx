import { Calendar, Plus, Search, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { TaskDateTimePicker } from "@/features/tasks/components/TaskDateTimePicker";
import { TaskListItem } from "@/features/tasks/components/TaskListItem";
import { TASK_STATUS_OPTIONS } from "@/features/tasks/constants/taskStatus";
import { useTasksManagement } from "@/features/tasks/hooks/useTasksManagement";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import {
  compactDropdownClassName,
  containMinWidthClassName,
} from "@/shared/constants/layoutStyles";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageContent } from "@/shared/components/PageContent";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ConfirmationModal } from "@/shared/ConfirmationModal";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const FILTER_PRIORITY_OPTIONS = [
  { value: "", label: "All Priorities" },
  ...PRIORITY_OPTIONS,
];

const FILTER_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...TASK_STATUS_OPTIONS,
];

export function TasksPage() {
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
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleSubmit,
    handleDeleteTask,
  } = useTasksManagement();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setTaskToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await handleDeleteTask(taskToDelete);
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Tasks"
        description="Standalone personal tasks — workouts, errands, goals, and anything else."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/tasks-calendar">
                <Calendar className="mr-1 size-4" />
                Calendar View
              </Link>
            </Button>
            <Button
              className="gap-2 rounded-full px-5 shadow-sm"
              onClick={() => handleOpenCreateDialog()}
            >
              <Plus className="size-4" />
              Add Task
            </Button>
          </div>
        }
      />

      <PageContent>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground">All Tasks</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {loading
                  ? "Loading…"
                  : `${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
              <div className={cn("relative", containMinWidthClassName, "sm:w-56")}>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tasks…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 pl-9 text-sm"
                />
              </div>

              <OptionDropdown
                value={filterPriority}
                onChange={setFilterPriority}
                options={FILTER_PRIORITY_OPTIONS}
                placeholder="All Priorities"
                className={cn(compactDropdownClassName, "sm:w-36")}
              />
              <OptionDropdown
                value={filterStatus}
                onChange={setFilterStatus}
                options={FILTER_STATUS_OPTIONS}
                placeholder="All Statuses"
                className={cn(compactDropdownClassName, "sm:w-36")}
              />
            </div>
          </div>

          {loading ? (
            <div className="px-5 py-14 text-center text-sm text-muted-foreground">
              Loading tasks…
            </div>
          ) : tasks.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <ClipboardList className="mx-auto size-10 text-muted-foreground/50" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                No tasks found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try clearing filters or add a new task.
              </p>
              <Button
                className="mt-4 gap-2 rounded-full"
                onClick={() => handleOpenCreateDialog()}
              >
                <Plus className="size-4" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  onEdit={() => handleOpenEditDialog(task)}
                  onDelete={() => confirmDelete(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      </PageContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create Task"}</DialogTitle>
            <DialogDescription>
              Personal tasks are standalone — no project required. Change status
              from here when you need to.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Task Title</label>
              <Input
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Description (Optional)</label>
              <Input
                placeholder="Add more details..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className={formFieldGroupClassName}>
                <label className={formLabelClassName}>Priority</label>
                <OptionDropdown
                  value={taskPriority}
                  onChange={(value) => setTaskPriority(value as typeof taskPriority)}
                  options={PRIORITY_OPTIONS}
                  disabled={submitting}
                />
              </div>

              <div className={formFieldGroupClassName}>
                <label className={formLabelClassName}>Status</label>
                <OptionDropdown
                  value={taskStatus}
                  onChange={(value) => setTaskStatus(value as typeof taskStatus)}
                  options={TASK_STATUS_OPTIONS}
                  disabled={submitting}
                />
              </div>
            </div>

            <TaskDateTimePicker
              label="Due Date (Optional)"
              dateValue={taskDueDate}
              timeValue={taskDueTime}
              onDateChange={handleDueDateChange}
              onTimeChange={setTaskDueTime}
              onClear={handleClearDueDateTime}
              disabled={submitting}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !taskTitle.trim()}>
                {editingTask ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
