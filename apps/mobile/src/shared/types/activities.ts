export type ClientActivityStatus = "pending" | "in_progress" | "completed";
export type ClientActivityPriority = "low" | "medium" | "high";
export type ClientActivityMeetingVenue =
  | "client_location"
  | "in_office"
  | "online";

type ClientActivityProjectJoin = {
  id: string;
  name: string;
  project_for: string | null;
};

export type ClientActivityTask = {
  id: string;
  project_id: string;
  project_name?: string;
  title: string;
  description: string | null;
  priority: ClientActivityPriority;
  status: ClientActivityStatus;
  eta_date: string;
  eta_time: string;
  raised_by: ClientActivityRaisedBy;
  created_at: string;
  updated_at: string;
};

export type ClientActivityMeeting = {
  id: string;
  project_id: string;
  project_name?: string;
  title: string;
  description: string | null;
  status: ClientActivityStatus;
  from_date: string;
  from_time: string;
  to_date: string;
  to_time: string;
  venue: ClientActivityMeetingVenue;
  raised_by: ClientActivityRaisedBy;
  created_at: string;
  updated_at: string;
};

export type ClientActivityCall = {
  id: string;
  project_id: string;
  project_name?: string;
  title: string;
  description: string | null;
  status: ClientActivityStatus;
  start_date: string;
  start_time: string;
  duration_minutes: number;
  raised_by: ClientActivityRaisedBy;
  created_at: string;
  updated_at: string;
};

export type CreateClientActivityTaskInput = {
  title: string;
  description?: string | null;
  priority: ClientActivityPriority;
  status: ClientActivityStatus;
  etaDate: string;
  etaTime: string;
  raisedBy?: ClientActivityRaisedBy;
};

export type ClientActivityRaisedBy = "workspace" | "client";

export type UpdateClientActivityTaskInput = Partial<CreateClientActivityTaskInput>;

export type CreateClientActivityMeetingInput = {
  title: string;
  description?: string | null;
  status: ClientActivityStatus;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  venue: ClientActivityMeetingVenue;
  raisedBy?: ClientActivityRaisedBy;
};

export type UpdateClientActivityMeetingInput =
  Partial<CreateClientActivityMeetingInput>;

export type CreateClientActivityCallInput = {
  title: string;
  description?: string | null;
  status: ClientActivityStatus;
  startDate: string;
  startTime: string;
  durationMinutes: number;
  raisedBy?: ClientActivityRaisedBy;
};

export type UpdateClientActivityCallInput = Partial<CreateClientActivityCallInput>;

export type ClientActivityProjectJoinRow = {
  project?: ClientActivityProjectJoin | ClientActivityProjectJoin[] | null;
};
