import { test, expect } from "@playwright/test";

/**
 * Smoke tests that prove the production bundle actually executes in a real
 * browser. These are the tests that would have caught the manualChunks/
 * forwardRef-undefined production crash from PR #28 — Vitest jsdom tests
 * load source modules, not the bundled output, so they can't.
 *
 * Three checks per page:
 *   1. No JavaScript errors in the console while loading
 *   2. The React root actually has content (not the bug-state empty <div>)
 *   3. Key landmarks render (title, CTA copy)
 */

test.describe("Landing page (production bundle)", () => {
  const consoleErrors: string[] = [];

  test.beforeEach(({ page }) => {
    consoleErrors.length = 0;
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });
  });

  test("React mounts and renders the landing main element", async ({
    page,
  }) => {
    await page.goto("/");
    // The landing page renders a <main> element with all sections. This is the
    // canonical "React mounted real content" check — bug-state empty #root
    // only contains hidden Toaster portals, no <main>.
    await expect(page.locator("main")).toBeVisible({ timeout: 10_000 });
    const rootHtml = await page.locator("#root").innerHTML();
    expect(rootHtml.length).toBeGreaterThan(1000);
  });

  test("no console errors on initial load", async ({ page }) => {
    await page.goto("/");
    await page.locator("main").waitFor({ state: "visible", timeout: 10_000 });
    // Allow tiny grace period for any deferred errors
    await page.waitForTimeout(500);
    // Filter out environmental noise — external scripts/fonts/analytics that
    // can't reach the test sandbox aren't bugs in our code. We're hunting for
    // first-party runtime crashes (e.g. the manualChunks/forwardRef bug).
    const noise = [
      /clarity\.ms/i,
      /gtag|googletagmanager/i,
      /fonts\.(googleapis|gstatic)\.com/i,
      /ERR_CERT/i,
      /ERR_BLOCKED_BY_CLIENT/i,
      /Failed to load resource/i,
    ];
    const real = consoleErrors.filter(
      (e) => !noise.some((rx) => rx.test(e))
    );
    expect(
      real,
      `Unexpected first-party console errors:\n${real.join("\n")}`
    ).toEqual([]);
  });

  test("hero CTA renders", async ({
    page,
  }) => {
    await page.goto("/");
    const cta = page.locator("#hero button").first();
    await expect(cta).toContainText("לתיאום שיחת אבחון");
  });

  test("page title is the Hebrew brand title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/COR-SYS/);
  });
});

test.describe("Lazy routes (production bundle)", () => {
  test("unknown route renders the NotFound lazy chunk", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/this-page-does-not-exist");
    await page.locator("body").waitFor({ state: "attached", timeout: 10_000 });
    await page.waitForLoadState("networkidle", { timeout: 10_000 });
    expect(errors).toEqual([]);
  });
});
