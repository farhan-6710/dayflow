import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityMeetingVenue,
  ClientActivityPriority,
  ClientActivityStatus,
  ClientActivityTask,
} from "@/features/workspace/client-activities/types/types";
import { DEFAULT_TASK_TIME } from "@/features/workspace/tasks/constants/tasksCalendar";

export type ClientActivityTaskFormValues = {
  projectId: string;
  title: string;
  description: string;
  priority: ClientActivityPriority;
  status: ClientActivityStatus;
  etaDate: string;
  etaTime: string;
};

export type ClientActivityMeetingFormValues = {
  projectId: string;
  title: string;
  description: string;
  status: ClientActivityStatus;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  venue: ClientActivityMeetingVenue;
};

export type ClientActivityCallFormValues = {
  projectId: string;
  title: string;
  description: string;
  status: ClientActivityStatus;
  startDate: string;
  startTime: string;
  durationMinutes: string;
};

export function emptyActivityTaskForm(projectId = ""): ClientActivityTaskFormValues {
  return {
    projectId,
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    etaDate: "",
    etaTime: DEFAULT_TASK_TIME,
  };
}

export function emptyActivityMeetingForm(
  projectId = "",
): ClientActivityMeetingFormValues {
  return {
    projectId,
    title: "",
    description: "",
    status: "pending",
    fromDate: "",
    fromTime: DEFAULT_TASK_TIME,
    toDate: "",
    toTime: DEFAULT_TASK_TIME,
    venue: "online",
  };
}

export function emptyActivityCallForm(projectId = ""): ClientActivityCallFormValues {
  return {
    projectId,
    title: "",
    description: "",
    status: "pending",
    startDate: "",
    startTime: DEFAULT_TASK_TIME,
    durationMinutes: "30",
  };
}

export function activityTaskToFormValues(
  task: ClientActivityTask,
): ClientActivityTaskFormValues {
  return {
    projectId: task.project_id,
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    status: task.status,
    etaDate: task.eta_date,
    etaTime: task.eta_time,
  };
}

export function activityMeetingToFormValues(
  meeting: ClientActivityMeeting,
): ClientActivityMeetingFormValues {
  return {
    projectId: meeting.project_id,
    title: meeting.title,
    description: meeting.description ?? "",
    status: meeting.status,
    fromDate: meeting.from_date,
    fromTime: meeting.from_time,
    toDate: meeting.to_date,
    toTime: meeting.to_time,
    venue: meeting.venue,
  };
}

export function activityCallToFormValues(
  call: ClientActivityCall,
): ClientActivityCallFormValues {
  return {
    projectId: call.project_id,
    title: call.title,
    description: call.description ?? "",
    status: call.status,
    startDate: call.start_date,
    startTime: call.start_time,
    durationMinutes: String(call.duration_minutes),
  };
}

export function isClientActivityOpen(status: ClientActivityStatus): boolean {
  return status !== "completed";
}
