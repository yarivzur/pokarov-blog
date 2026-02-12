// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.pokarov.com",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: "serve-pagefind",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith("/pagefind/")) {
              const filePath = join(process.cwd(), "dist", req.url);
              if (existsSync(filePath)) {
                const content = readFileSync(filePath);
                const ext = req.url.split(".").pop();
                const types = { js: "application/javascript", css: "text/css", json: "application/json", pf_meta: "application/octet-stream", pf_fragment: "application/octet-stream", pf_index: "application/octet-stream" };
                res.setHeader("Content-Type", types[ext] || "application/octet-stream");
                res.end(content);
                return;
              }
            }
            next();
          });
        },
      },
    ],
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
