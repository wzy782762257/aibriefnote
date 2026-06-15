import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        sites: resolve(__dirname, "sites/index.html"),
        workflows: resolve(__dirname, "workflows/index.html"),
        updates: resolve(__dirname, "updates/index.html"),
        articles: resolve(__dirname, "articles/index.html"),
        guide: resolve(__dirname, "articles/ai-brief-2026-06-15.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        privacy: resolve(__dirname, "privacy.html")
      }
    }
  }
});
