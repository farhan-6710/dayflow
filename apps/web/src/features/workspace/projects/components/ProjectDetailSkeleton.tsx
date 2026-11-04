import { NOTES_GRID_CLASS, notesColumns } from "@/features/workspace/projects/constants/directory";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { PageHeader } from "@/shared/components/PageHeader";
import { Phantom } from "@/shared/components/Phantom";
import { TableSkeleton } from "@/shared/components/TableSkeleton";

export function ProjectDetailSkeleton() {
  return (
    <Phantom>
      <PageHeader
        backButton={<span className="text-sm">Projects Management</span>}
        heading="A project name"
        description="Active, the client it's for, and when it changed"
        actions={<div className="h-10 w-28 rounded-lg" />}
      />
      <div className="grid min-w-0 items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <DirectoryTable
          title="Notes"
          gridClass={NOTES_GRID_CLASS}
          columns={notesColumns}
          isLoading
          isEmpty={false}
          emptyTitle=""
          emptyDescription=""
          loadingRows={3}
          action={<div className="h-10 w-28 rounded-lg" />}
          headerAside={<div className="h-10 w-72 max-w-full rounded-lg" />}
        >
          {null}
        </DirectoryTable>
        <TableSkeleton rows={2} panel title="Reference links" cells={[["A link label", "https://example.com/a-page"]]} />
      </div>
    </Phantom>
  );
}
