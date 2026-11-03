import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import { BRAND_FAVICON } from "@/shared/constants/brandAssets";
import { useAuth } from "@/shared/hooks/useAuth";

/** Applies the profile's saved theme once per signed-in user and keeps the favicon in step. */
export function ThemeEffects() {
  const { profile } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const appliedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!profile) {
      appliedForUser.current = null;
      return;
    }
    if (appliedForUser.current !== profile.id) {
      appliedForUser.current = profile.id;
      setTheme(profile.theme_preference);
    }
  }, [profile, setTheme]);

  useEffect(() => {
    document
      .querySelector<HTMLLinkElement>('link[rel="icon"]')
      ?.setAttribute("href", resolvedTheme === "dark" ? BRAND_FAVICON.dark : BRAND_FAVICON.light);
  }, [resolvedTheme]);

  return null;
}
