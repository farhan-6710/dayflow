import { useUserSettings } from "@/shared/hooks/useUserSettings";
import { PreferenceToggleRow } from "@/shared/settings/components/PreferenceToggleRow";
import { USER_SETTING_COPY } from "@/shared/settings/constants/userSettings";
import type { UserSettingToggleRowProps } from "@/shared/settings/types/components";

/** One `user_settings` switch: saves to the account and toasts the result. */
export function UserSettingToggleRow({ settingKey }: UserSettingToggleRowProps) {
  const { settings, saving, setSetting } = useUserSettings();
  const { label, description } = USER_SETTING_COPY[settingKey];

  return (
    <PreferenceToggleRow
      id={`setting-${settingKey}`}
      title={label}
      description={description}
      checked={settings[settingKey]}
      disabled={saving === settingKey}
      onCheckedChange={(value) => void setSetting(settingKey, value)}
    />
  );
}
