import { ACTIVITY_SKELETON_CELLS } from "@/features/workspace/client-activities/constants/skeleton";
import { TableSkeleton } from "@/shared/components/TableSkeleton";

/** The activities panel on a screen whose project or client hasn't loaded yet. */
export function ClientActivitiesSkeleton({ title }: { title: string }) {
  return <TableSkeleton rows={3} panel title={title} cells={ACTIVITY_SKELETON_CELLS} />;
}
