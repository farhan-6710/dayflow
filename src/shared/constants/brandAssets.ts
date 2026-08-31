/** DayFlow brand images in /public — use these paths only. */
export const BRAND_LOGO = {
  light: "/logo-light.png",
  dark: "/logo-dark.png",
  iconLight: "/logo-light-icon.png",
  iconDark: "/logo-dark-icon.png",
} as const;

export const BRAND_PROMOTION_BANNER = {
  light: "/brand-promotion-banner-light.png",
  dark: "/brand-promotion-banner-dark.png",
  /** Native asset size — keep in sync if banners are replaced. */
  width: 1122,
  height: 1402,
} as const;

/** Width / height — used to size the auth banner column without cropping. */
export const BRAND_PROMOTION_BANNER_ASPECT =
  BRAND_PROMOTION_BANNER.width / BRAND_PROMOTION_BANNER.height;

export const BRAND_PROMOTION_BANNER_BACKDROP = {
  light: "#eef2f3",
  dark: "#0c0e10",
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

export function resolveBrandPromotionBannerSrc(isDarkMode: boolean) {
  return isDarkMode ? BRAND_PROMOTION_BANNER.dark : BRAND_PROMOTION_BANNER.light;
}

export function resolveBrandFaviconHref(isDarkMode: boolean) {
  return isDarkMode ? BRAND_FAVICON.dark : BRAND_FAVICON.light;
}
