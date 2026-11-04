import { CalendarDays, CircleCheck, Folder, Phone } from "lucide-react";

import { CLIENT_PORTAL_PROJECTS_PATH } from "@/app/constants/clientPortalRoutes";
import { useClientOverview } from "@/features/client/hooks/useClientOverview";
import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { useUserDisplay } from "@/shared/hooks/useUserDisplay";
import { getGreeting } from "@/shared/utils/greeting";
import type { StatCardItem } from "@/shared/types/components";

type Countable = { status: string };

function progress(items: Countable[], noun: string) {
  const done = items.filter((item) => item.status === "completed").length;
  const open = items.length - done;
  return {
    value: `${done}/${items.length}`,
    description:
      items.length === 0 ? `No ${noun} yet` : open === 0 ? `All ${noun} are completed` : `${open} still open`,
  };
}

export function ClientDashboardPage() {
  const page = useClientOverview();
  const { displayName } = useUserDisplay();

  const cards: StatCardItem[] = [
    {
      id: "projects",
      label: "Active projects",
      value: page.projects.filter((project) => project.is_active).length,
      description: "Shared with you",
      icon: Folder,
      href: CLIENT_PORTAL_PROJECTS_PATH,
    },
    { id: "tasks", label: "Tasks completed", icon: CircleCheck, ...progress(page.tasks, "tasks") },
    { id: "meetings", label: "Meetings completed", icon: CalendarDays, ...progress(page.meetings, "meetings") },
    { id: "calls", label: "Calls attended", icon: Phone, ...progress(page.calls, "calls") },
  ];

  return (
    <>
      <PageHeader heading={`${getGreeting()}, ${displayName}`} description={`Projects and activities for ${page.client.company_name}.`} />
      <div className="grid min-w-0 gap-4">
        {page.error ? <ErrorBanner message={page.error} onRetry={page.reload} /> : null}
        <StatsCards cards={cards} isLoading={page.loading} />
        <ClientActivitiesBlock
          scope="client"
          clientId={page.client.id}
          projects={page.projects.filter((project) => project.is_active)}
          activityRaisedBy="client"
          onChange={page.reload}
        />
      </div>
    </>
  );
}
