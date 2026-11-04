import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUserId } from "@/features/auth/AuthProvider";
import { confirm } from "@/lib/confirm";
import { useAction } from "@/lib/query";
import { createProject, deleteProject, fetchProjectById, fetchProjects, reorderProjects, updateProject, type CreateProjectInput } from "@/services/projectsService";
import type { Project } from "@/shared/types/types";

export function useProjects() {
  const userId = useUserId();
  return useQuery({ queryKey: ["projects"], queryFn: () => fetchProjects(userId) });
}

export function useProject(id: string) {
  return useQuery({ queryKey: ["projects", id], queryFn: () => fetchProjectById(id) });
}

export function useProjectActions() {
  const userId = useUserId();
  const client = useQueryClient();

  const create = useAction((input: CreateProjectInput) => createProject(userId, input), {
    success: "Project added.",
    failure: "Couldn't add the project.",
    invalidate: ["projects"],
    quietError: true,
  });
  const update = useAction(
    ({ id, updates }: { id: string; updates: Partial<Pick<Project, "name" | "color_hex" | "is_active" | "project_for">> }) => updateProject(id, updates),
    { success: "Project saved.", failure: "Couldn't save the project.", invalidate: ["projects"], quietError: true },
  );
  const setActive = useAction(({ project, isActive }: { project: Project; isActive: boolean }) => updateProject(project.id, { is_active: isActive }), {
    success: "Project updated.",
    failure: "Couldn't update the project.",
    invalidate: ["projects"],
  });
  const remove = useAction((id: string) => deleteProject(id), {
    success: "Project deleted.",
    failure: "Couldn't delete the project.",
    invalidate: ["projects", "notes", "activities", "activity-counts"],
  });
  const reorder = useAction((orderedIds: string[]) => reorderProjects(orderedIds), {
    failure: "Couldn't save the new order.",
    invalidate: ["projects"],
  });

  return {
    create,
    update,
    setActive,
    confirmDelete: async (project: Project) => {
      const ok = await confirm({
        title: `Delete ${project.name}?`,
        message: "Its notes, links and client activities go with it. This can't be undone.",
        confirmLabel: "Delete",
      });
      if (ok) remove.mutate(project.id);
      return ok;
    },
    saveOrder: (orderedIds: string[]) => {
      const positions = new Map(orderedIds.map((id, index) => [id, index + 1]));
      client.setQueryData<Project[]>(["projects"], (projects) =>
        projects?.map((project) => ({ ...project, sort_order: positions.get(project.id) ?? project.sort_order })).sort((a, b) => a.sort_order - b.sort_order),
      );
      reorder.mutate(orderedIds);
    },
  };
}
