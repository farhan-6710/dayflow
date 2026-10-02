import { Folder, Plus } from "lucide-react";
import { Link } from "react-router";

import { buildProjectDetailPath } from "@/features/workspace/projects/constants/routes";
import type { Project } from "@/services/projectsService";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type ClientProjectsSectionProps = {
  projects: Project[];
  isLoading?: boolean;
  canAddProject?: boolean;
  onAddProject: () => void;
};

export function ClientProjectsSection({
  projects,
  isLoading = false,
  canAddProject = true,
  onAddProject,
}: ClientProjectsSectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-6 py-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Projects
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Projects linked to this client.
          </p>
        </div>
        {canAddProject ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={onAddProject}
          >
            <Plus className="mr-1.5 size-3.5" />
            New Project
          </Button>
        ) : null}
      </div>

      <div className="px-6 py-5">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading projects...
          </p>
        ) : projects.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No projects for this client yet.
            </p>
            {canAddProject ? (
              <Button
                type="button"
                size="sm"
                className="mt-3"
                onClick={onAddProject}
              >
                <Plus className="mr-1.5 size-3.5" />
                Create project
              </Button>
            ) : null}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  to={buildProjectDetailPath(project.id)}
                  className={cn(
                    "flex items-center gap-3 py-3 first:pt-0 last:pb-0",
                    "text-sm font-medium text-foreground hover:text-primary",
                    !project.is_active && "opacity-70",
                  )}
                >
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                    style={{ backgroundColor: project.color_hex }}
                    aria-hidden="true"
                  >
                    <Folder className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{project.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {project.is_active ? "Active" : "Inactive"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
