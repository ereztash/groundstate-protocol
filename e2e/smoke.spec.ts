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
    // A link, not a button, since 2026-09-29: it has to work on a slow phone
    // before the bundle has hydrated, and every CTA on the page lands on #book.
    const cta = page.locator('#hero a[href="#book"]').first();
    await expect(cta).toContainText("לתיאום שיחת התאמה");
  });

  test("landing page hydrates the prerendered DOM instead of redrawing it", async ({
    page,
  }) => {
    // main.tsx hydrates the landing page so the static HTML a phone has
    // already painted is kept, not torn down and rebuilt after the bundle
    // runs. Any mismatch (a Suspense boundary above the page, adjacent text
    // nodes without separators) makes React fall back to a full client render
    // with no visible error, so the only reliable check is node identity:
    // the headline parsed from HTML must be the headline on screen after load.
    await page.addInitScript(() => {
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "interactive") {
          (window as unknown as { __h1: Element | null }).__h1 =
            document.querySelector("#hero-title");
        }
      });
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const kept = await page.evaluate(() => {
      const parsed = (window as unknown as { __h1: Element | null }).__h1;
      return parsed !== null && parsed === document.querySelector("#hero-title");
    });
    expect(kept, "the prerendered headline was replaced: hydration fell back to a client render").toBe(true);
  });

  test("page title leads with the search terms and carries the name", async ({ page }) => {
    // Was /COR-SYS/. The title now leads with what a stranger searches for;
    // nobody searches the brand yet, and og:title keeps it for link previews.
    await page.goto("/");
    await expect(page).toHaveTitle(/ליווי עסקי לעצמאים.*ארז טל-שיר/);
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
