import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  retries: 1,
  reporter: "list",
  timeout: 30_000,
  use: { ...devices["Desktop Chrome"], trace: "on-first-retry" },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3005",
    reuseExistingServer: true,
    timeout: 60_000, // Next.js needs more time on first start
  },
});
