import { ReminderDialogFormFields } from "@/features/workspace/reminders/components/ReminderDialogFormFields";
import type { ReminderDialogProps } from "@/features/workspace/reminders/types/components";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useState } from "react";

export function ReminderDialog({
  open,
  onOpenChange,
  values,
  onFieldChange,
  onSubmit,
  onDelete,
  submitting,
  isEditing,
}: ReminderDialogProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Reminder" : "Add Reminder"}</DialogTitle>
            <DialogDescription>
              Set a recurring reminder with days, time, and optional disable period.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit();
            }}
          >
            <ReminderDialogFormFields
              values={values}
              onFieldChange={onFieldChange}
              submitting={submitting}
            />

            <DialogFooter className="gap-2 sm:justify-between">
              {onDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={submitting}
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !values.title.trim()}>
                  {isEditing ? "Save Changes" : "Add Reminder"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {onDelete ? (
        <ConfirmationModal
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete reminder?"
          description="This reminder will be removed permanently."
          confirmLabel="Delete reminder"
          confirmVariant="destructive"
          loading={submitting}
          onConfirm={() => {
            void onDelete();
            setDeleteOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
