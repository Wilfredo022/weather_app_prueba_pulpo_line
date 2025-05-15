import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
            },
          },
        ],
      },

      includeManifestIcons: false,
      manifest: false,
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
