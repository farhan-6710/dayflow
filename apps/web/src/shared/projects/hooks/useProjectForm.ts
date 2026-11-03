import { useState, type FormEvent } from "react";

import { createProject, updateProject } from "@/services/projectsService";
import { DEFAULT_PROJECT_COLOR } from "@/shared/constants/projectColors";
import { useAuth } from "@/shared/hooks/useAuth";
import type { ProjectFormDialogProps } from "@/shared/types/components";
import { useUnsavedDialogClose } from "@/shared/unsaved-changes/useUnsavedDialogClose";
import { projectForToSelectValue, selectValueToProjectFor } from "@/shared/utils/projectFor";
import { showToast } from "@/shared/utils/showToast";

export function useProjectForm({
  open,
  onOpenChange,
  project,
  defaultProjectFor = null,
  onSaved,
}: ProjectFormDialogProps) {
  const { user } = useAuth();
  const initialName = project?.name ?? "";
  const initialColor: string = project?.color_hex ?? DEFAULT_PROJECT_COLOR;
  const initialFor = projectForToSelectValue(project ? project.project_for : defaultProjectFor);

  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [projectFor, setProjectFor] = useState(initialFor);
  const [submitting, setSubmitting] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  // Start from the current project each time the dialog opens.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setName(initialName);
      setColor(initialColor);
      setProjectFor(initialFor);
    }
  }

  const isDirty = name !== initialName || color !== initialColor || projectFor !== initialFor;

  /** Throws on failure so the unsaved-changes modal stays open. */
  async function save() {
    if (!user) {
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      showToast("error", "Give the project a name.");
      throw new Error("Project name is required.");
    }

    const input = { name: trimmed, color_hex: color, project_for: selectValueToProjectFor(projectFor) };
    setSubmitting(true);
    try {
      const saved = project ? await updateProject(project.id, input) : await createProject(user.id, input);
      onSaved(saved);
      onOpenChange(false);
      showToast("success", project ? "Project updated." : "Project created.");
    } catch (error) {
      console.error("Failed to save project:", error);
      showToast("error", "Couldn't save the project. Please try again.");
      throw error;
    } finally {
      setSubmitting(false);
    }
  }

  const { handleOpenChange } = useUnsavedDialogClose({
    id: "project-form-dialog",
    open,
    isDirty,
    isCreate: !project,
    onOpenChange,
    onSave: save,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save().catch(() => undefined);
  }

  return { name, setName, color, setColor, projectFor, setProjectFor, submitting, handleOpenChange, handleSubmit };
}
