import type {
  ClientActivityPriority,
  ClientActivityStatus,
} from "@/features/workspace/client-activities/types/types";

export const CLIENT_ACTIVITY_STATUSES: ClientActivityStatus[] = [
  "pending",
  "in_progress",
  "completed",
];

export const CLIENT_ACTIVITY_STATUS_LABELS: Record<ClientActivityStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};

export const CLIENT_ACTIVITY_PRIORITIES: ClientActivityPriority[] = [
  "low",
  "medium",
  "high",
];

export const CLIENT_ACTIVITY_PRIORITY_LABELS: Record<
  ClientActivityPriority,
  string
> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
