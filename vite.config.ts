import { resolve } from "node:path";
import { readdirSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function articleInputs() {
  return Object.fromEntries(
    readdirSync(resolve(__dirname, "articles"))
      .filter((file) => file.endsWith(".html") && file !== "index.html")
      .map((file) => [
        `article-${file.replace(/\.html$/, "")}`,
        resolve(__dirname, "articles", file)
      ])
  );
}

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
        ...articleInputs(),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        privacy: resolve(__dirname, "privacy.html"),
        notFound: resolve(__dirname, "404.html")
      }
    }
  }
});
