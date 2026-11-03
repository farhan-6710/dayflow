import { buildClientProjectPath } from "@/app/constants/clientPortalRoutes";
import { useClientProjects } from "@/features/client/hooks/useClientProjects";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { DirectoryTableRow } from "@/shared/components/DirectoryTableRow";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PageHeader } from "@/shared/components/PageHeader";
import { ProjectChip } from "@/shared/components/ProjectChip";
import { StatusPill } from "@/shared/components/StatusPill";
import { cn } from "@/shared/lib/utils";

const GRID_CLASS = "md:grid-cols-[minmax(0,1fr)_6rem]";
const columns = [{ label: "Project" }, { label: "Status" }];

export function ClientProjectsPage() {
  const page = useClientProjects();
  const isFiltered = page.searchQuery.trim().length > 0;

  return (
    <>
      <PageHeader heading="Projects" description="Everything your provider has shared with you." />
      {page.error ? (
        <div className="mb-4">
          <ErrorBanner message={page.error} onRetry={page.reload} />
        </div>
      ) : null}
      {page.error && page.total === 0 ? null : (
        <DirectoryTable
          gridClass={GRID_CLASS}
          columns={columns}
          isLoading={page.loading}
          isEmpty={page.projects.length === 0}
          emptyImage={isFiltered ? "icon-empty-search" : "icon-empty-projects"}
          emptyTitle={isFiltered ? "No matching projects" : "No projects yet"}
          emptyDescription={
            isFiltered ? "Try a different search." : "Projects appear here once your provider shares them with you."
          }
          headerAside={
            <ListingSearchInput value={page.searchQuery} onChange={page.setSearchQuery} placeholder="Search projects" />
          }
        >
          {page.projects.map((project) => (
            <DirectoryTableRow
              key={project.id}
              to={buildClientProjectPath(project.id)}
              label={`Open ${project.name}`}
              className={cn("grid items-center gap-2 md:gap-4", GRID_CLASS)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <ProjectChip color={project.color_hex} />
                <span className="truncate">{project.name}</span>
              </div>
              <StatusPill active={project.is_active}>{project.is_active ? "Active" : "Inactive"}</StatusPill>
            </DirectoryTableRow>
          ))}
        </DirectoryTable>
      )}
    </>
  );
}
