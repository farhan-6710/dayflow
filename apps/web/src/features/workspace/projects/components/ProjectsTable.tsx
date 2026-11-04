import { Filter, Plus } from "lucide-react";

import { ProjectsTableRow } from "@/features/workspace/projects/components/ProjectsTableRow";
import { PROJECT_TYPE_FILTERS, PROJECTS_GRID_CLASS, projectsColumns } from "@/features/workspace/projects/constants/directory";
import type { ProjectsTableProps } from "@/features/workspace/projects/types/components";
import { ActiveStatusTabs } from "@/shared/components/ActiveStatusTabs";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { ListingToolbar } from "@/shared/components/ListingToolbar";
import { OptionDropdown } from "@/shared/components/OptionDropdown";
import { SortableList } from "@/shared/components/SortableList";
import { TablePagination } from "@/shared/components/TablePagination";
import { Button } from "@/shared/ui/button";

const STATUS_LABELS = { all: "All Projects", active: "Active", inactive: "Inactive" };

export function ProjectsTable({ page }: ProjectsTableProps) {
  const active = page.projects.filter((project) => project.is_active).length;
  const rows = page.pagination.pageItems;

  return (
    <DirectoryTable
      gridClass={PROJECTS_GRID_CLASS}
      columns={projectsColumns}
      isLoading={page.loading}
      isEmpty={page.filteredProjects.length === 0}
      emptyImage={page.isFiltered ? "icon-empty-search" : "icon-empty-projects"}
      emptyTitle={page.isFiltered ? "No matching projects" : "No projects yet"}
      emptyDescription={
        page.isFiltered
          ? "Try a different search or status."
          : "Create a project to keep its notes, links and client activities together."
      }
      emptyAction={
        page.isFiltered ? undefined : (
          <Button size="lg" onClick={page.openCreate}>
            <Plus aria-hidden="true" />
            New Project
          </Button>
        )
      }
      headerAside={
        <ListingToolbar
          tabs={
            <ActiveStatusTabs
              value={page.statusFilter}
              onChange={page.setStatusFilter}
              labels={STATUS_LABELS}
              counts={page.loading ? undefined : { all: page.projects.length, active, inactive: page.projects.length - active }}
            />
          }
          filter={
            <OptionDropdown
              label="Filter by project type"
              value={page.typeFilter}
              onChange={page.setTypeFilter}
              options={PROJECT_TYPE_FILTERS}
              icon={Filter}
              className="w-auto"
            />
          }
          search={<ListingSearchInput value={page.searchQuery} onChange={page.setSearchQuery} placeholder="Search projects…" />}
        />
      }
      footer={<TablePagination pagination={page.pagination} noun="projects" />}
    >
      <SortableList ids={rows.map((project) => project.id)} onReorder={(ids) => void page.reorder(ids)}>
        {rows.map((project) => (
          <ProjectsTableRow
            key={project.id}
            project={project}
            onEdit={page.openEdit}
            onToggleActive={(target) => void page.toggleActive(target)}
            onDelete={page.setProjectToDelete}
          />
        ))}
      </SortableList>
    </DirectoryTable>
  );
}
