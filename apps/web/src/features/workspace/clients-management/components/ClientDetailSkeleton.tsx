import { ClientActivitiesSkeleton } from "@/features/workspace/client-activities/components/ClientActivitiesSkeleton";
import { PageHeader } from "@/shared/components/PageHeader";
import { Phantom } from "@/shared/components/Phantom";
import { TableSkeleton } from "@/shared/components/TableSkeleton";

export function ClientDetailSkeleton() {
  return (
    <Phantom>
      <PageHeader
        backButton={<span className="text-sm">Clients Management</span>}
        heading="A company name"
        description="Active"
        actions={<div className="h-10 w-40 rounded-lg" />}
      />
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <TableSkeleton rows={6} panel title="Details" cells={[["Field", "The value goes here"]]} />
        <div className="grid min-w-0 gap-4">
          <TableSkeleton rows={2} panel title="Projects" cells={["A project name goes here", "Active"]} />
          <ClientActivitiesSkeleton title="Client activities" />
        </div>
      </div>
    </Phantom>
  );
}
