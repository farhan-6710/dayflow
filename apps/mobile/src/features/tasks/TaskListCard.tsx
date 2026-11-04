import { View } from "react-native";

import { TaskRow } from "@/features/tasks/TaskRow";
import type { Task } from "@/shared/types/types";

type TaskListCardProps = {
  tasks: Task[];
  subtitleOf?: (task: Task) => string | null;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onMove?: (task: Task, direction: -1 | 1) => void;
};

export function TaskListCard({ tasks, subtitleOf, onOpen, onEdit, onMove }: TaskListCardProps) {
  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {tasks.map((task, index) => (
        <View key={task.id} className={index > 0 ? "border-t border-border" : undefined}>
          <TaskRow
            task={task}
            subtitle={subtitleOf?.(task) ?? task.due_time}
            onOpen={onOpen}
            onEdit={onEdit}
            onMove={onMove ? (direction) => onMove(task, direction) : undefined}
          />
        </View>
      ))}
    </View>
  );
}
