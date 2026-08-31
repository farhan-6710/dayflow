import type { ReactNode } from "react";
import { CalendarDays, CheckSquare, Phone } from "lucide-react";

import { ActivityList } from "@/features/workspace/client-activities/components/ActivityList";
import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityTask,
} from "@/features/workspace/client-activities/types/types";

type ActivityColumnsProps = {
  tasks: ClientActivityTask[];
  meetings: ClientActivityMeeting[];
  calls: ClientActivityCall[];
  canEdit: boolean;
  editOnlyRaisedBy?: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy;
  showProjectName?: boolean;
  onEditTask: (task: ClientActivityTask) => void;
  onEditMeeting: (meeting: ClientActivityMeeting) => void;
  onEditCall: (call: ClientActivityCall) => void;
};

function ColumnShell({
  icon,
  title,
  count,
  children,
}: {
  icon: ReactNode;
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-muted/20">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <span className="text-muted-foreground">{icon}</span>
        <p className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
          {title}
        </p>
        <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground tabular-nums">
          {count}
        </span>
      </div>
      <div className="px-3 py-2">{children}</div>
    </div>
  );
}

export function ActivityColumns({
  tasks,
  meetings,
  calls,
  canEdit,
  editOnlyRaisedBy,
  showProjectName = false,
  onEditTask,
  onEditMeeting,
  onEditCall,
}: ActivityColumnsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <ColumnShell
        icon={<CheckSquare className="size-3.5" aria-hidden="true" />}
        title="Tasks"
        count={tasks.length}
      >
        <ActivityList
          kind="task"
          items={tasks}
          canEdit={canEdit}
          editOnlyRaisedBy={editOnlyRaisedBy}
          showProjectName={showProjectName}
          onEdit={onEditTask}
        />
      </ColumnShell>
      <ColumnShell
        icon={<CalendarDays className="size-3.5" aria-hidden="true" />}
        title="Meetings"
        count={meetings.length}
      >
        <ActivityList
          kind="meeting"
          items={meetings}
          canEdit={canEdit}
          editOnlyRaisedBy={editOnlyRaisedBy}
          showProjectName={showProjectName}
          onEdit={onEditMeeting}
        />
      </ColumnShell>
      <ColumnShell
        icon={<Phone className="size-3.5" aria-hidden="true" />}
        title="Calls"
        count={calls.length}
      >
        <ActivityList
          kind="call"
          items={calls}
          canEdit={canEdit}
          editOnlyRaisedBy={editOnlyRaisedBy}
          showProjectName={showProjectName}
          onEdit={onEditCall}
        />
      </ColumnShell>
    </div>
  );
}
