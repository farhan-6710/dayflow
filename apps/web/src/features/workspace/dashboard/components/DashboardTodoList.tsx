import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronDown, Plus } from "lucide-react";

import { DashboardPanel } from "@/features/workspace/dashboard/components/DashboardPanel";
import { SortableTodoListItem } from "@/features/workspace/dashboard/components/SortableTodoListItem";
import { TodoListItem } from "@/features/workspace/dashboard/components/TodoListItem";
import type { DashboardTodoListProps } from "@/features/workspace/dashboard/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

/** Mirrors TodoListItem row: grip + checkbox + title/desc + menu (py-3, items-start). */
function TodoRowSkeleton() {
  return (
    <div className="flex min-w-0 items-start gap-2 py-3" aria-hidden="true">
      <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
      <Skeleton className="mt-0.5 size-5 shrink-0 rounded" />
      <div className="min-w-0 flex-1">
        <div className="flex h-5 items-center">
          <Skeleton className="h-3.5 w-3/5 max-w-48" />
        </div>
        <div className="mt-0.5 flex h-4 items-center">
          <Skeleton className="h-3 w-2/5 max-w-32" />
        </div>
      </div>
      <Skeleton className="size-7 shrink-0 rounded-md" />
    </div>
  );
}

export function DashboardTodoList({
  pendingTodos,
  completedTodos,
  loading,
  busyTodoId,
  exitingTodoId,
  completedOpen,
  onCompletedOpenChange,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
  onReorderPending,
  onExitComplete,
}: DashboardTodoListProps) {
  const visibleCompleted = completedTodos.filter(
    (todo) => todo.id !== exitingTodoId,
  );
  const completedCount = completedTodos.length;
  const pendingIds = pendingTodos.map((todo) => todo.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pendingIds.indexOf(String(active.id));
    const newIndex = pendingIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    onReorderPending(arrayMove(pendingIds, oldIndex, newIndex));
  }

  return (
    <DashboardPanel className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Todo List</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Simple checklist for the day.
          </p>
        </div>
        <Button type="button" size="sm" onClick={onAdd} className="shrink-0">
          <Plus className="size-4" />
          Add Todo
        </Button>
      </div>

      <div className="mt-4 [&>[data-slot=todo-row]+[data-slot=todo-row]]:border-t [&>[data-slot=todo-row]+[data-slot=todo-row]]:border-border">
        {loading ? (
          <div className="divide-y divide-border" aria-busy="true" aria-label="Loading todos">
            <TodoRowSkeleton />
            <TodoRowSkeleton />
            <TodoRowSkeleton />
          </div>
        ) : pendingTodos.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {completedCount > 0
                ? "All done for now. Nice work."
                : "No todos yet. Add one to get started."}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pendingIds}
              strategy={verticalListSortingStrategy}
            >
              {pendingTodos.map((todo) => (
                <SortableTodoListItem
                  key={todo.id}
                  todo={todo}
                  busy={busyTodoId === todo.id}
                  exiting={exitingTodoId === todo.id}
                  onToggle={() => onToggle(todo)}
                  onEdit={() => onEdit(todo)}
                  onDelete={() => onDelete(todo)}
                  onExitComplete={() => onExitComplete(todo.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {completedCount > 0 ? (
        <div className="mt-4 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => onCompletedOpenChange(!completedOpen)}
            className="flex w-full items-center justify-between gap-2 rounded-md py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            aria-expanded={completedOpen}
          >
            <span className="flex items-center gap-2">
              Completed
              <span className="inline-flex min-w-5 items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-foreground">
                {completedCount}
              </span>
            </span>
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                completedOpen && "rotate-180",
              )}
            />
          </button>

          {completedOpen ? (
            <div className="mt-1 [&>[data-slot=todo-row]+[data-slot=todo-row]]:border-t [&>[data-slot=todo-row]+[data-slot=todo-row]]:border-border">
              {visibleCompleted.map((todo) => (
                <TodoListItem
                  key={todo.id}
                  todo={todo}
                  busy={busyTodoId === todo.id}
                  onToggle={() => onToggle(todo)}
                  onEdit={() => onEdit(todo)}
                  onDelete={() => onDelete(todo)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </DashboardPanel>
  );
}
