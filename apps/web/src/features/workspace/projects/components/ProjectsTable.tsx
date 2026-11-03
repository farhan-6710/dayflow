import { Plus } from "lucide-react";

import { ProjectsTableRow } from "@/features/workspace/projects/components/ProjectsTableRow";
import { PROJECTS_GRID_CLASS, projectsColumns } from "@/features/workspace/projects/constants/directory";
import type { ProjectsTableProps } from "@/features/workspace/projects/types/components";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { SortableList } from "@/shared/components/SortableList";
import { Button } from "@/shared/ui/button";

const STATUS_LABELS = { all: "All projects", active: "Active", inactive: "Inactive" };

export function ProjectsTable({
  projects,
  isFiltered,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  onCreate,
  onEdit,
  onToggleActive,
  onDelete,
  onReorder,
}: ProjectsTableProps) {
  return (
    <DirectoryTable
      gridClass={PROJECTS_GRID_CLASS}
      columns={projectsColumns}
      isLoading={isLoading}
      isEmpty={projects.length === 0}
      emptyImage={isFiltered ? "icon-empty-search" : "icon-empty-projects"}
      emptyTitle={isFiltered ? "No matching projects" : "No projects yet"}
      emptyDescription={
        isFiltered
          ? "Try a different search or status."
          : "Create a project to keep its notes, links and client activities together."
      }
      emptyAction={
        isFiltered ? undefined : (
          <Button size="lg" onClick={onCreate}>
            <Plus aria-hidden="true" />
            New project
          </Button>
        )
      }
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <ListingSearchInput value={searchQuery} onChange={onSearchQueryChange} placeholder="Search projects" />
          <ActiveStatusFilter value={statusFilter} onChange={onStatusFilterChange} labels={STATUS_LABELS} />
        </div>
      }
    >
      <SortableList ids={projects.map((project) => project.id)} onReorder={onReorder}>
        {projects.map((project) => (
          <ProjectsTableRow
            key={project.id}
            project={project}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
            onDelete={onDelete}
          />
        ))}
      </SortableList>
    </DirectoryTable>
  );
}
