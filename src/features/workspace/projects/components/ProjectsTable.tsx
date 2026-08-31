import { ProjectsTableRow } from "@/features/admin/projects/components/ProjectsTableRow";
import {
  PROJECTS_STATUS_FILTER_LABELS,
  projectsDirectoryConfig,
} from "@/features/admin/projects/constants/projectsDirectory";
import type { ProjectsTableProps } from "@/features/admin/projects/types/components";
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
  onToggleArchive,
  onDeleteProject,
}: ProjectsTableProps) {
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
      isEmpty={projects.length === 0}
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
      {projects.map((project) => (
        <ProjectsTableRow
          key={project.id}
          project={project}
          onEditProject={onEditProject}
          onToggleArchive={onToggleArchive}
          onDeleteProject={onDeleteProject}
        />
      ))}
    </DirectoryTable>
  );
}
