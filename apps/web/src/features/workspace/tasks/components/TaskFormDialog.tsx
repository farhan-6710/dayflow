import { TASK_STATUS_OPTIONS } from "@/features/workspace/tasks/constants/taskStatus";
import { TaskDateTimePicker } from "@/features/workspace/tasks/components/TaskDateTimePicker";
import type { TaskFormDialogProps } from "@/features/workspace/tasks/types/components";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskFormDialog({
  open,
  onOpenChange,
  isEditing,
  submitting,
  title,
  description,
  priority,
  status,
  dueDate,
  dueTime,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  onDueDateChange,
  onDueTimeChange,
  onClearDueDateTime,
  onSubmit,
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
          <DialogDescription>
            Personal tasks are standalone — no project required. Change status
            from here when you need to.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className={formFieldGroupClassName}>
            <label className={formLabelClassName}>Task Title</label>
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className={formFieldGroupClassName}>
            <label className={formLabelClassName}>Description (Optional)</label>
            <Input
              placeholder="Add more details..."
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Priority</label>
              <OptionDropdown
                value={priority}
                onChange={(value) => onPriorityChange(value as typeof priority)}
                options={PRIORITY_OPTIONS}
                disabled={submitting}
              />
            </div>

            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Status</label>
              <OptionDropdown
                value={status}
                onChange={(value) => onStatusChange(value as typeof status)}
                options={TASK_STATUS_OPTIONS}
                disabled={submitting}
              />
            </div>
          </div>

          <TaskDateTimePicker
            label="Due Date (Optional)"
            dateValue={dueDate}
            timeValue={dueTime}
            onDateChange={onDueDateChange}
            onTimeChange={onDueTimeChange}
            onClear={onClearDueDateTime}
            disabled={submitting}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !title.trim()}>
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
