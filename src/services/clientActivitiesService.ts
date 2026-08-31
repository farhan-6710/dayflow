import type {
  ClientActivityCall,
  ClientActivityMeeting,
  ClientActivityProjectJoinRow,
  ClientActivityTask,
  CreateClientActivityCallInput,
  CreateClientActivityMeetingInput,
  CreateClientActivityTaskInput,
  UpdateClientActivityCallInput,
  UpdateClientActivityMeetingInput,
  UpdateClientActivityTaskInput,
} from "@/features/admin/client-activities/types/types";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

const PROJECT_JOIN = "project:projects!inner(id, name, project_for)";

function projectNameFromJoin(
  related: ClientActivityProjectJoinRow["project"],
): string | undefined {
  if (!related) return undefined;
  const project = Array.isArray(related) ? related[0] : related;
  return project?.name;
}

function mapTask(row: ClientActivityTask & ClientActivityProjectJoinRow): ClientActivityTask {
  const { project, ...task } = row;
  return {
    ...task,
    project_name: projectNameFromJoin(project),
  };
}

function mapMeeting(
  row: ClientActivityMeeting & ClientActivityProjectJoinRow,
): ClientActivityMeeting {
  const { project, ...meeting } = row;
  return {
    ...meeting,
    project_name: projectNameFromJoin(project),
  };
}

function mapCall(row: ClientActivityCall & ClientActivityProjectJoinRow): ClientActivityCall {
  const { project, ...call } = row;
  return {
    ...call,
    project_name: projectNameFromJoin(project),
  };
}

export async function fetchClientActivityTasksByProjectId(
  projectId: string,
): Promise<ClientActivityTask[]> {
  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_TASKS.TABLE)
    .select(DB.CLIENT_ACTIVITY_TASKS.SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ClientActivityTask[];
}

export async function fetchClientActivityTasksByClientId(
  clientId: string,
): Promise<ClientActivityTask[]> {
  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_TASKS.TABLE)
    .select(`${DB.CLIENT_ACTIVITY_TASKS.SELECT}, ${PROJECT_JOIN}`)
    .eq("project.project_for", clientId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as (ClientActivityTask & ClientActivityProjectJoinRow)[]).map(
    mapTask,
  );
}

export async function createClientActivityTask(
  projectId: string,
  input: CreateClientActivityTaskInput,
): Promise<ClientActivityTask> {
  if (!projectId.trim()) {
    throw new Error("Project is required.");
  }
  const title = input.title.trim();
  if (!title) throw new Error("Task title is required.");

  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_TASKS.TABLE)
    .insert({
      project_id: projectId,
      title,
      description: input.description?.trim() || null,
      priority: input.priority,
      status: input.status,
      eta_date: input.etaDate,
      eta_time: input.etaTime,
      raised_by: input.raisedBy ?? "workspace",
    })
    .select(DB.CLIENT_ACTIVITY_TASKS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to create activity task.");
  return data as ClientActivityTask;
}

export async function updateClientActivityTask(
  taskId: string,
  input: UpdateClientActivityTaskInput,
): Promise<ClientActivityTask> {
  const cols: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Task title is required.");
    cols.title = title;
  }
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.priority !== undefined) cols.priority = input.priority;
  if (input.status !== undefined) cols.status = input.status;
  if (input.etaDate !== undefined) cols.eta_date = input.etaDate;
  if (input.etaTime !== undefined) cols.eta_time = input.etaTime;

  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_TASKS.TABLE)
    .update(cols)
    .eq("id", taskId)
    .select(DB.CLIENT_ACTIVITY_TASKS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update activity task.");
  return data as ClientActivityTask;
}

export async function deleteClientActivityTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.CLIENT_ACTIVITY_TASKS.TABLE)
    .delete()
    .eq("id", taskId);

  if (error) throw new Error(error.message ?? "Failed to delete activity task.");
}

export async function fetchClientActivityMeetingsByProjectId(
  projectId: string,
): Promise<ClientActivityMeeting[]> {
  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_MEETINGS.TABLE)
    .select(DB.CLIENT_ACTIVITY_MEETINGS.SELECT)
    .eq("project_id", projectId)
    .order("from_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ClientActivityMeeting[];
}

export async function fetchClientActivityMeetingsByClientId(
  clientId: string,
): Promise<ClientActivityMeeting[]> {
  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_MEETINGS.TABLE)
    .select(`${DB.CLIENT_ACTIVITY_MEETINGS.SELECT}, ${PROJECT_JOIN}`)
    .eq("project.project_for", clientId)
    .order("from_date", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as (ClientActivityMeeting & ClientActivityProjectJoinRow)[]).map(
    mapMeeting,
  );
}

export async function createClientActivityMeeting(
  projectId: string,
  input: CreateClientActivityMeetingInput,
): Promise<ClientActivityMeeting> {
  if (!projectId.trim()) {
    throw new Error("Project is required.");
  }
  const title = input.title.trim();
  if (!title) throw new Error("Meeting title is required.");

  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_MEETINGS.TABLE)
    .insert({
      project_id: projectId,
      title,
      description: input.description?.trim() || null,
      status: input.status,
      from_date: input.fromDate,
      from_time: input.fromTime,
      to_date: input.toDate,
      to_time: input.toTime,
      venue: input.venue,
      raised_by: input.raisedBy ?? "workspace",
    })
    .select(DB.CLIENT_ACTIVITY_MEETINGS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to create activity meeting.");
  return data as ClientActivityMeeting;
}

export async function updateClientActivityMeeting(
  meetingId: string,
  input: UpdateClientActivityMeetingInput,
): Promise<ClientActivityMeeting> {
  const cols: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Meeting title is required.");
    cols.title = title;
  }
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.status !== undefined) cols.status = input.status;
  if (input.fromDate !== undefined) cols.from_date = input.fromDate;
  if (input.fromTime !== undefined) cols.from_time = input.fromTime;
  if (input.toDate !== undefined) cols.to_date = input.toDate;
  if (input.toTime !== undefined) cols.to_time = input.toTime;
  if (input.venue !== undefined) cols.venue = input.venue;

  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_MEETINGS.TABLE)
    .update(cols)
    .eq("id", meetingId)
    .select(DB.CLIENT_ACTIVITY_MEETINGS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update activity meeting.");
  return data as ClientActivityMeeting;
}

export async function deleteClientActivityMeeting(
  meetingId: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.CLIENT_ACTIVITY_MEETINGS.TABLE)
    .delete()
    .eq("id", meetingId);

  if (error) throw new Error(error.message ?? "Failed to delete activity meeting.");
}

export async function fetchClientActivityCallsByProjectId(
  projectId: string,
): Promise<ClientActivityCall[]> {
  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_CALLS.TABLE)
    .select(DB.CLIENT_ACTIVITY_CALLS.SELECT)
    .eq("project_id", projectId)
    .order("start_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ClientActivityCall[];
}

export async function fetchClientActivityCallsByClientId(
  clientId: string,
): Promise<ClientActivityCall[]> {
  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_CALLS.TABLE)
    .select(`${DB.CLIENT_ACTIVITY_CALLS.SELECT}, ${PROJECT_JOIN}`)
    .eq("project.project_for", clientId)
    .order("start_date", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as (ClientActivityCall & ClientActivityProjectJoinRow)[]).map(
    mapCall,
  );
}

export async function createClientActivityCall(
  projectId: string,
  input: CreateClientActivityCallInput,
): Promise<ClientActivityCall> {
  if (!projectId.trim()) {
    throw new Error("Project is required.");
  }
  const title = input.title.trim();
  if (!title) throw new Error("Call title is required.");
  if (input.durationMinutes <= 0) {
    throw new Error("Call duration must be greater than zero.");
  }

  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_CALLS.TABLE)
    .insert({
      project_id: projectId,
      title,
      description: input.description?.trim() || null,
      status: input.status,
      start_date: input.startDate,
      start_time: input.startTime,
      duration_minutes: input.durationMinutes,
      raised_by: input.raisedBy ?? "workspace",
    })
    .select(DB.CLIENT_ACTIVITY_CALLS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to create activity call.");
  return data as ClientActivityCall;
}

export async function updateClientActivityCall(
  callId: string,
  input: UpdateClientActivityCallInput,
): Promise<ClientActivityCall> {
  const cols: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Call title is required.");
    cols.title = title;
  }
  if (input.description !== undefined) {
    cols.description = input.description?.trim() || null;
  }
  if (input.status !== undefined) cols.status = input.status;
  if (input.startDate !== undefined) cols.start_date = input.startDate;
  if (input.startTime !== undefined) cols.start_time = input.startTime;
  if (input.durationMinutes !== undefined) {
    if (input.durationMinutes <= 0) {
      throw new Error("Call duration must be greater than zero.");
    }
    cols.duration_minutes = input.durationMinutes;
  }

  const { data, error } = await supabase
    .from(DB.CLIENT_ACTIVITY_CALLS.TABLE)
    .update(cols)
    .eq("id", callId)
    .select(DB.CLIENT_ACTIVITY_CALLS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update activity call.");
  return data as ClientActivityCall;
}

export async function deleteClientActivityCall(callId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.CLIENT_ACTIVITY_CALLS.TABLE)
    .delete()
    .eq("id", callId);

  if (error) throw new Error(error.message ?? "Failed to delete activity call.");
}
