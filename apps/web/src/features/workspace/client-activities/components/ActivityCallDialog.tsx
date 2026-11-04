import { ActivityCommonFields } from "@/features/workspace/client-activities/components/ActivityCommonFields";
import type { ActivityCallDialogProps } from "@/features/workspace/client-activities/types/components";
import {
  activityCallToFormValues,
  emptyActivityCallForm,
} from "@/features/workspace/client-activities/utils/activityFormUtils";
import { DatePicker } from "@/shared/components/DatePicker";
import { FormDialog } from "@/shared/components/FormDialog";
import { FormDialogDeleteButton } from "@/shared/components/FormDialogDeleteButton";
import { useDialogForm } from "@/shared/hooks/useDialogForm";
import { TextField } from "@/shared/components/TextField";
import { TimeSelect } from "@/shared/components/TimeSelect";

export function ActivityCallDialog({
  open,
  onOpenChange,
  item,
  fixedProjectId,
  projectOptions,
  onSave,
  onDelete,
}: ActivityCallDialogProps) {
  const form = useDialogForm({
    id: "activity-call-dialog",
    open,
    onOpenChange,
    isCreate: !item,
    initialValues: item ? activityCallToFormValues(item) : emptyActivityCallForm(fixedProjectId),
    canSave: (values) =>
      Boolean(
        values.projectId && values.title.trim() && values.startDate && values.startTime && Number(values.durationMinutes) > 0,
      ),
    save: ({ projectId, durationMinutes, ...values }) =>
      onSave(item?.id ?? null, projectId, { ...values, durationMinutes: Number(durationMinutes) }),
  });

  return (
    <FormDialog
      open={open}
      title={item ? "Edit call" : "New call"}
      description="A scheduled call and how long it runs."
      submitLabel={item ? "Save call" : "Create call"}
      saving={form.saving}
      canSave={form.canSubmit}
      onOpenChange={form.handleOpenChange}
      onSubmit={form.handleSubmit}
      footerStart={item && onDelete ? <FormDialogDeleteButton disabled={form.saving} onClick={onDelete} /> : undefined}
    >
      <ActivityCommonFields
        idPrefix="activity-call"
        values={form.values}
        disabled={form.saving}
        fixedProjectId={fixedProjectId}
        projectOptions={projectOptions}
        onChange={form.patch}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker
          id="activity-call-date"
          label="Date"
          value={form.values.startDate}
          onChange={(date) => form.setField("startDate", date)}
          disabled={form.saving}
        />
        <TimeSelect
          label="Start time"
          value={form.values.startTime}
          onChange={(time) => form.setField("startTime", time)}
          disabled={form.saving}
        />
      </div>
      <TextField
        id="activity-call-duration"
        label="Duration (minutes)"
        type="number"
        min={1}
        value={form.values.durationMinutes}
        onChange={(minutes) => form.setField("durationMinutes", minutes)}
        disabled={form.saving}
        required
      />
    </FormDialog>
  );
}
