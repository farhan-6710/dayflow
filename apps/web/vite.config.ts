import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import brandManifest from "../../brandManifest.json" with { type: "json" };

const { seo, siteUrl, logo } = brandManifest;
const absolute = (path: string) => new URL(path, siteUrl).href;

/** schema.org description of the web app, for search engines. Static HTML only: crawlers do not run JS. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: brandManifest.name,
  description: seo.description,
  url: siteUrl,
  image: absolute(seo.image.url),
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, macOS, Windows",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/** Every `%BRAND_*%` placeholder in index.html, filled from brandManifest.json. */
const placeholders: Record<string, string> = {
  BRAND_SEO_TITLE: seo.title,
  BRAND_SEO_DESCRIPTION: seo.description,
  BRAND_NAME: brandManifest.name,
  BRAND_SITE_URL: siteUrl,
  BRAND_SEO_LOCALE: seo.locale,
  BRAND_THEME_COLOR: seo.themeColor,
  BRAND_IMAGE_URL: absolute(seo.image.url),
  BRAND_IMAGE_WIDTH: String(seo.image.width),
  BRAND_IMAGE_HEIGHT: String(seo.image.height),
  BRAND_IMAGE_TYPE: seo.image.type,
  BRAND_IMAGE_ALT: seo.image.alt,
  BRAND_FAVICON_LIGHT: logo.favicon.light,
  BRAND_FAVICON_DARK: logo.favicon.dark,
  BRAND_APPLE_TOUCH: logo.appleTouch,
  BRAND_JSON_LD: JSON.stringify(jsonLd),
};

function fillBrandPlaceholders(html: string): string {
  return html.replace(/%(BRAND_[A-Z_]+)%/g, (match, key: string) => placeholders[key] ?? match);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "dayflow-brand-html",
      transformIndexHtml: (html) => fillBrandPlaceholders(html),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@dayflow/brand": path.resolve(import.meta.dirname, "../../shared/brand"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: [path.resolve(import.meta.dirname, "../..")],
    },
  },
});
