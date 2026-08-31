import { ProjectForSelect } from "@/features/workspace/projects/components/ProjectForSelect";
import { PROJECT_COLOR_PRESETS } from "@/features/workspace/projects/constants/projectColors";
import { PROJECT_FOR_LABEL } from "@/features/workspace/projects/constants/projectFor";
import type { ProjectFormDialogProps } from "@/features/workspace/projects/types/components";
import {
  colorSwatchClassName,
  formFieldGroupClassName,
  formLabelClassName,
} from "@/shared/constants/formStyles";
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
  onSubmit,
}: ProjectFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              disabled={submitting}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !projectName.trim()}>
              {isEditing ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
