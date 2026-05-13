import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  retries: 1,
  reporter: "list",
  timeout: 30_000,
  use: { ...devices["Desktop Chrome"], trace: "on-first-retry" },
  webServer: [
    {
      command: "pnpm dev:server",
      url: "http://localhost:3001",
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: "pnpm dev:client",
      url: "http://localhost:3002",
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
