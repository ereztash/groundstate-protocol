import { defineConfig, devices } from "@playwright/test";

/**
 * Production-bundle smoke tests. The whole point of this test layer is to
 * catch the kind of runtime crash that `bun run build` can't catch — e.g.
 * the manualChunks/forwardRef-undefined bug that took the site down despite
 * a clean build. So the dev server is NOT what we test; we test the same
 * `vite preview` output a user actually loads.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      // A bare `executablePath` was pinned here to a sandbox path. It never did
      // anything: `executablePath` belongs under `launchOptions`, so Playwright
      // silently ignored the key and resolved its own installed browser. CI
      // proves it — that path does not exist on the runner and the suite still
      // passed. Removed rather than moved into `launchOptions`: letting
      // Playwright resolve the browser it installed is what we actually want on
      // every machine.
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
