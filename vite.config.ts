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
        updates: resolve(__dirname, "updates/index.html"),
        articles: resolve(__dirname, "articles/index.html"),
        guide: resolve(__dirname, "articles/ai-brief-2026-06-15.html"),
        n8nGuide: resolve(__dirname, "articles/n8n-rss-ai-review-workflow.html"),
        ragGuide: resolve(__dirname, "articles/rag-knowledge-base-quality-checklist.html"),
        reviewGuide: resolve(__dirname, "articles/ai-content-human-review-checklist.html"),
        modelGuide: resolve(__dirname, "articles/local-vs-cloud-ai-models.html"),
        evaluationGuide: resolve(__dirname, "articles/ai-tool-evaluation-checklist.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        privacy: resolve(__dirname, "privacy.html"),
        notFound: resolve(__dirname, "404.html")
      }
    }
  }
});
