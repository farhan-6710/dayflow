import { Moon, Sun } from "lucide-react";

import { useThemeMode } from "@/shared/hooks/useThemeMode";
import { Button } from "@/shared/ui/button";

export function ThemeToggle() {
  const { isDark, setDarkMode } = useThemeMode();
  const Icon = isDark ? Sun : Moon;

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setDarkMode(!isDark)}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
