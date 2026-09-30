// Generates public/og-image.png (1200×630), public/apple-touch-icon.png (180)
// and the rasters for public/favicon.ico by screenshotting branded HTML with
// Playwright's chromium. Re-run after changing the brand:
//   node scripts/generate-og-image.mjs
//
// The card is what LinkedIn shows when the link is shared, so it carries the
// cor-brand signature («הנקודה»): charcoal ground, a field of strokes that all
// point at one copper point, and the site's headline ending in that point.
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "../public");

const FONTS =
  "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@700;900&family=Heebo:wght@500;700&display=swap";

// Same seeded field as src/components/landing/SignalField.tsx, laid out for
// the card: the point low on the left, the strokes fading with distance.
function field(w, h, px, py, seed) {
  let a = seed >>> 0;
  const rng = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const cols = 11;
  const rows = 9;
  const gx = w / cols;
  const gy = h / rows;
  const far = Math.hypot(w - px, py);
  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gx * (c + 0.5) + (rng() - 0.5) * gx * 0.55;
      const y = gy * (r + 0.5) + (rng() - 0.5) * gy * 0.55;
      const dist = Math.hypot(px - x, py - y);
      const near = Math.max(0, 1 - dist / far);
      if (dist < 50 || near < 0.08) continue;
      const len = 12 + near * 18;
      const ang = (Math.atan2(py - y, px - x) * 180) / Math.PI;
      const o = Math.min(1, 0.08 + near * near * 1.25).toFixed(2);
      out += `<line x1="${(x - len / 2).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + len / 2).toFixed(1)}" y2="${y.toFixed(1)}" stroke-opacity="${o}" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
  }
  return out;
}

const card = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:1200px; height:630px; }
  body { background:#1C1C2E; color:#F5F2ED; font-family:'Heebo',sans-serif; position:relative; overflow:hidden; }
  svg.field { position:absolute; left:0; top:0; width:560px; height:630px; }
  .copy { position:absolute; right:84px; top:92px; width:600px; }
  .over { font-size:22px; font-weight:700; letter-spacing:0.08em; color:#7DB3AE; }
  h1 { margin-top:26px; font-family:'Frank Ruhl Libre',serif; font-weight:900; font-size:68px; line-height:1.12; letter-spacing:-0.01em; }
  .pt { color:#B87333; }
  .sub { margin-top:30px; font-size:25px; font-weight:500; color:#ABA9B8; }
  .sign { position:absolute; right:84px; bottom:64px; display:flex; align-items:center; gap:14px; font-size:24px; font-weight:700; }
</style></head>
<body>
  <svg class="field" viewBox="0 0 560 630" aria-hidden="true">
    <g stroke="#7DB3AE" stroke-width="2.2" stroke-linecap="round">${field(560, 630, 190, 420, 0xc0a5e5)}</g>
    <circle cx="190" cy="420" r="30" fill="none" stroke="#7DB3AE" stroke-opacity="0.5" stroke-width="1.4"/>
    <circle class="cor-point" cx="190" cy="420" r="10" fill="#B87333"/>
  </svg>
  <div class="copy">
    <div class="over">COR-SYS · ליווי עסקי לעצמאים</div>
    <h1>עוד גרסה של ״מי אני״. ועוד אחת. אף אחת לא מחזיקה חודש<span class="pt">.</span></h1>
    <div class="sub">30 יום. 4 פגישות. 4 מסמכים שנשארים אצלכם.</div>
  </div>
  <div class="sign">ארז טל-שיר
    <svg viewBox="0 0 64 24" width="58" height="22" aria-hidden="true">
      <g fill="none" stroke="#F5F2ED" stroke-width="2.4" stroke-linecap="round">
        <line x1="52" y1="12" x2="60" y2="12" transform="rotate(-62 56 12)"/>
        <line x1="40" y1="12" x2="48" y2="12" transform="rotate(34 44 12)"/>
        <line x1="28" y1="12" x2="36" y2="12" transform="rotate(-16 32 12)"/>
        <line x1="16" y1="12" x2="24" y2="12"/>
      </g>
      <circle cx="7" cy="12" r="4.4" fill="#B87333"/>
    </svg>
  </div>
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
