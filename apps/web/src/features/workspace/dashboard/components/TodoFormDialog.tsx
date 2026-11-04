import type { TodoFormDialogProps } from "@/features/workspace/dashboard/types/components";
import { FormDialog } from "@/shared/components/FormDialog";
import { FormDialogDeleteButton } from "@/shared/components/FormDialogDeleteButton";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { TextField } from "@/shared/components/TextField";
import { useDialogForm } from "@/shared/hooks/useDialogForm";

export function TodoFormDialog({ open, onOpenChange, todo, onSave, onDelete }: TodoFormDialogProps) {
  const form = useDialogForm({
    id: "todo-form-dialog",
    open,
    onOpenChange,
    isCreate: !todo,
    initialValues: { title: todo?.title ?? "", description: todo?.description ?? "" },
    canSave: (values) => values.title.trim().length > 0,
    save: (values) => onSave(todo?.id ?? null, values),
  });

  return (
    <FormDialog
      open={open}
      title={todo ? "Edit todo" : "New todo"}
      description="A quick item for your list, with no date attached."
      submitLabel={todo ? "Save todo" : "Add todo"}
      saving={form.saving}
      canSave={form.canSubmit}
      onOpenChange={form.handleOpenChange}
      onSubmit={form.handleSubmit}
      footerStart={
        todo && onDelete ? <FormDialogDeleteButton disabled={form.saving} onClick={() => onDelete(todo)} /> : undefined
      }
    >
      <TextField
        id="todo-title"
        label="Title"
        value={form.values.title}
        onChange={(title) => form.setField("title", title)}
        disabled={form.saving}
        required
      />
      <TextAreaField
        id="todo-description"
        label="Details (optional)"
        value={form.values.description}
        onChange={(description) => form.setField("description", description)}
        disabled={form.saving}
      />
    </FormDialog>
  );
}
