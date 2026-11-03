import { Moon, Sun } from "lucide-react";

import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { SettingsCard } from "@/shared/settings/components/SettingsCard";
import { Switch } from "@/shared/ui/switch";
import { showToast } from "@/shared/utils/showToast";

export function ThemeCard() {
  const { isDark, setDarkMode } = useThemeMode();

  async function handleChange(enabled: boolean) {
    if (await setDarkMode(enabled)) {
      showToast("success", `Theme set to ${enabled ? "dark" : "light"}.`);
    }
  }

  return (
    <SettingsCard title="Appearance" description="Saved to your account, so it follows you across devices.">
      <div className="flex min-h-10 items-center justify-between gap-4">
        <label htmlFor="settings-dark-mode" className="text-sm">
          Dark mode
        </label>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sun className="size-4" aria-hidden="true" />
          <Switch
            id="settings-dark-mode"
            className="relative after:absolute after:-inset-3"
            checked={isDark}
            onCheckedChange={(checked) => void handleChange(checked)}
          />
          <Moon className="size-4" aria-hidden="true" />
        </div>
      </div>
    </SettingsCard>
  );
}
