import { ActivitiesPanel } from "@/features/workspace/client-activities/components/ActivitiesPanel";
import type { ClientActivitiesSectionProps } from "@/features/workspace/client-activities/types/components";

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
