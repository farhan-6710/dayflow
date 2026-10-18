import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { glassPanelClassName } from "@/shared/constants/layoutStyles";
import { cn } from "@/shared/lib/utils";

export function ClientNotificationsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        heading="Notifications"
        description="Updates from your provider."
      />
      <PageContent>
        <div
          className={cn(
            "px-6 py-12 text-center text-sm text-muted-foreground",
            glassPanelClassName,
          )}
        >
          No notifications yet.
        </div>
      </PageContent>
    </div>
  );
}
