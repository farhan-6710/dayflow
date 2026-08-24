import { Calendar, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { TaskDateTimePicker } from "@/features/tasks/components/TaskDateTimePicker";
import { TaskListItem } from "@/features/tasks/components/TaskListItem";
import { TASK_STATUS_OPTIONS } from "@/features/tasks/constants/taskStatus";
import { tasksDirectoryConfig } from "@/features/tasks/constants/tasksDirectory";
import { useTasksManagement } from "@/features/tasks/hooks/useTasksManagement";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import {
  compactDropdownClassName,
  containMinWidthClassName,
} from "@/shared/constants/layoutStyles";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { PageHeader } from "@/shared/components/PageHeader";
import { PageContent } from "@/shared/components/PageContent";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { MultiSelect } from "@/shared/ui/MultiSelect";
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
        <DirectoryTable
          title="All Tasks"
          description={
            loading
              ? "Loading…"
              : `${tasks.length} task${tasks.length === 1 ? "" : "s"}`
          }
          gridClass={tasksDirectoryConfig.gridClass}
          columns={[...tasksDirectoryConfig.columns]}
          isLoading={loading}
          isEmpty={!loading && tasks.length === 0}
          emptyMessage="No tasks found. Try clearing filters or add a new task."
          headerAside={
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
              <MultiSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={TASK_STATUS_OPTIONS}
                placeholder="All Statuses"
                className="min-w-36 shrink-0"
              />
            </div>
          }
        >
          {tasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onEdit={() => handleOpenEditDialog(task)}
              onDelete={() => confirmDelete(task.id)}
            />
          ))}
        </DirectoryTable>
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
