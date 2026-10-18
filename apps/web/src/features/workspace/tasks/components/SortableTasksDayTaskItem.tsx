import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  TasksDayTaskItem,
  type TasksDayTaskItemProps,
} from "@/features/workspace/tasks/components/TasksDayTaskItem";

type SortableTasksDayTaskItemProps = Pick<
  TasksDayTaskItemProps,
  "task" | "onEdit" | "onDelete"
>;

export function SortableTasksDayTaskItem(props: SortableTasksDayTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  return (
    <TasksDayTaskItem
      {...props}
      setSortableRef={setNodeRef}
      dragHandleAttributes={attributes}
      dragHandleListeners={listeners}
      isDragging={isDragging}
      sortableStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    />
  );
}
