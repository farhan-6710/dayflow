import { resolveProjectForLabel } from "@/features/admin/projects/utils/projectFor";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export type Project = {
  id: string;
  user_id: string;
  name: string;
  color_hex: string;
  is_archived: boolean;
  project_for: string | null;
  project_for_label: string;
  created_at: string;
  updated_at: string;
};

export type CreateProjectInput = {
  name: string;
  color_hex?: string;
  project_for?: string | null;
};

type ProjectRow = Omit<Project, "project_for_label"> & {
  project_for_client?: { company_name: string } | { company_name: string }[] | null;
};

function companyNameFromJoin(
  related: ProjectRow["project_for_client"],
): string | null {
  if (!related) return null;
  const client = Array.isArray(related) ? related[0] : related;
  return client?.company_name ?? null;
}

function mapProject(row: ProjectRow): Project {
  const { project_for_client: related, ...project } = row;
  return {
    ...project,
    project_for: project.project_for ?? null,
    project_for_label: resolveProjectForLabel(
      project.project_for ?? null,
      companyNameFromJoin(related),
    ),
  };
}

export async function fetchProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data as ProjectRow[]) ?? []).map(mapProject);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProject(data as ProjectRow) : null;
}

export async function fetchProjectsByClientId(
  userId: string,
  clientId: string,
): Promise<Project[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("user_id", userId)
    .eq("project_for", clientId)
    .order("name", { ascending: true });

  if (error) throw error;
  return ((data as ProjectRow[]) ?? []).map(mapProject);
}

export async function fetchProjectsForClientPortal(): Promise<Project[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("is_archived", false)
    .order("name", { ascending: true });

  if (error) throw error;
  return ((data as ProjectRow[]) ?? []).map(mapProject);
}

export async function createProject(userId: string, input: CreateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .insert({
      user_id: userId,
      name: input.name,
      color_hex: input.color_hex ?? "#ff7e21",
      project_for: input.project_for ?? null,
      is_archived: false,
    })
    .select(DB.PROJECTS.SELECT)
    .single();

  if (error) throw error;
  return mapProject(data as ProjectRow);
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, "name" | "color_hex" | "is_archived" | "project_for">>,
): Promise<Project> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.PROJECTS.SELECT)
    .single();

  if (error) throw error;
  return mapProject(data as ProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
}
