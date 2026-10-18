import { FluidWaveItem } from "@/shared/components/FluidWaveItem";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function ClientNotificationsPage() {
  return (
    <PageContent stagger={false}>
      <PageHeader
        heading="Notifications"
        description="Updates from your provider."
      />
      <FluidWaveItem
        index={0}
        className={cn(
          "px-6 py-12 text-center text-sm text-muted-foreground",
          glassPanelClassName,
        )}
      >
        No notifications yet.
      </FluidWaveItem>
    </PageContent>
  );
}
