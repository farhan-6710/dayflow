import { ActivitiesPanel } from "@/features/admin/client-activities/components/ActivitiesPanel";
import type { ClientActivitiesSectionProps } from "@/features/admin/client-activities/types/components";

export function OpenActivitiesSection(props: ClientActivitiesSectionProps) {
  return (
    <ActivitiesPanel
      {...props}
      title="Open Activities"
      description="Tasks, meetings, and calls still in progress."
      showAddNew
    />
  );
}
