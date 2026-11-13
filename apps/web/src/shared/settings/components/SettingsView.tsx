import { ErrorBanner } from "@/shared/components/ErrorBanner";
import { PageHeader } from "@/shared/components/PageHeader";
import { useUserSettings } from "@/shared/hooks/useUserSettings";
import { EmailCard } from "@/shared/settings/components/EmailCard";
import { NotificationsPreferencesCard } from "@/shared/settings/components/NotificationsPreferencesCard";
import { PasswordCard } from "@/shared/settings/components/PasswordCard";
import { ThemeCard } from "@/shared/settings/components/ThemeCard";
import { useEmailChangeCallback } from "@/shared/settings/hooks/useEmailChangeCallback";
import type { SettingsViewProps } from "@/shared/settings/types/components";

export function SettingsView({ settingsPath, authPath }: SettingsViewProps) {
  useEmailChangeCallback();
  const { loadError, reload } = useUserSettings();

  return (
    <>
      <PageHeader
        heading="Settings"
        description="Manage your account settings and preferences."
      />
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
        {loadError ? (
          <div className="lg:col-span-2">
            <ErrorBanner message={loadError} onRetry={reload} />
          </div>
        ) : null}
        <div className="grid min-w-0 gap-4">
          <NotificationsPreferencesCard />
          <ThemeCard />
        </div>
        <div className="grid min-w-0 gap-4">
          <EmailCard settingsPath={settingsPath} />
          <PasswordCard authPath={authPath} />
        </div>
      </div>
    </>
  );
}
