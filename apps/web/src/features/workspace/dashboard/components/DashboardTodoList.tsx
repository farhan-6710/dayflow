import { useState } from "react";
import { ChevronDown, CircleCheck, Plus } from "lucide-react";

import { TodoFormDialog } from "@/features/workspace/dashboard/components/TodoFormDialog";
import { TodoRow } from "@/features/workspace/dashboard/components/TodoRow";
import { useDashboardTodos } from "@/features/workspace/dashboard/hooks/useDashboardTodos";
import { ConfirmationModal } from "@/shared/components/ConfirmationModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { SortableList } from "@/shared/components/SortableList";
import { TableSkeleton } from "@/shared/components/TableSkeleton";
import { PanelHeading } from "@/shared/components/PanelHeading";
import { Phantom } from "@/shared/components/Phantom";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function DashboardTodoList() {
  const list = useDashboardTodos();
  const [showCompleted, setShowCompleted] = useState(false);
  const rowHandlers = { onToggle: (todo: Parameters<typeof list.toggle>[0]) => void list.toggle(todo), onEdit: list.openEdit, onDelete: list.setTodoToDelete };

  const panel = (
    <Reveal as="section" className={cn(panelClassName, "h-full min-w-0 p-4 sm:p-5")}>
      <PanelHeading
        icon={CircleCheck}
        title="Todo list"
        action={
          <Button className="h-10" onClick={list.openCreate}>
            <Plus aria-hidden="true" />
            Add
          </Button>
        }
      />
      {list.error ? (
        <div className="mt-3">
          <ErrorBanner message={list.error} onRetry={list.reload} />
        </div>
      ) : null}
      {list.loading ? (
        <TableSkeleton rows={3} flush cells={[["A todo title goes here", "A short description of it"], "··"]} />
      ) : list.pending.length === 0 && list.completed.length === 0 && !list.error ? (
        <EmptyState
          bare
          className="px-2 py-6"
          image="icon-empty-todos"
          title="Nothing on your list"
          description="Add quick things to remember that don't need a date."
        />
      ) : (
        <>
          <ul className="mt-2 divide-y divide-border">
            <SortableList ids={list.pending.map((todo) => todo.id)} onReorder={(ids) => void list.reorder(ids)}>
              {list.pending.map((todo) => (
                <TodoRow key={todo.id} todo={todo} sortable {...rowHandlers} />
              ))}
            </SortableList>
          </ul>
          {list.completed.length > 0 ? (
            <div className="mt-2">
              <Button
                variant="ghost"
                className="h-10 w-full justify-between font-normal text-muted-foreground"
                aria-expanded={showCompleted}
                onClick={() => setShowCompleted(!showCompleted)}
              >
                Completed ({list.completed.length})
                <ChevronDown className={cn("transition-transform", showCompleted && "rotate-180")} aria-hidden="true" />
              </Button>
              {showCompleted ? (
                <ul className="divide-y divide-border">
                  <SortableList ids={[]} onReorder={() => undefined}>
                    {list.completed.map((todo) => (
                      <TodoRow key={todo.id} todo={todo} sortable={false} {...rowHandlers} />
                    ))}
                  </SortableList>
                </ul>
              ) : null}
            </div>
          ) : null}
        </>
      )}
      <TodoFormDialog
        open={list.dialogOpen}
        onOpenChange={list.setDialogOpen}
        todo={list.editingTodo}
        onSave={list.save}
        onDelete={(todo) => {
          list.setDialogOpen(false);
          list.setTodoToDelete(todo);
        }}
      />
      <ConfirmationModal
        open={list.todoToDelete !== null}
        onOpenChange={(open) => !open && list.setTodoToDelete(null)}
        title={`Delete "${list.todoToDelete?.title ?? ""}"?`}
        description="This can't be undone."
        confirmLabel="Delete todo"
        confirmVariant="destructive"
        loading={list.deleting}
        onConfirm={list.confirmDelete}
      />
    </Reveal>
  );

  return list.loading ? <Phantom>{panel}</Phantom> : panel;
}
