import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function ClientNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Notifications"
        description="Updates from your provider."
      />
      <PageContent>
        <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground shadow-sm">
          No notifications yet.
        </div>
      </PageContent>
    </div>
  );
}
