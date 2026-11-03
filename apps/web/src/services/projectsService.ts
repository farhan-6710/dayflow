import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { Project } from "@/shared/types/types";

export type CreateProjectInput = {
  name: string;
  color_hex?: string;
  project_for?: string | null;
};

export const MYSELF_PROJECT_LABEL = "Myself";

type ProjectRow = Omit<Project, "project_for_label"> & {
  project_for_client?: { company_name: string } | { company_name: string }[] | null;
};

function bySortOrder(a: Project, b: Project) {
  return a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at);
}

function mapProject({ project_for_client: related, ...project }: ProjectRow): Project {
  const client = Array.isArray(related) ? related[0] : related;
  return {
    ...project,
    project_for: project.project_for ?? null,
    sort_order: project.sort_order ?? 0,
    project_for_label: client?.company_name?.trim() || MYSELF_PROJECT_LABEL,
  };
}

export async function fetchProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("user_id", userId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data as unknown as ProjectRow[]) ?? []).map(mapProject).sort(bySortOrder);
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProject(data as unknown as ProjectRow) : null;
}

export async function fetchProjectsByClientId(userId: string, clientId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("user_id", userId)
    .eq("project_for", clientId)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return ((data as unknown as ProjectRow[]) ?? []).map(mapProject).sort(bySortOrder);
}

/** New projects go to the top of the list. */
export async function createProject(userId: string, input: CreateProjectInput): Promise<Project> {
  const { data: existingRows, error: existingError } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select("id")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (existingError) throw existingError;

  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .insert({
      user_id: userId,
      name: input.name,
      color_hex: input.color_hex,
      project_for: input.project_for ?? null,
      is_active: true,
      sort_order: 1,
    })
    .select(DB.PROJECTS.SELECT)
    .single();

  if (error) throw error;

  const created = mapProject(data as unknown as ProjectRow);
  await reorderProjects([created.id, ...((existingRows as { id: string }[] | null) ?? []).map((row) => row.id)]);
  return { ...created, sort_order: 1 };
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, "name" | "color_hex" | "is_active" | "project_for">>,
): Promise<Project> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.PROJECTS.SELECT)
    .single();

  if (error) throw error;
  return mapProject(data as unknown as ProjectRow);
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from(DB.PROJECTS.TABLE).update({ sort_order: index + 1 }).eq("id", id),
    ),
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from(DB.PROJECTS.TABLE).delete().eq("id", id);
  if (error) throw error;
}
