import { Link } from "react-router";

import { WORKSPACE_TASKS_CALENDAR_PATH } from "@/app/constants/workspaceRoutes";
import { DashboardPanel } from "@/features/workspace/dashboard/components/DashboardPanel";
import { FocusListItem } from "@/features/workspace/dashboard/components/FocusListItem";
import type { Task } from "@/services/tasksService";

type DashboardFocusListProps = {
  urgentTasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function DashboardFocusList({
  urgentTasks,
  loading,
  onEdit,
  onDelete,
}: DashboardFocusListProps) {
  return (
    <DashboardPanel className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Focus List</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your active upcoming action items.
          </p>
        </div>
        <Link
          to={WORKSPACE_TASKS_CALENDAR_PATH}
          className="text-xs font-semibold text-accent hover:underline"
        >
          View Tasks Calendar
        </Link>
      </div>

      <div className="mt-4 divide-y divide-border">
        {loading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading tasks...
          </div>
        ) : urgentTasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              All caught up! No tasks left.
            </p>
            <Link
              to={WORKSPACE_TASKS_CALENDAR_PATH}
              className="mt-2 inline-block text-xs font-semibold text-accent hover:underline"
            >
              Create a Task
            </Link>
          </div>
        ) : (
          urgentTasks.map((task) => (
            <FocusListItem
              key={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
            />
          ))
        )}
      </div>
    </DashboardPanel>
  );
}
