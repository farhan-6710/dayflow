import type { Task } from "@/services/tasksService";
import { TaskFormDialog } from "@/features/workspace/tasks/components/TaskFormDialog";
import { ConfirmationModal } from "@/shared/ConfirmationModal";

type DashboardTasksDialogsProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingTask: Task | null;
  submitting: boolean;
  taskTitle: string;
  taskDesc: string;
  taskPriority: Task["priority"];
  taskStatus: Task["status"];
  taskDueDate: string;
  taskDueTime: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: Task["priority"]) => void;
  onStatusChange: (value: Task["status"]) => void;
  onDueDateChange: (value: string) => void;
  onDueTimeChange: (value: string) => void;
  onClearDueDateTime: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteTask: (id: string) => Promise<void> | void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
  onConfirmDelete: () => void;
};

export function DashboardTasksDialogs({
  dialogOpen,
  setDialogOpen,
  editingTask,
  submitting,
  taskTitle,
  taskDesc,
  taskPriority,
  taskStatus,
  taskDueDate,
  taskDueTime,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  onDueDateChange,
  onDueTimeChange,
  onClearDueDateTime,
  onSubmit,
  onDeleteTask,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  onConfirmDelete,
}: DashboardTasksDialogsProps) {
  return (
    <>
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
        onTitleChange={onTitleChange}
        onDescriptionChange={onDescriptionChange}
        onPriorityChange={onPriorityChange}
        onStatusChange={onStatusChange}
        onDueDateChange={onDueDateChange}
        onDueTimeChange={onDueTimeChange}
        onClearDueDateTime={onClearDueDateTime}
        onSubmit={(event) => void onSubmit(event)}
        onDelete={
          editingTask
            ? async () => {
                await onDeleteTask(editingTask.id);
                setDialogOpen(false);
              }
            : undefined
        }
      />

      <ConfirmationModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Task?"
        description="This action is irreversible. The task will be deleted permanently."
        confirmLabel="Delete permanently"
        confirmVariant="destructive"
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
