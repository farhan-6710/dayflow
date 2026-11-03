import { statusOptions } from "@/features/workspace/client-activities/constants/activityOptions";
import type { ActivityCommonFieldsProps } from "@/features/workspace/client-activities/types/components";
import type { ClientActivityStatus } from "@/features/workspace/client-activities/types/types";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { TextField } from "@/shared/components/TextField";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";

export function ActivityCommonFields({
  idPrefix,
  values,
  disabled,
  fixedProjectId,
  projectOptions,
  onChange,
}: ActivityCommonFieldsProps) {
  return (
    <>
      {fixedProjectId ? null : (
        <div className={formFieldGroupClassName}>
          <span className={formLabelClassName}>Project</span>
          <OptionDropdown
            label="Project"
            value={values.projectId}
            onChange={(projectId) => onChange({ projectId })}
            options={(projectOptions ?? []).map((project) => ({ value: project.id, label: project.name }))}
            placeholder={projectOptions?.length ? "Select a project" : "No projects yet"}
            disabled={disabled || !projectOptions?.length}
            className="bg-background"
          />
        </div>
      )}
      <TextField
        id={`${idPrefix}-title`}
        label="Title"
        value={values.title}
        onChange={(title) => onChange({ title })}
        disabled={disabled}
        required
      />
      <TextAreaField
        id={`${idPrefix}-description`}
        label="Description (optional)"
        value={values.description}
        onChange={(description) => onChange({ description })}
        disabled={disabled}
      />
      <div className={formFieldGroupClassName}>
        <span className={formLabelClassName}>Status</span>
        <OptionDropdown
          label="Status"
          value={values.status}
          onChange={(status) => onChange({ status: status as ClientActivityStatus })}
          options={statusOptions}
          disabled={disabled}
          className="bg-background"
        />
      </div>
    </>
  );
}
