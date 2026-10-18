import {
  BRAND_FAVICON,
  resolveBrandFaviconHref,
} from "@/shared/constants/brandAssets";
import {
  getStoredThemePreference,
  getSystemThemePreference,
} from "@/shared/utils/themePreferenceStorage";

const FAVICON_SELECTOR = 'link[data-dayflow-favicon="true"]';

export function applyBrandFavicon(isDarkMode: boolean) {
  let link = document.querySelector<HTMLLinkElement>(FAVICON_SELECTOR);

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.setAttribute("data-dayflow-favicon", "true");
    document.head.appendChild(link);
  }

  link.href = resolveBrandFaviconHref(isDarkMode);
}

export function applyBrandFaviconFromDocumentTheme() {
  applyBrandFavicon(document.body.classList.contains("dark"));
}

/** Initial favicon before React mounts — stored theme, else system. */
export function applyStoredBrandFavicon() {
  const stored = getStoredThemePreference();
  const isDark =
    stored === "dark" ||
    (stored == null && getSystemThemePreference() === "dark");
  applyBrandFavicon(isDark);
}

export { BRAND_FAVICON };
