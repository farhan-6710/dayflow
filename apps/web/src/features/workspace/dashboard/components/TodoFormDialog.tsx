import { useMemo, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import type { TodoFormDialogProps } from "@/features/workspace/dashboard/types/components";
import type { TodoStatus } from "@/services/todosService";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import {
  formFieldGroupClassName,
  formLabelClassName,
  formTextareaClassName,
} from "@/shared/constants/formStyles";
import { useOpenSnapshot } from "@/shared/unsaved-changes/useOpenSnapshot";
import { useUnsavedDialogClose } from "@/shared/unsaved-changes/useUnsavedDialogClose";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export function TodoFormDialog({
  open,
  onOpenChange,
  isEditing,
  submitting,
  title,
  description,
  status,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  onSubmit,
}: TodoFormDialogProps) {
  const snapshot = useOpenSnapshot(open, { title, description, status });
  const isDirty = useMemo(() => {
    if (!snapshot) return false;
    return (
      title !== snapshot.title ||
      description !== snapshot.description ||
      status !== snapshot.status
    );
  }, [description, snapshot, status, title]);

  const { handleOpenChange } = useUnsavedDialogClose({
    id: "todo-form-dialog",
    open,
    isDirty,
    isCreate: !isEditing,
    onOpenChange,
    onSave: async () => {
      if (!title.trim()) throw new Error("Todo title is required");
      await Promise.resolve(onSubmit({ preventDefault() {} } as FormEvent));
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Todo" : "Add Todo"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the todo details or change its status."
              : "Capture a simple checklist item. No due date needed."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className={formFieldGroupClassName}>
            <label className={formLabelClassName}>Title</label>
            <Input
              placeholder="What needs doing?"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className={formFieldGroupClassName}>
            <label className={formLabelClassName}>Description (Optional)</label>
            <textarea
              placeholder="Add a short note..."
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              disabled={submitting}
              rows={3}
              className={formTextareaClassName}
            />
          </div>

          {isEditing ? (
            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Status</label>
              <OptionDropdown
                value={status}
                onChange={(value) => onStatusChange(value as TodoStatus)}
                options={STATUS_OPTIONS}
                disabled={submitting}
              />
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !title.trim()}>
              {submitting ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : null}
              {isEditing ? "Save" : "Add Todo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
