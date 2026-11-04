import { Bell } from "lucide-react";

import { PreferenceToggleRow } from "@/shared/settings/components/PreferenceToggleRow";
import { SettingsCard } from "@/shared/settings/components/SettingsCard";
import { useNotificationPreferences } from "@/shared/settings/hooks/useNotificationPreferences";

export function NotificationsPreferencesCard() {
  const { preferences, setPreference } = useNotificationPreferences();

  return (
    <SettingsCard
      title="Notifications"
      description="Dummy preferences saved in this browser."
      icon={Bell}
    >
      <div className="divide-y divide-border">
        <PreferenceToggleRow
          id="pref-in-app-reminders"
          title="In-app reminders"
          description="Show reminder alerts while you are signed in to DayFlow."
          checked={preferences.inAppReminders}
          onCheckedChange={(value) => setPreference("inAppReminders", value)}
        />
        <PreferenceToggleRow
          id="pref-email-updates"
          title="Email updates"
          description="Receive task and reminder emails at your account address."
          checked={preferences.emailUpdates}
          onCheckedChange={(value) => setPreference("emailUpdates", value)}
        />
        <PreferenceToggleRow
          id="pref-desktop-alerts"
          title="Desktop notifications"
          description="Allow browser alerts for due reminders in this tab."
          checked={preferences.desktopAlerts}
          onCheckedChange={(value) => setPreference("desktopAlerts", value)}
        />
        <PreferenceToggleRow
          id="pref-weekly-digest"
          title="Weekly digest"
          description="A Monday summary of open tasks and upcoming reminders."
          checked={preferences.weeklyDigest}
          onCheckedChange={(value) => setPreference("weeklyDigest", value)}
        />
      </div>
    </SettingsCard>
  );
}
