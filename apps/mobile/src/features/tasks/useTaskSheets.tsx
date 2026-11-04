import { useState } from "react";

import { TaskDetailsSheet } from "@/features/tasks/TaskDetailsSheet";
import { TaskFormSheet } from "@/features/tasks/TaskFormSheet";
import type { Task } from "@/shared/types/types";

/** The details and form sheets a task screen needs, opened from anywhere on it. */
export function useTaskSheets() {
  const [details, setDetails] = useState<Task | null>(null);
  const [form, setForm] = useState<{ open: boolean; task: Task | null; date: string | null; time: string | null }>({
    open: false,
    task: null,
    date: null,
    time: null,
  });

  const sheets = (
    <>
      <TaskDetailsSheet
        task={details}
        onClose={() => setDetails(null)}
        onEdit={(task) => {
          setDetails(null);
          setForm({ open: true, task, date: null, time: null });
        }}
      />
      <TaskFormSheet
        open={form.open}
        task={form.task}
        defaultDate={form.date}
        defaultTime={form.time}
        onClose={() => setForm((current) => ({ ...current, open: false }))}
      />
    </>
  );

  return {
    sheets,
    openDetails: setDetails,
    openEdit: (task: Task) => setForm({ open: true, task, date: null, time: null }),
    openNew: (date: string | null = null, time: string | null = null) => setForm({ open: true, task: null, date, time }),
  };
}
