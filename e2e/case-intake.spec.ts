import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The case-intake tool holds client detail. On a static host there is no request
 * layer to check a credential against, so the protection is that the route is
 * compiled out: the chunk is not built, and the URL falls through to the 404
 * page.
 *
 * Two assertions, because either alone is weak. The navigation check proves a
 * visitor does not get the form. The bundle check proves the code is not merely
 * unrouted but absent, so no amount of client-side poking reaches it.
 */

test.describe("case-intake is not reachable in a production build", () => {
  test("navigating to /case-intake does not render the form", async ({ page }) => {
    await page.goto("/case-intake");
    await page.waitForLoadState("networkidle");

    // The form's own fields and heading must not appear.
    await expect(page.locator("text=קליטת מקרה")).toHaveCount(0);
    await expect(page.locator("text=מה נאמר")).toHaveCount(0);
    await expect(page.locator("textarea")).toHaveCount(0);

    // The SPA fallback serves the 404 route instead.
    const body = await page.locator("body").innerText();
    expect(body.length).toBeGreaterThan(0);
    expect(body).not.toContain("הדבק אותה לקובץ חדש");
  });

  test("the intake code is absent from the built assets", () => {
    const assets = join(process.cwd(), "dist", "assets");
    expect(existsSync(assets)).toBe(true);

    const markers = ["קליטת מקרה", "הדבק אותה לקובץ חדש", "case_intake"];
    const offenders: string[] = [];
    for (const file of readdirSync(assets)) {
      if (!file.endsWith(".js")) continue;
      const text = readFileSync(join(assets, file), "utf8");
      for (const m of markers) {
        if (text.includes(m)) offenders.push(`${file} contains "${m}"`);
      }
    }
    expect(
      offenders,
      `intake tool shipped to production:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
