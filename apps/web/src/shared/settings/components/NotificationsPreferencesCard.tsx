import { Bell } from "lucide-react";

import { SettingsCard } from "@/shared/settings/components/SettingsCard";
import { UserSettingToggleRow } from "@/shared/settings/components/UserSettingToggleRow";
import { NOTIFICATION_SETTING_KEYS } from "@/shared/settings/constants/userSettings";

export function NotificationsPreferencesCard() {
  return (
    <SettingsCard title="Notifications" description="Saved to your account." icon={Bell}>
      <div className="divide-y divide-border">
        {NOTIFICATION_SETTING_KEYS.map((key) => (
          <UserSettingToggleRow key={key} settingKey={key} />
        ))}
      </div>
    </SettingsCard>
  );
}
