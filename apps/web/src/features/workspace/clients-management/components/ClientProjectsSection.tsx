import { Folder, Plus } from "lucide-react";
import { Link } from "react-router";

import { buildProjectDetailPath } from "@/features/workspace/projects/constants/routes";
import type { Project } from "@/services/projectsService";
import { Button } from "@/shared/ui/button";
import { StatusPill } from "@/shared/components/StatusPill";
import { cn } from "@/shared/lib/utils";
import { raisedStaticPanelClassName } from "@/shared/constants/layoutStyles";
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
    <div className={raisedStaticPanelClassName}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div>
          <h2 className="pl-1 text-2xl leading-none font-bold">
            Projects
          </h2>
          <p className="mt-2 pl-1 text-sm text-foreground/75">
            Projects linked to this client.
          </p>
        </div>
        {canAddProject ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddProject}
          >
            <Plus className="size-3.5" />
            New Project
          </Button>
        ) : null}
      </div>

      <div className="px-5 pb-5">
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
                <Plus className="size-3.5" />
                Create project
              </Button>
            ) : null}
          </div>
        ) : (
          <ul className="space-y-2.5">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  to={buildProjectDetailPath(project.id)}
                  className={cn(
                    "surface-chip bg-[color-mix(in_srgb,var(--tint)_5%,var(--card))] group flex items-center gap-3 rounded-[0.8rem] px-4 py-2.5",
                    "text-sm font-medium text-foreground transition-[filter,transform] hover:-translate-y-px hover:brightness-[1.02]",
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
                  <StatusPill active={project.is_active} className="shrink-0">
                    {project.is_active ? "Active" : "Inactive"}
                  </StatusPill>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
