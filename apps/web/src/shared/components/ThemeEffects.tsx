import { useEffect } from "react";
import { useTheme } from "next-themes";

import { BRAND_FAVICON } from "@/shared/constants/brandAssets";

/** Keeps the favicon in step with the theme. */
export function ThemeEffects() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    document
      .querySelector<HTMLLinkElement>('link[rel="icon"]')
      ?.setAttribute("href", resolvedTheme === "dark" ? BRAND_FAVICON.dark : BRAND_FAVICON.light);
  }, [resolvedTheme]);

  return null;
}
