import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import type { CSSProperties, FormEvent } from "react";

import type { Todo, TodoStatus } from "@/services/todosService";

export type TodoListItemProps = {
  todo: Todo;
  busy: boolean;
  exiting?: boolean;
  sortable?: boolean;
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: DraggableSyntheticListeners;
  sortableStyle?: CSSProperties;
  isDragging?: boolean;
  setSortableRef?: (node: HTMLElement | null) => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExitComplete?: () => void;
};

export type TodoFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  submitting: boolean;
  title: string;
  description: string;
  status: TodoStatus;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onStatusChange: (value: TodoStatus) => void;
  onSubmit: (event: FormEvent) => void | Promise<void>;
};

export type DashboardTodoListProps = {
  pendingTodos: Todo[];
  completedTodos: Todo[];
  loading: boolean;
  busyTodoId: string | null;
  exitingTodoId: string | null;
  completedOpen: boolean;
  onCompletedOpenChange: (open: boolean) => void;
  onAdd: () => void;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onReorderPending: (orderedIds: string[]) => void;
  onExitComplete: (todoId: string) => void;
};
