// Generates public/og-image.png (1200×630) by screenshotting a branded
// HTML template with Playwright's chromium. Re-run after changing the brand:
//   node scripts/generate-og-image.mjs
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/og-image.png");

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Frank+Ruhl+Libre:wght@700;900&display=swap">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  body {
    background:#FAF9F6; color:#1a1a1a; font-family:'Assistant',sans-serif;
    display:flex; flex-direction:column; justify-content:center;
    padding:90px; position:relative; overflow:hidden;
  }
  .glow { position:absolute; top:-220px; right:-160px; width:640px; height:640px;
    background:radial-gradient(circle, rgba(168,99,43,0.16), transparent 70%); }
  .brand { font-size:26px; font-weight:700; letter-spacing:0.34em;
    text-transform:uppercase; color:#2C5F70; margin-bottom:34px; }
  h1 { font-family:'Frank Ruhl Libre',serif; font-weight:900; font-size:84px;
    line-height:1.1; letter-spacing:-0.02em; max-width:1000px; }
  .accent { color:#A8632B; }
  .sub { margin-top:38px; font-size:29px; color:#444; font-weight:600; max-width:900px; }
  .rule { margin-top:42px; width:120px; height:6px; background:#A8632B; border-radius:3px; }
  .name { position:absolute; bottom:78px; right:90px; font-size:26px; font-weight:700; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="brand">COR-SYS</div>
  <h1>30 יום <span class="accent">מהמסר</span><br>אל הלקוחות.</h1>
  <div class="sub">ייעוץ עסקי לעצמאים — נרטיב, הצעת ערך, מוצר, ו-10 פניות יוצאות.</div>
  <div class="rule"></div>
  <div class="name">ארז טל-שיר</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "networkidle" });
try {
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
} catch {
  /* fonts API unavailable; continue */
}
await page.waitForTimeout(500);
await page.screenshot({ path: OUT, type: "png" });
await browser.close();
console.log("wrote", OUT);
