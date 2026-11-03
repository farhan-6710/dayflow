import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import brandManifest from "../../shared/brand/brandManifest.json";

const brandRoot = path.resolve(__dirname, "../../shared/brand");

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
      "@": path.resolve(__dirname, "./src"),
      "@dayflow/brand": brandRoot,
    },
  },
  clearScreen: false,
  envPrefix: ["VITE_", "TAURI_"],
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: [path.resolve(__dirname, "../..")],
    },
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
