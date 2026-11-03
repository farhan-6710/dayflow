import { PageHeader } from "@/shared/components/PageHeader";
import { useAuth } from "@/shared/hooks/useAuth";
import { EmailCard } from "@/shared/settings/components/EmailCard";
import { PasswordCard } from "@/shared/settings/components/PasswordCard";
import { ProfileCard } from "@/shared/settings/components/ProfileCard";
import { ThemeCard } from "@/shared/settings/components/ThemeCard";
import { useEmailChangeCallback } from "@/shared/settings/hooks/useEmailChangeCallback";
import type { SettingsViewProps } from "@/shared/settings/types/components";

export function SettingsView({ settingsPath, authPath }: SettingsViewProps) {
  const { profile } = useAuth();
  useEmailChangeCallback();

  return (
    <>
      <PageHeader heading="Settings" description="Your profile, sign-in details and appearance." />
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
        <div className="grid min-w-0 gap-4">
          {/* Remount when the saved profile changes, so the form restarts from the new values. */}
          <ProfileCard key={profile?.updated_at ?? "no-profile"} />
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
