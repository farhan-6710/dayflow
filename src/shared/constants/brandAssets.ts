/** DayFlow brand images in /public — use these paths only. */
export const BRAND_LOGO = {
  light: "/logo-light.png",
  dark: "/logo-dark.png",
  iconLight: "/logo-light-icon.png",
  iconDark: "/logo-dark-icon.png",
} as const;

export const BRAND_FAVICON = {
  light: "/favicon-light.ico",
  dark: "/favicon-dark.ico",
  default: "/favicon.ico",
} as const;

export function resolveBrandLogoSrc(isDarkMode: boolean, variant: "full" | "icon") {
  if (variant === "icon") {
    return isDarkMode ? BRAND_LOGO.iconDark : BRAND_LOGO.iconLight;
  }

  return isDarkMode ? BRAND_LOGO.dark : BRAND_LOGO.light;
}

export function resolveBrandFaviconHref(isDarkMode: boolean) {
  return isDarkMode ? BRAND_FAVICON.dark : BRAND_FAVICON.light;
}
