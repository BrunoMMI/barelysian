import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.elysiamsorsidipoesia.it",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "never",
  },
});
