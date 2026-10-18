import {
  BRAND_FAVICON,
  resolveBrandFaviconHref,
} from "@/shared/constants/brandAssets";
import {
  isDarkTheme,
  resolveInitialThemePreference,
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

/** Initial favicon before React mounts — stored theme, else dark default. */
export function applyStoredBrandFavicon() {
  applyBrandFavicon(isDarkTheme(resolveInitialThemePreference()));
}

export { BRAND_FAVICON };
