import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  retries: 1,
  reporter: "list",
  timeout: 15_000,
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3006/health",
    reuseExistingServer: true,
    timeout: 20_000,
  },
});
