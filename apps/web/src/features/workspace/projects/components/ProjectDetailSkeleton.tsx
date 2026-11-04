import { ActivitySummaryStats } from "@/features/workspace/client-activities/components/ActivitySummaryStats";
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
        leading={<div className="size-14 rounded-xl" />}
        heading="A project name"
        description="Active, the client it's for, and when it changed"
        actions={<div className="h-10 w-40 rounded-lg" />}
      />
      <div className="grid min-w-0 grid-cols-1 gap-4">
        <div className="h-10 w-96 max-w-full rounded-lg" />
        <ActivitySummaryStats rows={null} />
        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
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
          <div className="grid min-w-0 gap-4">
            <TableSkeleton rows={4} panel title="Project Details" cells={["A label", "A value here"]} />
            <TableSkeleton rows={2} panel title="Reference Links" cells={[["A link label", "https://example.com/a-page"], "··"]} />
          </div>
        </div>
      </div>
    </Phantom>
  );
}
