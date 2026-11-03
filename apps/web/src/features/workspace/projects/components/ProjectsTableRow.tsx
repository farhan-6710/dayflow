import { CircleOff, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { buildProjectPath } from "@/app/constants/workspaceRoutes";
import { PROJECTS_GRID_CLASS } from "@/features/workspace/projects/constants/directory";
import type { ProjectsTableRowProps } from "@/features/workspace/projects/types/components";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { DragHandle } from "@/shared/components/DragHandle";
import { ProjectChip } from "@/shared/components/ProjectChip";
import { RowActionsMenu } from "@/shared/components/RowActionsMenu";
import { StatusPill } from "@/shared/components/StatusPill";
import { useSortableRow } from "@/shared/hooks/useSortableRow";
import { cn } from "@/shared/lib/utils";

export function ProjectsTableRow({ project, onEdit, onToggleActive, onDelete }: ProjectsTableRowProps) {
  const { setNodeRef, style, handleProps, isDragging } = useSortableRow(project.id);
  const actions = [
    ...(project.is_active ? [{ label: "Edit", icon: Pencil, onSelect: () => onEdit(project) }] : []),
    {
      label: project.is_active ? "Mark inactive" : "Mark active",
      icon: project.is_active ? CircleOff : RotateCcw,
      onSelect: () => onToggleActive(project),
    },
    { label: "Delete", icon: Trash2, destructive: true, onSelect: () => onDelete(project) },
  ];

  return (
    <DirectoryTableRow
      ref={setNodeRef}
      style={style}
      to={buildProjectPath(project.id)}
      label={`Open ${project.name}`}
      className={cn(
        "grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-x-2 gap-y-1 px-3 md:gap-x-4",
        PROJECTS_GRID_CLASS,
        isDragging && "z-10 opacity-70 shadow-md",
      )}
    >
      <DragHandle label={`Reorder ${project.name}`} handleProps={handleProps} />
      <div className="flex min-w-0 items-center gap-3">
        <ProjectChip color={project.color_hex} />
        <span className="truncate">{project.name}</span>
      </div>
      <div className="col-start-3 row-start-1 md:hidden">
        <RowActionsMenu label={`Actions for ${project.name}`} actions={actions} />
      </div>
      <p className="col-start-2 truncate text-sm text-muted-foreground md:col-start-auto">
        {project.project_for_label}
      </p>
      <div className="col-start-2 md:col-start-auto">
        <StatusPill active={project.is_active}>{project.is_active ? "Active" : "Inactive"}</StatusPill>
      </div>
      <div className="hidden md:block">
        <RowActionsMenu label={`Actions for ${project.name}`} actions={actions} />
      </div>
    </DirectoryTableRow>
  );
}
