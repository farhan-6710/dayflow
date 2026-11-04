import { Folder, Plus } from "lucide-react";
import { Link } from "react-router";

import { buildProjectPath } from "@/app/constants/workspaceRoutes";
import type { ClientProjectsSectionProps } from "@/features/workspace/clients-management/types/components";
import { EmptyState } from "@/shared/components/EmptyState";
import { PanelHeading } from "@/shared/components/PanelHeading";
import { ProjectChip } from "@/shared/components/ProjectChip";
import { StatusPill } from "@/shared/components/StatusPill";
import { Reveal } from "@/shared/components/Reveal";
import { panelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

export function ClientProjectsSection({ projects, canAdd, onAdd }: ClientProjectsSectionProps) {
  return (
    <Reveal as="section" className={cn(panelClassName, "min-w-0 p-5")}>
      <PanelHeading
        icon={Folder}
        title="Projects"
        action={
          canAdd ? (
            <Button variant="outline" className="h-10" onClick={onAdd}>
              <Plus aria-hidden="true" />
              New Project
            </Button>
          ) : null
        }
      />
      {projects.length === 0 ? (
        <EmptyState
          bare
          className="py-6"
          image="icon-empty-projects"
          title="No projects yet"
          description="Projects you create for this client appear in their portal."
        />
      ) : (
        <ul className="mt-2">
          {projects.map((project) => (
            <li key={project.id} className="border-b border-border last:border-b-0">
              <Link
                to={buildProjectPath(project.id)}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <ProjectChip color={project.color_hex} />
                <span className="min-w-0 flex-1 truncate">{project.name}</span>
                <StatusPill active={project.is_active}>{project.is_active ? "Active" : "Inactive"}</StatusPill>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
