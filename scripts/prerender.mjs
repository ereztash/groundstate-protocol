/**
 * Post-build prerender (SSG) for the COR-SYS site.
 *
 * Vite ships a client-only SPA: crawlers and social scrapers that don't run JS
 * see an empty #root, and secondary routes have no per-page <title>/meta. This
 * script boots the real built app in headless Chromium (so there are no SSR
 * safety concerns), lets React + useDocumentMeta render each route, and writes
 * the fully-rendered HTML — content + baked meta — to dist/<route>/index.html.
 *
 * Base-aware: it reads VITE_BASE_PATH (the same base vite built with) so asset
 * URLs resolve at ANY route depth on the actual deploy target — critical for a
 * GitHub Pages project subpath (/groundstate-protocol/), where root-absolute
 * "/assets/..." would 404. Vite already emits base-prefixed absolute asset URLs
 * (e.g. "/groundstate-protocol/assets/..."), so nothing is rewritten here; the
 * local capture server just strips the base prefix when resolving files.
 *
 * Run: node scripts/prerender.mjs   (set PW_CHROMIUM to a browser path if the
 * default Playwright download isn't present, e.g. in this sandbox).
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

// Insight articles are markdown files in content/insights — one static page each.
const INSIGHTS_DIR = join(ROOT, "content", "insights");
const insightRoutes = existsSync(INSIGHTS_DIR)
  ? readdirSync(INSIGHTS_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => `/insights/${f.replace(/\.md$/, "")}`)
  : [];

const ROUTES = ["/", "/protocol", "/insights", ...insightRoutes, "/privacy"];

// The deploy base (must match the base vite built with). "/" (root) → no prefix;
// "/groundstate-protocol/" (Pages project site) → "/groundstate-protocol".
const RAW_BASE = process.env.VITE_BASE_PATH || "/";
const BASE = RAW_BASE === "/" ? "" : "/" + RAW_BASE.replace(/^\/+|\/+$/g, "");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

if (!existsSync(join(DIST, "index.html"))) {
  console.error("prerender: dist/index.html not found — run `vite build` first.");
  process.exit(1);
}

// index.html already carries correct (base-prefixed) asset URLs from vite — no
// rewriting. Served as the SPA fallback for every non-file route.
const fallbackHtml = readFileSync(join(DIST, "index.html"), "utf8");

const server = createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  // Strip the deploy base prefix so "/groundstate-protocol/assets/x" → dist/assets/x.
  if (BASE && (urlPath === BASE || urlPath.startsWith(BASE + "/"))) {
    urlPath = urlPath.slice(BASE.length) || "/";
  }
  const filePath = join(DIST, urlPath);
  if (urlPath !== "/" && existsSync(filePath) && statSync(filePath).isFile()) {
    res.setHeader("Content-Type", MIME[extname(filePath)] || "application/octet-stream");
    res.end(readFileSync(filePath));
    return;
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(fallbackHtml); // SPA fallback for every route
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const { port } = server.address();

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || undefined,
});

const pages = {};
for (const route of ROUTES) {
  const page = await browser.newPage();
  // Tell the app it's being prerendered (skips WebGL, keeps the static fallback).
  await page.addInitScript(() => {
    window.__PRERENDER__ = true;
  });
  const navPath = route === "/" ? BASE + "/" : BASE + route;
  await page.goto(`http://127.0.0.1:${port}${navPath}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const root = document.getElementById("root");
    return root && root.children.length > 0;
  }, { timeout: 15000 });
  await page.waitForTimeout(300);
  const html = "<!DOCTYPE html>\n" + (await page.evaluate(() => document.documentElement.outerHTML));
  pages[route] = html;
  await page.close();
  console.log(`prerender: captured ${route} (${(html.length / 1024).toFixed(1)} kB)`);
}

await browser.close();
await new Promise((r) => server.close(r));

for (const [route, html] of Object.entries(pages)) {
  const outPath =
    route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerender: wrote ${outPath.replace(DIST, "dist")}`);
}

console.log(`prerender: done (${ROUTES.length} routes, base "${BASE || "/"}").`);
