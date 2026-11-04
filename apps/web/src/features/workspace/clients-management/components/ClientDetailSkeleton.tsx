import { ActivitySummaryStats } from "@/features/workspace/client-activities/components/ActivitySummaryStats";
import { ClientActivitiesSkeleton } from "@/features/workspace/client-activities/components/ClientActivitiesSkeleton";
import { PageHeader } from "@/shared/components/PageHeader";
import { Phantom } from "@/shared/components/Phantom";
import { TableSkeleton } from "@/shared/components/TableSkeleton";

export function ClientDetailSkeleton() {
  return (
    <Phantom>
      <PageHeader
        backButton={<span className="text-sm">Clients Management</span>}
        leading={<div className="size-14 rounded-xl" />}
        heading="A company name"
        description="Active, the contact, and when it changed"
        actions={<div className="h-10 w-40 rounded-lg" />}
      />
      <div className="grid min-w-0 grid-cols-1 gap-4">
        <div className="h-10 w-96 max-w-full rounded-lg" />
        <ActivitySummaryStats rows={null} />
        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid min-w-0 gap-4">
            <TableSkeleton rows={2} panel title="Projects" cells={["A project name goes here", "Active"]} />
            <ClientActivitiesSkeleton title="Client Activities" />
          </div>
          <TableSkeleton rows={6} panel title="Client Details" cells={["A label", "A value goes here"]} />
        </div>
      </div>
    </Phantom>
  );
}
