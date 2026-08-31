import {
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Phone,
} from "lucide-react";

import { ClientActivitiesBlock } from "@/features/workspace/client-activities/components/ClientActivitiesBlock";
import { useAuth } from "@/features/workspace/auth/hooks/useAuth";
import { CLIENT_PORTAL_DASHBOARD_PATH, CLIENT_PORTAL_PROJECTS_PATH } from "@/app/constants/clientPortalRoutes";
import { useClientDashboard } from "@/features/client/hooks/useClientDashboard";
import { useClientPortal } from "@/features/client/providers/ClientPortalProvider";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatsCards } from "@/shared/components/StatsCards";
import { getUserDisplayName } from "@/shared/utils/authUserDisplay";

const ACTIVITIES_SECTION_ID = "client-dashboard-activities";

function completedTotalValue(completed: number, total: number) {
  return `${completed}/${total}`;
}

function activityProgressDescription(
  open: number,
  total: number,
  noun: string,
) {
  if (total === 0) {
    return `No ${noun} yet across your projects`;
  }
  if (open === 0) {
    return `All ${total} ${noun} are completed`;
  }
  return `${open} still open across your projects`;
}

export function ClientDashboardPage() {
  const { client } = useClientPortal();
  const { user, profile } = useAuth();
  const { stats, loading } = useClientDashboard(client.id, client.company_name);

  const welcomeName =
    profile?.display_name?.trim() ||
    client.client_name?.trim() ||
    getUserDisplayName(user);

  const tasksCompleted = stats.tasksTotal - stats.tasksOpen;
  const meetingsCompleted = stats.meetingsTotal - stats.meetingsOpen;
  const callsAttended = stats.callsTotal - stats.callsOpen;

  const cards = [
    {
      id: "active-projects",
      label: "Active Projects",
      value: stats.activeProjects,
      icon: FolderKanban,
      description: "Projects currently shared with you",
      href: CLIENT_PORTAL_PROJECTS_PATH,
    },
    {
      id: "activity-tasks",
      label: "Tasks Completed",
      value: completedTotalValue(tasksCompleted, stats.tasksTotal),
      icon: CheckSquare,
      description: activityProgressDescription(
        stats.tasksOpen,
        stats.tasksTotal,
        "tasks",
      ),
      href: `${CLIENT_PORTAL_DASHBOARD_PATH}#${ACTIVITIES_SECTION_ID}`,
    },
    {
      id: "activity-meetings",
      label: "Meetings Completed",
      value: completedTotalValue(meetingsCompleted, stats.meetingsTotal),
      icon: CalendarDays,
      description: activityProgressDescription(
        stats.meetingsOpen,
        stats.meetingsTotal,
        "meetings",
      ),
      href: `${CLIENT_PORTAL_DASHBOARD_PATH}#${ACTIVITIES_SECTION_ID}`,
    },
    {
      id: "activity-calls",
      label: "Calls Attended",
      value: completedTotalValue(callsAttended, stats.callsTotal),
      icon: Phone,
      description: activityProgressDescription(
        stats.callsOpen,
        stats.callsTotal,
        "calls",
      ),
      href: `${CLIENT_PORTAL_DASHBOARD_PATH}#${ACTIVITIES_SECTION_ID}`,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        heading={`Welcome, ${welcomeName}`}
        description={`${client.company_name} · Your projects and activities at a glance.`}
      />

      <PageContent className="space-y-6">
        <StatsCards cards={cards} isLoading={loading} />

        <div id={ACTIVITIES_SECTION_ID} className="scroll-mt-6">
          <ClientActivitiesBlock
            scope="client"
            clientId={client.id}
            forClientPortal
            clientCompanyName={client.company_name}
            canEdit
            activityRaisedBy="client"
          />
        </div>
      </PageContent>
    </div>
  );
}
