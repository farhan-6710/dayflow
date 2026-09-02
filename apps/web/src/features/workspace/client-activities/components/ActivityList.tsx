import { Pencil } from "lucide-react";

import {
  CLIENT_ACTIVITY_PRIORITY_LABELS,
  CLIENT_ACTIVITY_STATUS_LABELS,
} from "@/features/workspace/client-activities/constants/activityStatuses";
import { CLIENT_ACTIVITY_MEETING_VENUE_LABELS } from "@/features/workspace/client-activities/constants/meetingVenues";
import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityTask,
} from "@/features/workspace/client-activities/types/types";
import { formatActivityDateTime } from "@/features/workspace/client-activities/utils/activityDisplayUtils";
import { Button } from "@/shared/ui/button";

function taskMeta(task: ClientActivityTask, showProjectName: boolean): string {
  const parts = [
    showProjectName && task.project_name ? task.project_name : null,
    formatActivityDateTime(task.eta_date, task.eta_time),
    CLIENT_ACTIVITY_PRIORITY_LABELS[task.priority],
    CLIENT_ACTIVITY_STATUS_LABELS[task.status],
  ].filter(Boolean);
  return parts.join(" · ");
}

function meetingMeta(
  meeting: ClientActivityMeeting,
  showProjectName: boolean,
): string {
  const parts = [
    showProjectName && meeting.project_name ? meeting.project_name : null,
    `${formatActivityDateTime(meeting.from_date, meeting.from_time)} → ${formatActivityDateTime(meeting.to_date, meeting.to_time)}`,
    CLIENT_ACTIVITY_MEETING_VENUE_LABELS[meeting.venue],
  ].filter(Boolean);
  return parts.join(" · ");
}

function callMeta(call: ClientActivityCall, showProjectName: boolean): string {
  const parts = [
    showProjectName && call.project_name ? call.project_name : null,
    formatActivityDateTime(call.start_date, call.start_time),
    `${call.duration_minutes} min`,
    CLIENT_ACTIVITY_STATUS_LABELS[call.status],
  ].filter(Boolean);
  return parts.join(" · ");
}

type ActivityListProps =
  | {
      kind: "task";
      items: ClientActivityTask[];
      canEdit: boolean;
      editOnlyRaisedBy?: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy;
      showProjectName?: boolean;
      onEdit: (item: ClientActivityTask) => void;
    }
  | {
      kind: "meeting";
      items: ClientActivityMeeting[];
      canEdit: boolean;
      editOnlyRaisedBy?: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy;
      showProjectName?: boolean;
      onEdit: (item: ClientActivityMeeting) => void;
    }
  | {
      kind: "call";
      items: ClientActivityCall[];
      canEdit: boolean;
      editOnlyRaisedBy?: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy;
      showProjectName?: boolean;
      onEdit: (item: ClientActivityCall) => void;
    };

function canEditActivityItem(
  canEdit: boolean,
  item: { raised_by: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy },
  editOnlyRaisedBy?: import("@/features/workspace/client-activities/types/types").ClientActivityRaisedBy,
) {
  if (!canEdit) return false;
  if (!editOnlyRaisedBy) return true;
  return item.raised_by === editOnlyRaisedBy;
}

export function ActivityList(props: ActivityListProps) {
  const { items, canEdit, editOnlyRaisedBy, showProjectName = false } = props;

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        No records found
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const meta =
          props.kind === "task"
            ? taskMeta(item as ClientActivityTask, showProjectName)
            : props.kind === "meeting"
              ? meetingMeta(item as ClientActivityMeeting, showProjectName)
              : callMeta(item as ClientActivityCall, showProjectName);

        return (
          <li
            key={item.id}
            className="flex items-start gap-2 py-2.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {meta}
              </p>
            </div>
            {canEditActivityItem(canEdit, item, editOnlyRaisedBy) ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-muted-foreground"
                aria-label={`Edit ${props.kind}`}
                onClick={() => {
                  if (props.kind === "task") props.onEdit(item as ClientActivityTask);
                  else if (props.kind === "meeting")
                    props.onEdit(item as ClientActivityMeeting);
                  else props.onEdit(item as ClientActivityCall);
                }}
              >
                <Pencil className="size-3.5" />
              </Button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
