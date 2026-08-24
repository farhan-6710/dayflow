import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export type Project = {
  id: string;
  user_id: string;
  name: string;
  color_hex: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateProjectInput = {
  name: string;
  color_hex?: string;
};

export async function fetchProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Project[]) ?? [];
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .select(DB.PROJECTS.SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as Project | null) ?? null;
}

export async function createProject(userId: string, input: CreateProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .insert({
      user_id: userId,
      name: input.name,
      color_hex: input.color_hex ?? "#ff7e21",
      is_archived: false,
    })
    .select(DB.PROJECTS.SELECT)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, "name" | "color_hex" | "is_archived">>
): Promise<Project> {
  const { data, error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .update(updates)
    .eq("id", id)
    .select(DB.PROJECTS.SELECT)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PROJECTS.TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
}
