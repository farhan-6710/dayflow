import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ProjectsTableRow } from "@/features/workspace/projects/components/ProjectsTableRow";
import type { ProjectsTableRowProps } from "@/features/workspace/projects/types/components";

export function SortableProjectsTableRow(props: ProjectsTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.project.id });

  return (
    <ProjectsTableRow
      {...props}
      setSortableRef={setNodeRef}
      dragHandleAttributes={attributes}
      dragHandleListeners={listeners}
      isDragging={isDragging}
      sortableStyle={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    />
  );
}
