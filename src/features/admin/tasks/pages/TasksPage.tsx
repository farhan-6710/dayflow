import { Calendar, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { ADMIN_PORTAL_TASKS_CALENDAR_PATH } from "@/app/constants/adminPortalRoutes";
import { TaskFormDialog } from "@/features/admin/tasks/components/TaskFormDialog";
import { TaskListItem } from "@/features/admin/tasks/components/TaskListItem";
import { TASK_STATUS_OPTIONS } from "@/features/admin/tasks/constants/taskStatus";
import { tasksDirectoryConfig } from "@/features/admin/tasks/constants/tasksDirectory";
import { useTasksManagement } from "@/features/admin/tasks/hooks/useTasksManagement";
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
              <Link to={ADMIN_PORTAL_TASKS_CALENDAR_PATH}>
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
