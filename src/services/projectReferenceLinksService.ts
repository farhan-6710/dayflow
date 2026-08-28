import type {
  CreateProjectReferenceLinkInput,
  ProjectReferenceLink,
} from "@/features/projects/types/referenceLinks";
import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";

export async function fetchProjectReferenceLinks(
  projectId: string,
): Promise<ProjectReferenceLink[]> {
  const { data, error } = await supabase
    .from(DB.PROJECT_REFERENCE_LINKS.TABLE)
    .select(DB.PROJECT_REFERENCE_LINKS.SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProjectReferenceLink[];
}

export async function createProjectReferenceLink(
  userId: string,
  projectId: string,
  input: CreateProjectReferenceLinkInput,
): Promise<ProjectReferenceLink> {
  const url = input.url.trim();
  if (!url) throw new Error("Reference link URL is required.");

  const label = input.label?.trim() || null;

  const { data, error } = await supabase
    .from(DB.PROJECT_REFERENCE_LINKS.TABLE)
    .insert({ user_id: userId, project_id: projectId, url, label })
    .select(DB.PROJECT_REFERENCE_LINKS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to add reference link.");
  return data as ProjectReferenceLink;
}

export async function updateProjectReferenceLink(
  linkId: string,
  input: CreateProjectReferenceLinkInput,
): Promise<ProjectReferenceLink> {
  const url = input.url.trim();
  if (!url) throw new Error("Reference link URL is required.");

  const label = input.label?.trim() || null;

  const { data, error } = await supabase
    .from(DB.PROJECT_REFERENCE_LINKS.TABLE)
    .update({ url, label })
    .eq("id", linkId)
    .select(DB.PROJECT_REFERENCE_LINKS.SELECT)
    .single();

  if (error) throw new Error(error.message ?? "Failed to update reference link.");
  return data as ProjectReferenceLink;
}

export async function deleteProjectReferenceLink(linkId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.PROJECT_REFERENCE_LINKS.TABLE)
    .delete()
    .eq("id", linkId);

  if (error) throw new Error(error.message ?? "Failed to delete reference link.");
}
