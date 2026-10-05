import { useState } from "react";

import type { ProjectReferenceLinkFormValues } from "@/features/workspace/projects/utils/projectReferenceLinkFormUtils";
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

type ProjectReferenceLinkDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
  isSaving?: boolean;
  description?: string;
  values: ProjectReferenceLinkFormValues;
  onFieldChange: <K extends keyof ProjectReferenceLinkFormValues>(
    field: K,
    value: ProjectReferenceLinkFormValues[K],
  ) => void;
  onSave: () => void;
  onDelete?: () => void | Promise<void>;
  deleteDescription?: string;
};

export function ProjectReferenceLinkDialog({
  open,
  onOpenChange,
  isEditing = false,
  isSaving = false,
  description = "Store a link with this project (proposal, deck, sheet, etc.).",
  values,
  onFieldChange,
  onSave,
  onDelete,
  deleteDescription = "This removes the link from the project. This cannot be undone.",
}: ProjectReferenceLinkDialogProps) {
  const canSave = values.url.trim().length > 0;
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit link" : "Attach link"}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <label className="block text-xs font-semibold text-muted-foreground">
              Link URL
              <input
                type="url"
                value={values.url}
                onChange={(event) => onFieldChange("url", event.target.value)}
                disabled={isSaving}
                placeholder="https://"
                className={cn(formFieldClassName, "mt-2")}
              />
            </label>
            <label className="block text-xs font-semibold text-muted-foreground">
              Label (optional)
              <input
                type="text"
                value={values.label}
                onChange={(event) => onFieldChange("label", event.target.value)}
                disabled={isSaving}
                placeholder="e.g. Proposal PDF"
                className={cn(formFieldClassName, "mt-2")}
              />
            </label>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                disabled={isSaving}
                onClick={() => setDeleteOpen(true)}
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
                {isEditing ? "Save" : "Attach"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {onDelete ? (
        <ConfirmationModal
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete reference link?"
          description={deleteDescription}
          confirmLabel="Delete"
          confirmVariant="destructive"
          loading={isSaving}
          onConfirm={async () => {
            await onDelete();
            setDeleteOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
