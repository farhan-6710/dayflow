import { ActivityCommonFields } from "@/features/workspace/client-activities/components/ActivityCommonFields";
import { priorityOptions } from "@/features/workspace/client-activities/constants/activityOptions";
import type { ActivityTaskDialogProps } from "@/features/workspace/client-activities/types/components";
import type { ClientActivityPriority } from "@/features/workspace/client-activities/types/types";
import {
  activityTaskToFormValues,
  emptyActivityTaskForm,
} from "@/features/workspace/client-activities/utils/activityFormUtils";
import { DatePicker } from "@/shared/components/DatePicker";
import { FormDialog } from "@/shared/components/FormDialog";
import { FormDialogDeleteButton } from "@/shared/components/FormDialogDeleteButton";
import { useDialogForm } from "@/shared/hooks/useDialogForm";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { TimeSelect } from "@/shared/components/TimeSelect";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";

export function ActivityTaskDialog({
  open,
  onOpenChange,
  item,
  fixedProjectId,
  projectOptions,
  onSave,
  onDelete,
}: ActivityTaskDialogProps) {
  const form = useDialogForm({
    id: "activity-task-dialog",
    open,
    onOpenChange,
    isCreate: !item,
    initialValues: item ? activityTaskToFormValues(item) : emptyActivityTaskForm(fixedProjectId),
    canSave: (values) => Boolean(values.projectId && values.title.trim() && values.etaDate && values.etaTime),
    save: (values) =>
      onSave(item?.id ?? null, values.projectId, {
        title: values.title,
        description: values.description,
        priority: values.priority,
        status: values.status,
        etaDate: values.etaDate,
        etaTime: values.etaTime,
      }),
  });

  return (
    <FormDialog
      open={open}
      title={item ? "Edit task" : "New task"}
      description="A piece of client work with a due date."
      submitLabel={item ? "Save task" : "Create task"}
      saving={form.saving}
      canSave={form.canSubmit}
      onOpenChange={form.handleOpenChange}
      onSubmit={form.handleSubmit}
      footerStart={item && onDelete ? <FormDialogDeleteButton disabled={form.saving} onClick={onDelete} /> : undefined}
    >
      <ActivityCommonFields
        idPrefix="activity-task"
        values={form.values}
        disabled={form.saving}
        fixedProjectId={fixedProjectId}
        projectOptions={projectOptions}
        onChange={form.patch}
      />
      <div className={formFieldGroupClassName}>
        <span className={formLabelClassName}>Priority</span>
        <OptionDropdown
          label="Priority"
          value={form.values.priority}
          onChange={(priority) => form.setField("priority", priority as ClientActivityPriority)}
          options={priorityOptions}
          disabled={form.saving}
          className="bg-background"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker
          id="activity-task-date"
          label="Due date"
          value={form.values.etaDate}
          onChange={(date) => form.setField("etaDate", date)}
          disabled={form.saving}
        />
        <TimeSelect
          label="Due time"
          value={form.values.etaTime}
          onChange={(time) => form.setField("etaTime", time)}
          disabled={form.saving}
        />
      </div>
    </FormDialog>
  );
}
