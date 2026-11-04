import type {
  ClientActivityMeetingVenue,
  ClientActivityPriority,
  ClientActivityStatus,
} from "@/shared/types/activities";

export const STATUS_LABELS: Record<ClientActivityStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};

export const PRIORITY_LABELS: Record<ClientActivityPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const VENUE_LABELS: Record<ClientActivityMeetingVenue, string> = {
  client_location: "Client location",
  in_office: "In office",
  online: "Online",
};

function toOptions<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

export const statusOptions = toOptions(STATUS_LABELS);
export const priorityOptions = toOptions(PRIORITY_LABELS);
export const venueOptions = toOptions(VENUE_LABELS);
