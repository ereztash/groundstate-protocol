import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The prerendered HTML is what a crawler and a JS-less visitor read, so a route
 * that captures as an empty shell is invisible rather than merely degraded.
 *
 * This reads dist/ directly instead of driving a browser: the question is what
 * was written to disk, and a browser would hydrate the page and hide the very
 * failure being tested.
 *
 * The failure this guards against actually happened. With a relative base, a
 * nested route resolved "./assets/..." against its own directory, the dev server
 * answered with the SPA fallback, the module script was rejected on MIME type,
 * React never mounted, and the capture timed out on a #root that stayed empty.
 */

const DIST = join(process.cwd(), "dist");

const ROUTES = [
  { path: "", depth: 0, mustContain: "תרגום מומחיות מקצועית" },
  { path: "protocol", depth: 1, mustContain: "ארבעה שלבים" },
  { path: "about", depth: 1, mustContain: "COR-SYS" },
  { path: "privacy", depth: 1, mustContain: "פרטיות" },
  { path: "insights", depth: 1, mustContain: "תובנות" },
  { path: "insights/anatomy-of-a-mistake", depth: 2, mustContain: "COR-SYS" },
];

/** Byte floor for "this is a page, not a shell". The empty shell is ~10 kB. */
const MIN_BYTES = 12_000;

test.describe("prerendered output", () => {
  for (const route of ROUTES) {
    test(`/${route.path} is captured with real content`, () => {
      const file = join(DIST, route.path, "index.html");
      expect(existsSync(file), `${file} was not written`).toBe(true);

      const html = readFileSync(file, "utf8");
      expect(
        html.length,
        `/${route.path} looks like an empty shell (${html.length} bytes)`
      ).toBeGreaterThan(MIN_BYTES);

      // The mounted app, not just the container element.
      expect(html).toMatch(/id="root"><div/);
      expect(html).toContain(route.mustContain);
    });

    test(`/${route.path} points at assets that exist from its own depth`, () => {
      const html = readFileSync(join(DIST, route.path, "index.html"), "utf8");
      const refs = [...html.matchAll(/\s(?:src|href)="([^"]+\.(?:js|css))"/g)]
        .map((m) => m[1])
        .filter((u) => !/^https?:|^\/\//.test(u));

      expect(refs.length, "no local asset references found").toBeGreaterThan(0);

      for (const ref of refs) {
        // Relative refs must climb exactly as far as the route is deep.
        if (ref.startsWith("./") || ref.startsWith("../")) {
          const climbed = (ref.match(/\.\.\//g) || []).length;
          expect(
            climbed,
            `${ref} on /${route.path} climbs ${climbed} levels, needs ${route.depth}`
          ).toBe(route.depth);
        }
        const resolved = join(DIST, route.path, ref);
        expect(existsSync(resolved), `${ref} does not resolve from /${route.path}`).toBe(
          true
        );
      }
    });
  }
});
