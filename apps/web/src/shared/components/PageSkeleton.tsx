import { PageHeader } from "@/shared/components/PageHeader";
import { Phantom } from "@/shared/components/Phantom";
import { TableSkeleton } from "@/shared/components/TableSkeleton";

/** A screen that has nothing to show yet: the real page header above a list of rows. */
export function PageSkeleton() {
  return (
    <>
      <Phantom>
        <PageHeader heading="This page is loading" description="A short line about this page goes here." />
      </Phantom>
      <TableSkeleton rows={6} panel />
    </>
  );
}
