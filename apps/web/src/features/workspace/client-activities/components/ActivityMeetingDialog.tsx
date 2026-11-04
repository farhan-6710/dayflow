import { ActivityCommonFields } from "@/features/workspace/client-activities/components/ActivityCommonFields";
import { venueOptions } from "@/features/workspace/client-activities/constants/activityOptions";
import type { ActivityMeetingDialogProps } from "@/features/workspace/client-activities/types/components";
import type { ClientActivityMeetingVenue } from "@/features/workspace/client-activities/types/types";
import {
  activityMeetingToFormValues,
  emptyActivityMeetingForm,
} from "@/features/workspace/client-activities/utils/activityFormUtils";
import { DatePicker } from "@/shared/components/DatePicker";
import { FormDialog } from "@/shared/components/FormDialog";
import { FormDialogDeleteButton } from "@/shared/components/FormDialogDeleteButton";
import { useDialogForm } from "@/shared/hooks/useDialogForm";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { TimeSelect } from "@/shared/components/TimeSelect";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";

export function ActivityMeetingDialog({
  open,
  onOpenChange,
  item,
  fixedProjectId,
  projectOptions,
  onSave,
  onDelete,
}: ActivityMeetingDialogProps) {
  const form = useDialogForm({
    id: "activity-meeting-dialog",
    open,
    onOpenChange,
    isCreate: !item,
    initialValues: item ? activityMeetingToFormValues(item) : emptyActivityMeetingForm(fixedProjectId),
    canSave: (values) =>
      Boolean(
        values.projectId &&
          values.title.trim() &&
          values.fromDate &&
          values.fromTime &&
          values.toDate &&
          values.toTime &&
          values.toDate >= values.fromDate,
      ),
    save: (values) => onSave(item?.id ?? null, values.projectId, { ...values }),
  });
  const { values } = form;
  const endsBeforeStart = Boolean(values.fromDate && values.toDate && values.toDate < values.fromDate);

  return (
    <FormDialog
      open={open}
      title={item ? "Edit meeting" : "New meeting"}
      description="When and where you're meeting."
      submitLabel={item ? "Save meeting" : "Create meeting"}
      saving={form.saving}
      canSave={form.canSubmit}
      onOpenChange={form.handleOpenChange}
      onSubmit={form.handleSubmit}
      footerStart={item && onDelete ? <FormDialogDeleteButton disabled={form.saving} onClick={onDelete} /> : undefined}
    >
      <ActivityCommonFields
        idPrefix="activity-meeting"
        values={values}
        disabled={form.saving}
        fixedProjectId={fixedProjectId}
        projectOptions={projectOptions}
        onChange={form.patch}
      />
      <div className={formFieldGroupClassName}>
        <span className={formLabelClassName}>Venue</span>
        <OptionDropdown
          label="Venue"
          value={values.venue}
          onChange={(venue) => form.setField("venue", venue as ClientActivityMeetingVenue)}
          options={venueOptions}
          disabled={form.saving}
          className="bg-background"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker
          id="activity-meeting-from"
          label="From date"
          value={values.fromDate}
          onChange={(date) => form.setField("fromDate", date)}
          disabled={form.saving}
        />
        <TimeSelect
          label="From time"
          value={values.fromTime}
          onChange={(time) => form.setField("fromTime", time)}
          disabled={form.saving}
        />
        <DatePicker
          id="activity-meeting-to"
          label="To date"
          value={values.toDate}
          onChange={(date) => form.setField("toDate", date)}
          disabled={form.saving}
        />
        <TimeSelect
          label="To time"
          value={values.toTime}
          onChange={(time) => form.setField("toTime", time)}
          disabled={form.saving}
        />
      </div>
      {endsBeforeStart ? <p role="alert" className="text-sm">The end date can't be before the start date.</p> : null}
    </FormDialog>
  );
}
