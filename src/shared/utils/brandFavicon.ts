import {
  BRAND_FAVICON,
  resolveBrandFaviconHref,
} from "@/shared/constants/brandAssets";

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

/** Initial favicon before React mounts — matches stored theme when available. */
export function applyStoredBrandFavicon() {
  const stored = localStorage.getItem("DC-theme");
  if (stored === "dark") {
    applyBrandFavicon(true);
    return;
  }
  if (stored === "light") {
    applyBrandFavicon(false);
    return;
  }

  applyBrandFavicon(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
}

export { BRAND_FAVICON };
