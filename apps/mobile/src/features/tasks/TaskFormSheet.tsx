import { useEffect, useMemo, useState } from "react";

import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "@/features/tasks/taskMeta";
import { useTaskActions } from "@/features/tasks/useTasks";
import type { Task, TaskPriority, TaskStatus } from "@/shared/types/types";
import { ChipGroup } from "@/ui/ChipGroup";
import { DateField } from "@/ui/DateField";
import { FormSheet } from "@/ui/FormSheet";
import { Input } from "@/ui/Input";
import { TimeField } from "@/ui/TimeField";

type TaskFormSheetProps = {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultDate?: string | null;
  defaultTime?: string | null;
};

function initialState(task: Task | null | undefined, defaultDate?: string | null, defaultTime?: string | null) {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: (task?.priority ?? "medium") as TaskPriority,
    status: (task?.status ?? "todo") as TaskStatus,
    dueDate: task ? task.due_date : (defaultDate ?? null),
    dueTime: task ? task.due_time : (defaultTime ?? null),
  };
}

export function TaskFormSheet({ open, onClose, task, defaultDate, defaultTime }: TaskFormSheetProps) {
  const { create, update } = useTaskActions();
  const initial = useMemo(() => initialState(task, defaultDate, defaultTime), [task, defaultDate, defaultTime]);
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  async function submit() {
    const values = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority,
      status: form.status,
      due_date: form.dueDate,
      due_time: form.dueTime,
    };
    if (task) await update.mutateAsync({ id: task.id, updates: values });
    else await create.mutateAsync(values);
  }

  return (
    <FormSheet
      open={open}
      onClose={onClose}
      title={task ? "Edit task" : "New task"}
      submitLabel={task ? "Save task" : "Add task"}
      onSubmit={submit}
      dirty={dirty}
      canSubmit={Boolean(form.title.trim())}
    >
      <Input label="Title" value={form.title} onChangeText={(title) => setForm({ ...form, title })} placeholder="What needs doing?" autoFocus={!task} returnKeyType="next" />
      <Input label="Description" value={form.description} onChangeText={(description) => setForm({ ...form, description })} multiline placeholder="Add details (optional)" />
      <ChipGroup label="Priority" options={TASK_PRIORITY_OPTIONS} value={form.priority} onChange={(priority) => setForm({ ...form, priority })} />
      <ChipGroup label="Status" options={TASK_STATUS_OPTIONS} value={form.status} onChange={(status) => setForm({ ...form, status })} />
      <DateField label="Due date" value={form.dueDate} onChange={(dueDate) => setForm({ ...form, dueDate })} clearable placeholder="No due date" />
      <TimeField label="Due time" value={form.dueTime} onChange={(dueTime) => setForm({ ...form, dueTime })} clearable placeholder="No time" />
    </FormSheet>
  );
}
