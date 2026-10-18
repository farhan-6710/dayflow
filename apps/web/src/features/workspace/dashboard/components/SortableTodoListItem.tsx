import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TodoListItem } from "@/features/workspace/dashboard/components/TodoListItem";
import type { Todo } from "@/services/todosService";

type SortableTodoListItemProps = {
  todo: Todo;
  busy: boolean;
  exiting?: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExitComplete?: () => void;
};

export function SortableTodoListItem({
  todo,
  busy,
  exiting = false,
  onToggle,
  onEdit,
  onDelete,
  onExitComplete,
}: SortableTodoListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    disabled: busy || exiting,
  });

  return (
    <TodoListItem
      todo={todo}
      busy={busy}
      exiting={exiting}
      sortable
      setSortableRef={setNodeRef}
      dragHandleAttributes={attributes}
      dragHandleListeners={listeners}
      isDragging={isDragging}
      sortableStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
      onExitComplete={onExitComplete}
    />
  );
}
