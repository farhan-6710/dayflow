import { useEffect } from "react";

import { BRAND_NAME, brandManifest } from "@/shared/brand/brandManifest";

/** Sets the tab title for a website page; the home page keeps the brand's SEO title. */
export function useSiteTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${BRAND_NAME}` : brandManifest.seo.title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
