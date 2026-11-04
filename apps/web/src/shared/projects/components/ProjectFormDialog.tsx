import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { SubmitButton } from "@/shared/components/SubmitButton";
import { TextField } from "@/shared/components/TextField";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { PROJECT_COLOR_PRESETS } from "@/shared/constants/projectColors";
import { cn } from "@/shared/lib/utils";
import { useProjectForm } from "@/shared/projects/hooks/useProjectForm";
import type { ProjectFormDialogProps } from "@/shared/types/components";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { MYSELF_PROJECT_FOR_VALUE } from "@/shared/utils/projectFor";

export function ProjectFormDialog(props: ProjectFormDialogProps) {
  const { open, project, clients, lockProjectFor = false } = props;
  const form = useProjectForm(props);

  const projectForOptions = [
    { value: MYSELF_PROJECT_FOR_VALUE, label: "Myself" },
    ...clients.map((client) => ({ value: client.id, label: client.company_name })),
  ];

  return (
    <Dialog open={open} onOpenChange={form.handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">{project ?"Edit project" :"New project"}</DialogTitle>
          <DialogDescription>A folder for notes and links, personal or for a client.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <TextField
            id="project-name"
            label="Project name"
            placeholder="e.g. Website redesign"
            value={form.name}
            onChange={form.setName}
            disabled={form.submitting}
            required
          />
          <div className={formFieldGroupClassName}>
            <span className={formLabelClassName}>Project for</span>
            <OptionDropdown
              label="Project for"
              value={form.projectFor}
              onChange={form.setProjectFor}
              options={projectForOptions}
              disabled={form.submitting || lockProjectFor}
              className="bg-background"
            />
          </div>
          <div className={formFieldGroupClassName}>
            <span className={formLabelClassName}>Colour</span>
            <div className="flex flex-wrap gap-1">
              {PROJECT_COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use colour ${color}`}
                  aria-pressed={form.color === color}
                  onClick={() => form.setColor(color)}
                  className="flex size-10 items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span
                    style={{ backgroundColor: color }}
                    className={cn(
                      "size-7 rounded-full transition-colors",
                      form.color === color && "ring-2 ring-foreground ring-offset-2 ring-offset-popover",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={form.submitting}
              onClick={() => form.handleOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton loading={form.submitting} disabled={!form.name.trim()}>
              {project ?"Save changes" :"Create project"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
