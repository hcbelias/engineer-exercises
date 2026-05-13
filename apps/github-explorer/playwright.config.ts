import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  retries: 1,
  reporter: "list",
  timeout: 30_000,
  use: { ...devices["Desktop Chrome"], trace: "on-first-retry" },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3003",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
