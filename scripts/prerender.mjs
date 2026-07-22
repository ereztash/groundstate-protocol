/**
 * Post-build prerender (SSG) for the COR-SYS site.
 *
 * Vite ships a client-only SPA: crawlers and social scrapers that don't run JS
 * see an empty #root, and secondary routes have no per-page <title>/meta. This
 * script boots the real built app in headless Chromium (so there are no SSR
 * safety concerns), lets React + useDocumentMeta render each route, and writes
 * the fully-rendered HTML — content + baked meta — to dist/<route>/index.html.
 *
 * Assumes ROOT deployment (the apex domain in public/CNAME): asset URLs are
 * served/emitted as absolute "/assets/..." so they resolve from any route depth.
 *
 * Run: node scripts/prerender.mjs   (set PW_CHROMIUM to a browser path if the
 * default Playwright download isn't present, e.g. in this sandbox).
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const ROUTES = ["/", "/protocol", "/privacy"];

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

// Serve the SPA with asset refs made absolute so any route depth boots the app.
const fallbackHtml = readFileSync(join(DIST, "index.html"), "utf8").replaceAll(
  "./assets/",
  "/assets/"
);

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
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
  await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle" });
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

console.log(`prerender: done (${ROUTES.length} routes).`);
