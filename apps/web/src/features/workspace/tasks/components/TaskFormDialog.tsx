import type { TaskFormDialogProps, TaskFormValues } from "@/features/workspace/tasks/types/components";
import { DatePicker } from "@/shared/components/DatePicker";
import { FormDialog } from "@/shared/components/FormDialog";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { TextField } from "@/shared/components/TextField";
import { TimeSelect } from "@/shared/components/TimeSelect";
import { formFieldGroupClassName, formLabelClassName } from "@/shared/constants/formStyles";
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from "@/shared/constants/taskStatus";
import { DEFAULT_TIME } from "@/shared/constants/times";
import { useDialogForm } from "@/shared/hooks/useDialogForm";
import type { TaskPriority, TaskStatus } from "@/shared/types/types";

function toOptions<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

export function TaskFormDialog({ open, onOpenChange, task, defaultDate, onSave }: TaskFormDialogProps) {
  const initialValues: TaskFormValues = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "medium",
    status: task?.status ?? "todo",
    dueDate: task ? (task.due_date ?? "") : defaultDate,
    dueTime: task ? (task.due_time ?? "") : DEFAULT_TIME,
  };
  const form = useDialogForm({
    id: "task-form-dialog",
    open,
    onOpenChange,
    isCreate: !task,
    initialValues,
    canSave: (values) => values.title.trim().length > 0,
    save: (values) => onSave(task?.id ?? null, values),
  });
  const { values, setField, saving } = form;

  return (
    <FormDialog
      open={open}
      title={task ? "Edit task" : "New task"}
      description="Something to get done, on a day and time if you like."
      submitLabel={task ? "Save task" : "Add task"}
      saving={saving}
      canSave={form.canSubmit}
      onOpenChange={form.handleOpenChange}
      onSubmit={form.handleSubmit}
    >
      <TextField
        id="task-title"
        label="Title"
        value={values.title}
        onChange={(title) => setField("title", title)}
        disabled={saving}
        required
      />
      <TextAreaField
        id="task-description"
        label="Description (optional)"
        value={values.description}
        onChange={(description) => setField("description", description)}
        disabled={saving}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className={formFieldGroupClassName}>
          <span className={formLabelClassName}>Priority</span>
          <OptionDropdown
            label="Priority"
            value={values.priority}
            onChange={(priority) => setField("priority", priority as TaskPriority)}
            options={toOptions(TASK_PRIORITY_LABELS)}
            disabled={saving}
            className="bg-background"
          />
        </div>
        <div className={formFieldGroupClassName}>
          <span className={formLabelClassName}>Status</span>
          <OptionDropdown
            label="Status"
            value={values.status}
            onChange={(status) => setField("status", status as TaskStatus)}
            options={toOptions(TASK_STATUS_LABELS)}
            disabled={saving}
            className="bg-background"
          />
        </div>
        <DatePicker
          id="task-due-date"
          label="Due date"
          value={values.dueDate}
          onChange={(date) => setField("dueDate", date)}
          onClear={() => setField("dueDate", "")}
          disabled={saving}
        />
        <TimeSelect
          label="Due time"
          value={values.dueTime}
          onChange={(time) => setField("dueTime", time)}
          disabled={saving || !values.dueDate}
        />
      </div>
    </FormDialog>
  );
}
