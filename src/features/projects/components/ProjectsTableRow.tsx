import { Archive, Edit, Folder, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "react-router";

import { PROJECTS_DIRECTORY_ROW_GRID_CLASS } from "@/features/projects/constants/projectsDirectory";
import type { ProjectsTableRowProps } from "@/features/projects/types/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function ProjectsTableRow({
  project,
  onEditProject,
  onToggleArchive,
  onDeleteProject,
}: ProjectsTableRowProps) {
  const isActive = !project.is_archived;

  return (
    <div
      className={cn(
        "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
        PROJECTS_DIRECTORY_ROW_GRID_CLASS,
        !isActive && "opacity-80",
      )}
    >
      <div>
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          COLOR
        </span>
        <span
          className="inline-flex size-9 items-center justify-center rounded-xl text-white shadow-xs"
          style={{ backgroundColor: project.color_hex }}
          title={project.color_hex}
          aria-label={`Project color ${project.color_hex}`}
        >
          <Folder className="size-4" />
        </span>
      </div>

      <div className="min-w-0 text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PROJECT NAME
        </span>
        <Link
          to={`/projects-management/${project.id}`}
          className="truncate text-primary hover:underline"
        >
          {project.name}
        </Link>
      </div>

      <div className="min-w-0 text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PROJECT FOR
        </span>
        <span className="truncate">{project.project_for_label}</span>
      </div>

      <div>
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          STATUS
        </span>
        <span
          className={cn(
            "text-sm font-medium",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {isActive ? "Active" : "Archived"}
        </span>
      </div>

      <div className="flex justify-end text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="size-4" />
              <span className="sr-only">Project actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isActive ? (
              <DropdownMenuItem onClick={() => onEditProject(project)}>
                <Edit className="mr-2 size-4" /> Edit
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={() => onToggleArchive(project)}>
              <Archive className="mr-2 size-4" /> {isActive ? "Archive" : "Restore"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteProject(project.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
