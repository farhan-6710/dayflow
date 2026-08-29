import { useEffect, useState } from "react";

import { ActivityProjectSelect } from "@/features/admin/client-activities/components/ActivityProjectSelect";
import { ActivityStatusSelect } from "@/features/admin/client-activities/components/ActivityStatusSelect";
import { MeetingVenueSelect } from "@/features/admin/client-activities/components/MeetingVenueSelect";
import type { ClientActivityMeetingFormValues } from "@/features/admin/client-activities/utils/activityFormUtils";
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

type ActivityMeetingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  isSaving?: boolean;
  values: ClientActivityMeetingFormValues;
  showProjectSelect?: boolean;
  projectOptions?: Project[];
  onFieldChange: <K extends keyof ClientActivityMeetingFormValues>(
    field: K,
    value: ClientActivityMeetingFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
};

export function ActivityMeetingDialog({
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
}: ActivityMeetingDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsConfirmOpen(false);
    }
  }, [open]);

  const canSave =
    values.title.trim().length > 0 &&
    values.fromDate.trim().length > 0 &&
    values.fromTime.trim().length > 0 &&
    values.toDate.trim().length > 0 &&
    values.toTime.trim().length > 0 &&
    (!showProjectSelect || values.projectId.trim().length > 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit meeting" : "Add meeting"}</DialogTitle>
            <DialogDescription>
              Schedule a meeting for this client project.
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
              label="From"
              dateValue={values.fromDate}
              timeValue={values.fromTime}
              onDateChange={(fromDate) => onFieldChange("fromDate", fromDate)}
              onTimeChange={(fromTime) => onFieldChange("fromTime", fromTime)}
              disabled={isSaving}
            />
            <TaskDateTimePicker
              label="To"
              dateValue={values.toDate}
              timeValue={values.toTime}
              onDateChange={(toDate) => onFieldChange("toDate", toDate)}
              onTimeChange={(toTime) => onFieldChange("toTime", toTime)}
              disabled={isSaving}
            />
            <label className="block text-xs font-semibold text-muted-foreground">
              Venue
              <div className="mt-2">
                <MeetingVenueSelect
                  value={values.venue}
                  onChange={(venue) => onFieldChange("venue", venue)}
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
          title="Delete meeting?"
          description="This removes the meeting from the project. This cannot be undone."
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isSaving}
          onConfirm={onDelete}
        />
      ) : null}
    </>
  );
}
