import { useEffect, useState } from "react";

import { ActivityProjectSelect } from "@/features/workspace/client-activities/components/ActivityProjectSelect";
import { ActivityStatusSelect } from "@/features/workspace/client-activities/components/ActivityStatusSelect";
import type { ClientActivityCallFormValues } from "@/features/workspace/client-activities/utils/activityFormUtils";
import { TaskDateTimePicker } from "@/features/workspace/tasks/components/TaskDateTimePicker";
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

type ActivityCallDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ClientActivityCallFormValues;
  showProjectSelect?: boolean;
  projectOptions?: Project[];
  onFieldChange: <K extends keyof ClientActivityCallFormValues>(
    field: K,
    value: ClientActivityCallFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export function ActivityCallDialog({
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
}: ActivityCallDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsConfirmOpen(false);
    }
  }, [open]);

  const duration = Number(values.durationMinutes);
  const canSave =
    values.title.trim().length > 0 &&
    values.startDate.trim().length > 0 &&
    values.startTime.trim().length > 0 &&
    Number.isFinite(duration) &&
    duration > 0 &&
    (!showProjectSelect || values.projectId.trim().length > 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit call" : "Add call"}</DialogTitle>
            <DialogDescription>
              Log a call activity for this client project.
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
              label="Call start"
              dateValue={values.startDate}
              timeValue={values.startTime}
              onDateChange={(startDate) => onFieldChange("startDate", startDate)}
              onTimeChange={(startTime) => onFieldChange("startTime", startTime)}
              disabled={isSaving}
            />
            <label className="block text-xs font-semibold text-muted-foreground">
              Duration (minutes)
              <input
                type="number"
                min={1}
                step={1}
                value={values.durationMinutes}
                onChange={(event) =>
                  onFieldChange("durationMinutes", event.target.value)
                }
                disabled={isSaving}
                className={cn(formFieldClassName, "mt-2")}
              />
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
          title="Delete call?"
          description="This removes the call from the project. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isSaving}
          onConfirm={onDelete}
        />
      ) : null}
    </>
  );
}
