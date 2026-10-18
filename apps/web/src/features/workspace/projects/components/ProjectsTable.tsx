import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableProjectsTableRow } from "@/features/workspace/projects/components/SortableProjectsTableRow";
import {
  PROJECTS_STATUS_FILTER_LABELS,
  projectsDirectoryConfig,
} from "@/features/workspace/projects/constants/projectsDirectory";
import type { ProjectsTableProps } from "@/features/workspace/projects/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";

export function ProjectsTable({
  projects,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  onEditProject,
  onToggleActive,
  onDeleteProject,
  onReorderProjects,
}: ProjectsTableProps) {
  const projectIds = projects.map((project) => project.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projectIds.indexOf(String(active.id));
    const newIndex = projectIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    onReorderProjects(arrayMove(projectIds, oldIndex, newIndex));
  }

  return (
    <DirectoryTable
      title={projectsDirectoryConfig.title}
      description={projectsDirectoryConfig.description}
      gridClass={projectsDirectoryConfig.gridClass}
      columns={[...projectsDirectoryConfig.columns]}
      emptyMessage={
        searchQuery.trim()
          ? "No projects match that search."
          : projectsDirectoryConfig.emptyMessage
      }
      isLoading={isLoading}
      isEmpty={!isLoading && projects.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <ListingSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search projects"
            disabled={isLoading}
          />
          <ActiveStatusFilter
            value={statusFilter}
            onChange={onStatusFilterChange}
            labels={PROJECTS_STATUS_FILTER_LABELS}
            disabled={isLoading}
            placeholder="Filter projects"
          />
        </div>
      }
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projectIds}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <SortableProjectsTableRow
              key={project.id}
              project={project}
              onEditProject={onEditProject}
              onToggleActive={onToggleActive}
              onDeleteProject={onDeleteProject}
            />
          ))}
        </SortableContext>
      </DndContext>
    </DirectoryTable>
  );
}
