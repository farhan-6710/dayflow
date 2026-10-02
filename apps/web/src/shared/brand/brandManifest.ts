import brandManifestJson from "./brandManifest.json";

/**
 * DayFlow brand & product positioning — single source of truth.
 * Edit `brandManifest.json`; this module re-exports it for the app.
 */
export const brandManifest = brandManifestJson;

export type BrandManifest = typeof brandManifest;
export type BrandPortalKey = keyof typeof brandManifest.portals;

export const BRAND_NAME = brandManifest.name;
export const BRAND_TAGLINE = brandManifest.tagline;
export const BRAND_DESCRIPTION = brandManifest.description;
