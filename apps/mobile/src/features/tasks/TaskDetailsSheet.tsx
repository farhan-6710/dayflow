import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react-native";
import { View } from "react-native";

import { TASK_STATUS } from "@/features/tasks/taskMeta";
import { useTaskActions } from "@/features/tasks/useTasks";
import type { Task } from "@/shared/types/types";
import { parseDateValue } from "@/shared/utils/dateValue";
import { Button } from "@/ui/Button";
import { Sheet } from "@/ui/Sheet";
import { StatusPill } from "@/ui/StatusPill";
import { Text } from "@/ui/Text";

type TaskDetailsSheetProps = {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3 border-b border-border py-2.5">
      <Text tone="muted">{label}</Text>
      <Text className="shrink capitalize">{value}</Text>
    </View>
  );
}

export function TaskDetailsSheet({ task, onClose, onEdit }: TaskDetailsSheetProps) {
  const { confirmDelete, toggleDone } = useTaskActions();
  const due = parseDateValue(task?.due_date);

  return (
    <Sheet open={Boolean(task)} onClose={onClose}>
      {task ? (
        <>
          <View className="gap-2">
            <StatusPill label={TASK_STATUS[task.status].label} tone={TASK_STATUS[task.status].tone} />
            <Text variant="title">{task.title}</Text>
            {task.description ? <Text variant="prose" tone="muted">{task.description}</Text> : null}
          </View>
          <View>
            <Row label="Due" value={due ? format(due, "EEE, MMM d, yyyy") : "No date"} />
            <Row label="Time" value={task.due_time ?? "No time"} />
            <Row label="Priority" value={task.priority} />
          </View>
          <Button
            label={task.status === "done" ? "Mark as to do" : "Mark as completed"}
            onPress={() => {
              toggleDone(task);
              onClose();
            }}
          />
          <View className="flex-row gap-3">
            <Button label="Edit" variant="outline" icon={Pencil} className="flex-1" onPress={() => onEdit(task)} />
            <Button
              label="Delete"
              variant="outline"
              icon={Trash2}
              className="flex-1"
              onPress={() => {
                void confirmDelete(task).then((deleted) => {
                  if (deleted) onClose();
                });
              }}
            />
          </View>
        </>
      ) : null}
    </Sheet>
  );
}
