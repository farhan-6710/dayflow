import { Folder } from "lucide-react";

import { useClientPortal } from "@/features/client/providers/ClientPortalProvider";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function ClientDashboardPage() {
  const { client } = useClientPortal();

  return (
    <div className="space-y-6">
      <PageHeader
        heading={`Welcome, ${client.company_name}`}
        description="View your projects, updates, and activities from your provider."
      />
      <PageContent>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <Folder className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Open Projects in the sidebar to see everything shared with you.
          </p>
        </div>
      </PageContent>
    </div>
  );
}
