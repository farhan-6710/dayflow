import {
  CircleOff,
  Edit,
  Folder,
  GripVertical,
  MoreVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import type { CSSProperties } from "react";

import { PROJECTS_DIRECTORY_ROW_GRID_CLASS } from "@/features/workspace/projects/constants/projectsDirectory";
import { buildProjectDetailPath } from "@/features/workspace/projects/constants/routes";
import type { ProjectsTableRowProps } from "@/features/workspace/projects/types/components";
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

type ProjectsTableRowViewProps = ProjectsTableRowProps & {
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: DraggableSyntheticListeners;
  sortableStyle?: CSSProperties;
  setSortableRef?: (node: HTMLElement | null) => void;
  isDragging?: boolean;
};

export function ProjectsTableRow({
  project,
  onEditProject,
  onToggleActive,
  onDeleteProject,
  dragHandleAttributes,
  dragHandleListeners,
  sortableStyle,
  setSortableRef,
  isDragging = false,
}: ProjectsTableRowViewProps) {
  const isActive = project.is_active;

  return (
    <DirectoryTableRow
      ref={setSortableRef}
      to={buildProjectDetailPath(project.id)}
      style={sortableStyle}
      className={cn(
        "grid items-center gap-2 px-6 py-4 sm:gap-4",
        PROJECTS_DIRECTORY_ROW_GRID_CLASS,
        !isActive && "opacity-80",
        isDragging && "relative z-10 bg-card/90 opacity-70",
      )}
    >
      <div
        className="flex items-center justify-center"
        onClick={stopDirectoryRowNav}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="flex size-7 cursor-grab items-center justify-center text-muted-foreground touch-none hover:text-foreground active:cursor-grabbing"
          aria-label={`Reorder ${project.name}`}
          {...dragHandleAttributes}
          {...dragHandleListeners}
        >
          <GripVertical className="size-4" />
        </button>
      </div>

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
            isActive ? "text-primary-text" : "text-muted-foreground",
          )}
        >
          {isActive ? "Active" : "Inactive"}
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
            <DropdownMenuItem onClick={() => onToggleActive(project)}>
              {isActive ? (
                <CircleOff className="mr-2 size-4" />
              ) : (
                <RotateCcw className="mr-2 size-4" />
              )}
              {isActive ? "Mark as inactive" : "Mark as active"}
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
