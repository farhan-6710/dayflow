import { Archive, Edit, Folder, MoreVertical, Trash2 } from "lucide-react";

import { PROJECTS_DIRECTORY_ROW_GRID_CLASS } from "@/features/admin/projects/constants/projectsDirectory";
import { buildProjectDetailPath } from "@/features/admin/projects/constants/routes";
import type { ProjectsTableRowProps } from "@/features/admin/projects/types/components";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
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
    <DirectoryTableRow
      to={buildProjectDetailPath(project.id)}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        PROJECTS_DIRECTORY_ROW_GRID_CLASS,
        !isActive && "opacity-80",
      )}
    >
      <div className="min-w-0 text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          PROJECT NAME
        </span>
        <span className="flex min-w-0 items-center gap-3">
          <span
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
            style={{ backgroundColor: project.color_hex }}
            title={project.color_hex}
            aria-label={`Project color ${project.color_hex}`}
          >
            <Folder className="size-4" />
          </span>
          <span className="truncate">{project.name}</span>
        </span>
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

      <div
        className="flex justify-end text-right"
        onClick={stopDirectoryRowNav}
        onKeyDown={(event) => event.stopPropagation()}
      >
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
              <Archive className="mr-2 size-4" />{" "}
              {isActive ? "Archive" : "Restore"}
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
    </DirectoryTableRow>
  );
}
