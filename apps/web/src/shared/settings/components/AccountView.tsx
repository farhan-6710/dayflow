import { PageHeader } from "@/shared/components/PageHeader";
import { AccountProfileSummary } from "@/shared/settings/components/AccountProfileSummary";
import { AccountQuickLinks } from "@/shared/settings/components/AccountQuickLinks";
import { AccountStats } from "@/shared/settings/components/AccountStats";
import { ProfileCard } from "@/shared/settings/components/ProfileCard";
import { useAccountOverview } from "@/shared/settings/hooks/useAccountOverview";
import { useAuth } from "@/shared/hooks/useAuth";
import type { AccountViewProps } from "@/shared/settings/types/components";

export function AccountView({
  settingsPath,
  homePath,
  tasksPath,
  projectsPath,
  roleLabel,
}: AccountViewProps) {
  const { profile } = useAuth();
  const overview = useAccountOverview();

  return (
    <>
      <PageHeader
        heading="Your profile"
        description="A quiet overview of your identity, activity, and shortcuts."
      />
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="grid min-w-0 gap-4">
          <AccountProfileSummary roleLabel={roleLabel} memberSince={overview.memberSince} />
          <ProfileCard key={profile?.updated_at ?? "no-profile"} />
        </div>
        <div className="grid min-w-0 gap-4">
          <AccountStats
            pendingTasks={overview.stats.pendingTasks}
            projects={overview.stats.projects}
            reminders={overview.stats.reminders}
            loading={overview.loading}
            error={overview.error}
            onRetry={overview.reload}
          />
          <AccountQuickLinks
            homePath={homePath}
            tasksPath={tasksPath}
            projectsPath={projectsPath}
            settingsPath={settingsPath}
          />
        </div>
      </div>
    </>
  );
}
