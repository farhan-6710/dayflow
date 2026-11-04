import { format } from "date-fns";

import { STATUS_LABELS, VENUE_LABELS } from "@/shared/constants/activityOptions";
import type { ClientActivityCall, ClientActivityMeeting, ClientActivityRaisedBy, ClientActivityStatus, ClientActivityTask } from "@/shared/types/activities";
import { parseDateValue } from "@/shared/utils/dateValue";
import type { PillTone } from "@/ui/StatusPill";

export type ActivityKind = "task" | "meeting" | "call";

export type ActivityItem = {
  kind: ActivityKind;
  id: string;
  projectId: string;
  projectName?: string;
  title: string;
  status: ClientActivityStatus;
  raisedBy: ClientActivityRaisedBy;
  meta: string;
  createdAt: string;
  raw: ClientActivityTask | ClientActivityMeeting | ClientActivityCall;
};

export type ActivityBundle = { tasks: ActivityItem[]; meetings: ActivityItem[]; calls: ActivityItem[] };

export const ACTIVITY_STATUS_TONE: Record<ClientActivityStatus, PillTone> = {
  pending: "muted",
  in_progress: "progress",
  completed: "success",
};

export const ACTIVITY_KINDS: { value: ActivityKind; label: string; plural: string }[] = [
  { value: "task", label: "Task", plural: "Tasks" },
  { value: "meeting", label: "Meeting", plural: "Meetings" },
  { value: "call", label: "Call", plural: "Calls" },
];

export function statusLabel(status: ClientActivityStatus) {
  return STATUS_LABELS[status];
}

function when(date: string, time: string) {
  const parsed = parseDateValue(date);
  return `${parsed ? format(parsed, "MMM d, yyyy") : date} · ${time}`;
}

export function taskItem(task: ClientActivityTask): ActivityItem {
  return { kind: "task", id: task.id, projectId: task.project_id, projectName: task.project_name, title: task.title, status: task.status, raisedBy: task.raised_by, createdAt: task.created_at, raw: task, meta: `Due ${when(task.eta_date, task.eta_time)} · ${task.priority} priority` };
}

export function meetingItem(meeting: ClientActivityMeeting): ActivityItem {
  return { kind: "meeting", id: meeting.id, projectId: meeting.project_id, projectName: meeting.project_name, title: meeting.title, status: meeting.status, raisedBy: meeting.raised_by, createdAt: meeting.created_at, raw: meeting, meta: `${when(meeting.from_date, meeting.from_time)} · ${VENUE_LABELS[meeting.venue]}` };
}

export function callItem(call: ClientActivityCall): ActivityItem {
  return { kind: "call", id: call.id, projectId: call.project_id, projectName: call.project_name, title: call.title, status: call.status, raisedBy: call.raised_by, createdAt: call.created_at, raw: call, meta: `${when(call.start_date, call.start_time)} · ${call.duration_minutes} min` };
}
