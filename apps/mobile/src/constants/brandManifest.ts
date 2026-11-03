import brandManifestJson from "../../../../shared/brand/brandManifest.json";

/**
 * DayFlow brand & product positioning — single source of truth for web + mobile.
 * Edit `shared/brand/brandManifest.json` at the repo root; do not duplicate copy.
 */
export const brandManifest = brandManifestJson;

export type BrandManifest = typeof brandManifest;
export type BrandPortalKey = keyof typeof brandManifest.portals;

export const BRAND_NAME = brandManifest.name;
export const BRAND_TAGLINE = brandManifest.tagline;
export const BRAND_DESCRIPTION = brandManifest.description;
export const BRAND_SHORT_DESCRIPTION = brandManifest.shortDescription;
