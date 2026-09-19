import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://caffetteriaelysian.shop",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "never",
  },
});
