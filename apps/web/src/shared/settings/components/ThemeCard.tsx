import { Moon, Palette, Sun } from "lucide-react";

import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { SettingsCard } from "@/shared/settings/components/SettingsCard";
import { UserSettingToggleRow } from "@/shared/settings/components/UserSettingToggleRow";
import { Switch } from "@/shared/ui/switch";
import { showToast } from "@/shared/utils/showToast";

export function ThemeCard() {
  const { isDark, setDarkMode } = useThemeMode();

  function handleChange(enabled: boolean) {
    setDarkMode(enabled);
    showToast("success", `Dark mode turned ${enabled ? "on" : "off"}`, {
      description: `DayFlow now uses the ${enabled ? "dark" : "light"} theme in this browser.`,
    });
  }

  return (
    <SettingsCard
      title="Appearance"
      description="The theme follows your device until you choose, in this browser. Motion is saved to your account."
      icon={Palette}
    >
      <div className="divide-y divide-border">
        <div className="flex min-h-10 items-center justify-between gap-4 pb-3">
          <label htmlFor="settings-dark-mode" className="text-sm">
            Dark mode
          </label>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sun className="size-4" aria-hidden="true" />
            <Switch
              id="settings-dark-mode"
              className="relative after:absolute after:-inset-3"
              checked={isDark}
              onCheckedChange={handleChange}
            />
            <Moon className="size-4" aria-hidden="true" />
          </div>
        </div>
        <UserSettingToggleRow settingKey="page_transitions" />
      </div>
    </SettingsCard>
  );
}
