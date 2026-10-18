import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ProjectNotesTableRow } from "@/features/workspace/projects/components/ProjectNotesTableRow";
import type { ProjectNotesTableRowProps } from "@/features/workspace/projects/types/components";

export function SortableProjectNotesTableRow(props: ProjectNotesTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.note.id });

  return (
    <ProjectNotesTableRow
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
