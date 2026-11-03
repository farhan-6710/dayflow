import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import brandManifest from "../../shared/brand/brandManifest.json" with { type: "json" };

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "dayflow-brand-html",
      transformIndexHtml(html) {
        return html
          .replaceAll("%BRAND_SEO_TITLE%", brandManifest.seo.title)
          .replaceAll("%BRAND_SEO_DESCRIPTION%", brandManifest.seo.description);
      },
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
