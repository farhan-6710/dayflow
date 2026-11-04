import { ArrowDown, ArrowUp, Check, Pencil, Trash2 } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { TASK_STATUS } from "@/features/tasks/taskMeta";
import { useTaskActions } from "@/features/tasks/useTasks";
import { cn } from "@/lib/cn";
import { haptics } from "@/lib/haptics";
import type { Task } from "@/shared/types/types";
import { useTheme } from "@/theme/ThemeProvider";
import { IconButton } from "@/ui/IconButton";
import { SwipeRow } from "@/ui/SwipeRow";
import { Text } from "@/ui/Text";

type TaskRowProps = {
  task: Task;
  subtitle?: string | null;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  /** Reorder mode: up and down controls instead of swipe. */
  onMove?: (direction: -1 | 1) => void;
};

export function TaskRow({ task, subtitle, onOpen, onEdit, onMove }: TaskRowProps) {
  const { colors } = useTheme();
  const { toggleDone, confirmDelete } = useTaskActions();
  const status = TASK_STATUS[task.status];
  const done = task.status === "done";

  const content = (
    <View className="min-h-14 flex-row items-center gap-3 px-3 py-2.5">
      {onMove ? null : (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={`Mark ${task.title} ${done ? "as to do" : "as completed"}`}
          hitSlop={8}
          onPress={() => {
            haptics.tap();
            toggleDone(task);
          }}
          style={{ borderColor: colors[status.color] }}
          className={cn("size-6 items-center justify-center rounded-full border-2", done && "bg-success")}
        >
          {done ? <Check size={14} color={colors["success-foreground"]} /> : null}
        </Pressable>
      )}
      <View className="flex-1">
        <Text numberOfLines={1} tone={done ? "muted" : "default"} className={done ? "line-through" : undefined}>
          {task.title}
        </Text>
        <Text variant="caption" tone="muted" numberOfLines={1}>
          {[subtitle, status.label, task.priority === "high" ? "High priority" : null].filter(Boolean).join(" · ")}
        </Text>
      </View>
      {onMove ? (
        <View className="flex-row">
          <IconButton icon={ArrowUp} label={`Move ${task.title} up`} onPress={() => onMove(-1)} />
          <IconButton icon={ArrowDown} label={`Move ${task.title} down`} onPress={() => onMove(1)} />
        </View>
      ) : null}
    </View>
  );

  if (onMove) return <View className="bg-card">{content}</View>;

  return (
    <SwipeRow
      title={task.title}
      accessibilityLabel={`${task.title}, ${status.label}`}
      onPress={() => onOpen(task)}
      actions={[
        { label: "Edit", icon: Pencil, onPress: () => onEdit(task) },
        { label: "Delete", icon: Trash2, destructive: true, onPress: () => void confirmDelete(task) },
      ]}
    >
      {content}
    </SwipeRow>
  );
}
