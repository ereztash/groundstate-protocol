// Generates public/og-image.png (1200×630), public/apple-touch-icon.png (180)
// and the rasters for public/favicon.ico by screenshotting branded HTML with
// Playwright's chromium. Re-run after changing the brand:
//   node scripts/generate-og-image.mjs
//
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../public");

const FONTS =
  "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@700;900&family=Heebo:wght@500;700&display=swap";

// The card LinkedIn shows when the link is shared. v4 (2026-10-01): on paper,
// like the site's first screen, with the offer-first headline. The charcoal
// card with the signal field went with the charcoal hero, after the brand test
// found the target group recognised that look and disliked it.
const card = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  body { background:#EFE9DD; color:#1C1C2E; font-family:'Heebo',sans-serif; position:relative; overflow:hidden; }
  .sheet { position:absolute; inset:48px 56px; background:#F7F4EE; border:1px solid #D6CDBC; border-radius:2px; box-shadow:0 22px 44px -28px rgba(28,28,46,.38); }
  .copy { position:absolute; right:110px; top:110px; width:860px; }
  .over { font-size:24px; font-weight:700; letter-spacing:0.06em; color:#2A6B6B; }
  h1 { margin-top:24px; font-family:'Frank Ruhl Libre',serif; font-weight:900; font-size:72px; line-height:1.12; letter-spacing:-0.01em; }
  .pt { color:#B87333; }
  .sub { margin-top:28px; font-size:28px; font-weight:500; color:#45455A; }
  .sign { position:absolute; right:110px; bottom:96px; display:flex; align-items:center; gap:14px; font-size:24px; font-weight:700; }
  .price { position:absolute; left:110px; bottom:92px; font-family:'Frank Ruhl Libre',serif; font-weight:900; font-size:44px; color:#B87333; direction:ltr; }
</style></head>
<body>
  <div class="sheet"></div>
  <div class="copy">
    <div class="over">COR-SYS · ליווי עסקי לעצמאים · 30 יום</div>
    <h1>יודעים לעשות את העבודה. לא יודעים איך למכור אותה<span class="pt">.</span></h1>
    <div class="sub">ארבע פגישות. מה שאתם כבר יודעים נארז כמוצר אחד עם מחיר.</div>
  </div>
  <div class="sign">ארז טל-שיר
    <svg viewBox="0 0 64 24" width="58" height="22" aria-hidden="true">
      <g fill="none" stroke="#1C1C2E" stroke-width="2.4" stroke-linecap="round">
        <line x1="52" y1="12" x2="60" y2="12" transform="rotate(-62 56 12)"/>
        <line x1="40" y1="12" x2="48" y2="12" transform="rotate(34 44 12)"/>
        <line x1="28" y1="12" x2="36" y2="12" transform="rotate(-16 32 12)"/>
        <line x1="16" y1="12" x2="24" y2="12"/>
      </g>
      <circle cx="7" cy="12" r="4.4" fill="#B87333"/>
    </svg>
  </div>
  <div class="price">₪4,000</div>
</body></html>`;

const favicon = readFileSync(path.join(PUBLIC, "favicon.svg"), "utf8");
const iconPage = (size) =>
  `<!doctype html><html><head><style>*{margin:0}html,body{width:${size}px;height:${size}px;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style></head><body>${favicon}</body></html>`;

const browser = await chromium.launch();

async function render(html, width, height, out, { transparent = false } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle" });
  try {
    await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
  } catch {
    /* fonts API unavailable; continue */
  }
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ type: "png", omitBackground: transparent });
  await page.close();
  if (out) writeFileSync(out, buf);
  return buf;
}

await render(card, 1200, 630, path.join(PUBLIC, "og-image.png"));
await render(iconPage(180), 180, 180, path.join(PUBLIC, "apple-touch-icon.png"));

// favicon.ico: PNG-compressed entries (Vista+ and every current browser read
// them), 16, 32 and 48 px, written by hand so no image library is needed.
const sizes = [16, 32, 48];
const pngs = [];
for (const s of sizes) pngs.push(await render(iconPage(s), s, s, null, { transparent: true }));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync(path.join(PUBLIC, "favicon.ico"), Buffer.concat([header, ...pngs]));

await browser.close();
console.log("wrote og-image.png, apple-touch-icon.png, favicon.ico");
