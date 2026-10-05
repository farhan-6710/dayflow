import { useMemo, useState, type FormEvent } from "react";

import { ProjectForSelect } from "@/features/workspace/projects/components/ProjectForSelect";
import { PROJECT_COLOR_PRESETS } from "@/features/workspace/projects/constants/projectColors";
import { PROJECT_FOR_LABEL } from "@/features/workspace/projects/constants/projectFor";
import type { ProjectFormDialogProps } from "@/features/workspace/projects/types/components";
import { ConfirmationModal } from "@/shared/ConfirmationModal";
import {
  colorSwatchClassName,
  formFieldGroupClassName,
  formLabelClassName,
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

export function ProjectFormDialog({
  open,
  onOpenChange,
  isEditing,
  submitting,
  projectName,
  onProjectNameChange,
  projectColor,
  onProjectColorChange,
  projectFor,
  onProjectForChange,
  clients,
  lockProjectFor = false,
  onSubmit,
  onDelete,
}: ProjectFormDialogProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const snapshot = useOpenSnapshot(open, {
    projectName,
    projectColor,
    projectFor,
  });
  const isDirty = useMemo(() => {
    if (!snapshot) return false;
    return (
      projectName !== snapshot.projectName ||
      projectColor !== snapshot.projectColor ||
      projectFor !== snapshot.projectFor
    );
  }, [projectColor, projectFor, projectName, snapshot]);

  const { handleOpenChange } = useUnsavedDialogClose({
    id: "project-form-dialog",
    open,
    isDirty,
    isCreate: !isEditing,
    onOpenChange,
    onSave: async () => {
      if (!projectName.trim()) {
        throw new Error("Project name is required");
      }
      await onSubmit({
        preventDefault() {},
      } as FormEvent);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the project name, owner, and highlight color."
                : "Create a custom workspace folder with a specific highlight color."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Project Name</label>
              <Input
                placeholder="e.g. Work tasks, Side Projects, Fitness"
                value={projectName}
                onChange={(event) => onProjectNameChange(event.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>{PROJECT_FOR_LABEL}</label>
              <ProjectForSelect
                value={projectFor}
                onChange={onProjectForChange}
                clients={clients}
                disabled={submitting || lockProjectFor}
              />
            </div>

            <div className={formFieldGroupClassName}>
              <label className={formLabelClassName}>Highlight Color</label>
              <div className="flex flex-wrap gap-3">
                {PROJECT_COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Select color ${color}`}
                    aria-pressed={projectColor === color}
                    onClick={() => onProjectColorChange(color)}
                    className={colorSwatchClassName(projectColor === color)}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:justify-between">
              {isEditing && onDelete ? (
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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !projectName.trim()}>
                  {isEditing ? "Save Changes" : "Create Project"}
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
          title="Delete Project?"
          description="This action is irreversible. All notes in this project will be deleted forever."
          confirmLabel="Delete permanently"
          confirmVariant="destructive"
          loading={submitting}
          onConfirm={async () => {
            await onDelete();
            setDeleteOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
