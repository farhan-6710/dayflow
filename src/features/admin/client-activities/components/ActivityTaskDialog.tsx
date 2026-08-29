import { useEffect, useState } from "react";

import { ActivityPrioritySelect } from "@/features/admin/client-activities/components/ActivityPrioritySelect";
import { ActivityProjectSelect } from "@/features/admin/client-activities/components/ActivityProjectSelect";
import { ActivityStatusSelect } from "@/features/admin/client-activities/components/ActivityStatusSelect";
import type { ClientActivityTaskFormValues } from "@/features/admin/client-activities/utils/activityFormUtils";
import { TaskDateTimePicker } from "@/features/admin/tasks/components/TaskDateTimePicker";
import type { Project } from "@/services/projectsService";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { formFieldClassName } from "@/shared/constants/formStyles";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils";

type ActivityTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ClientActivityTaskFormValues;
  showProjectSelect?: boolean;
  projectOptions?: Project[];
  onFieldChange: <K extends keyof ClientActivityTaskFormValues>(
    field: K,
    value: ClientActivityTaskFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export function ActivityTaskDialog({
  open,
  onOpenChange,
  isEditing,
  isSaving = false,
  values,
  showProjectSelect = false,
  projectOptions = [],
  onFieldChange,
  onSave,
  onDelete,
}: ActivityTaskDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave =
    values.title.trim().length > 0 &&
    values.etaDate.trim().length > 0 &&
    values.etaTime.trim().length > 0 &&
    (!showProjectSelect || values.projectId.trim().length > 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit task" : "Add task"}</DialogTitle>
            <DialogDescription>
              Track a follow-up task for this client project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {showProjectSelect ? (
              <label className="block text-xs font-semibold text-muted-foreground">
                Project
                <div className="mt-2">
                  <ActivityProjectSelect
                    value={values.projectId}
                    onChange={(projectId) => onFieldChange("projectId", projectId)}
                    projects={projectOptions}
                    disabled={isSaving || isEditing}
                  />
                </div>
              </label>
            ) : null}
            <label className="block text-xs font-semibold text-muted-foreground">
              Title
              <input
                type="text"
                value={values.title}
                onChange={(event) => onFieldChange("title", event.target.value)}
                disabled={isSaving}
                className={cn(formFieldClassName, "mt-2")}
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Description
              <textarea
                value={values.description}
                onChange={(event) =>
                  onFieldChange("description", event.target.value)
                }
                disabled={isSaving}
                className={cn(formFieldClassName, "mt-2 min-h-20 resize-none")}
              />
            </label>
            <TaskDateTimePicker
              label="ETA"
              dateValue={values.etaDate}
              timeValue={values.etaTime}
              onDateChange={(etaDate) => onFieldChange("etaDate", etaDate)}
              onTimeChange={(etaTime) => onFieldChange("etaTime", etaTime)}
              disabled={isSaving}
            />
            <label className="block text-xs font-semibold text-muted-foreground">
              Priority
              <div className="mt-2">
                <ActivityPrioritySelect
                  value={values.priority}
                  onChange={(priority) => onFieldChange("priority", priority)}
                  disabled={isSaving}
                />
              </div>
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Status
              <div className="mt-2">
                <ActivityStatusSelect
                  value={values.status}
                  onChange={(status) => onFieldChange("status", status)}
                  disabled={isSaving}
                />
              </div>
            </label>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                disabled={isSaving}
                onClick={() => setIsConfirmOpen(true)}
              >
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSaving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={isSaving || !canSave}
                onClick={onSave}
              >
                {isEditing ? "Save" : "Create"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {onDelete ? (
        <ConfirmationModal
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Delete task?"
          description="This removes the task from the project. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isSaving}
          onConfirm={onDelete}
        />
      ) : null}
    </>
  );
}
