import { ActivitiesPanel } from "@/features/admin/client-activities/components/ActivitiesPanel";
import type { ClientActivitiesSectionProps } from "@/features/admin/client-activities/types/components";

export function ClosedActivitiesSection(props: ClientActivitiesSectionProps) {
  return (
    <ActivitiesPanel
      {...props}
      title="Closed Activities"
      description="Completed tasks, meetings, and calls."
      showAddNew={false}
    />
  );
}
