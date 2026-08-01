#!/usr/bin/env node
/**
 * Transfer-size budget for the built bundle.
 *
 * The audit recorded a 150 kB gzip budget and a WebGL layer measured at 221,
 * and then noted the thing that actually matters: "אין מדד". A budget written
 * in a document is a number nobody is holding. This holds it.
 *
 * Two deliberate design choices:
 *
 * 1. The enforced ceiling is set from what the bundle weighs today, not from
 *    the target. A gate that fails on the day it lands gets switched off within
 *    a week, and then there is no gate at all. This is a ratchet: it stops the
 *    number growing, and `target` records where it should end up so the gap
 *    stays visible rather than being quietly absorbed into the limit.
 *
 * 2. Initial payload and lazy chunks are budgeted separately, because they are
 *    not the same cost. A gated, lazily-imported chunk is not on a first
 *    paint's critical path, so summing it into one total would report a weight
 *    no visitor actually pays and would bury the number that does matter.
 *
 * The lazy ceiling was 222 kB when this landed, sized around a WebGL layer that
 * three.js made 216 kB gzip. Rewriting that layer against the WebGL context
 * directly took it to 3 kB, so the ceiling came down with it. A budget left at
 * the old number after the thing it was sized for went away is not a lenient
 * budget, it is an inactive one.
 *
 * Measured in gzip because that is what crosses the wire. GitHub Pages serves
 * gzip; brotli would be smaller still, so this is the conservative reading.
 */

import { gzipSync } from "node:zlib";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const KB = 1024;

/**
 * Ceilings in kB gzip. `limit` fails the build. `target` is where the number
 * should be and is reported, never enforced.
 */
export const BUDGETS = {
  /** Everything dist/index.html references: the cost of a first landing view. */
  initial: { limit: 152, target: 140 },
  /** Any single lazy chunk. The largest is now framer-motion at ~40 kB. */
  lazyChunk: { limit: 46, target: 42 },
  /** The stylesheet, which is render-blocking and so is called out on its own. */
  css: { limit: 15, target: 13 },
};

/** kB, to one decimal, from a byte count. */
export function kb(bytes) {
  return Math.round((bytes / KB) * 10) / 10;
}

/**
 * Pure evaluation, split from the filesystem so it can be tested without a
 * build. Returns every row plus the ones over budget; the caller decides what
 * to do about them.
 */
export function evaluate(measured, budgets = BUDGETS) {
  const rows = measured.map((m) => {
    const budget = budgets[m.budget];
    if (!budget) throw new Error(`no budget named "${m.budget}"`);
    return {
      ...m,
      kb: kb(m.bytes),
      limit: budget.limit,
      target: budget.target,
      over: kb(m.bytes) > budget.limit,
      aboveTarget: kb(m.bytes) > budget.target,
    };
  });
  return { rows, breaches: rows.filter((r) => r.over) };
}

/**
 * Asset paths dist/index.html pulls in directly, normalised to dist-relative.
 *
 * Absolute URLs are dropped rather than normalised: a cross-origin asset is not
 * ours to weigh, and an absolute loopback URL is the prerender bug this file was
 * written alongside. Either way it must not silently join the initial payload,
 * and it must not inflate the file count in the report while contributing no
 * bytes, which is how the label read "4 files" for a two-file payload.
 */
export function initialAssets(html) {
  return [
    ...new Set(
      [...html.matchAll(/(?:src|href)="([^"]*assets\/[^"]+\.(?:js|css))"/g)]
        .map((m) => m[1])
        .filter((u) => !/^(https?:)?\/\//.test(u))
        .map((u) => u.replace(/^\.?\//, ""))
    ),
  ];
}

function main() {
  const dist = join(process.cwd(), "dist");
  const indexHtml = join(dist, "index.html");

  if (!existsSync(indexHtml)) {
    console.error("check-budget: dist/index.html not found. Run the build first.");
    process.exit(2);
  }

  const referenced = initialAssets(readFileSync(indexHtml, "utf8"));
  if (referenced.length === 0) {
    // A silent zero here would pass the budget for the wrong reason, which is
    // the failure mode a size gate is least able to notice about itself.
    console.error("check-budget: no assets referenced from dist/index.html.");
    process.exit(2);
  }

  const gz = (p) => gzipSync(readFileSync(p)).length;
  const measured = [];

  let initialBytes = 0;
  for (const rel of referenced) {
    const file = join(dist, rel);
    if (!existsSync(file)) continue;
    const bytes = gz(file);
    initialBytes += bytes;
    if (rel.endsWith(".css")) {
      measured.push({ name: basename(rel), bytes, budget: "css" });
    }
  }
  measured.unshift({
    name: `initial payload (${referenced.length} files)`,
    bytes: initialBytes,
    budget: "initial",
  });

  const assetsDir = join(dist, "assets");
  for (const entry of readdirSync(assetsDir)) {
    if (!entry.endsWith(".js")) continue;
    const rel = `assets/${entry}`;
    if (referenced.includes(rel)) continue;
    measured.push({ name: entry, bytes: gz(join(assetsDir, entry)), budget: "lazyChunk" });
  }

  const { rows, breaches } = evaluate(measured);

  const width = Math.max(...rows.map((r) => r.name.length));
  console.log("\ntransfer size, gzip (kB)\n");
  for (const r of rows.sort((a, b) => b.kb - a.kb)) {
    const flag = r.over ? "OVER" : r.aboveTarget ? "  ^ " : "  ok";
    const toward = r.aboveTarget && !r.over ? `  target ${r.target}` : "";
    console.log(
      `${flag}  ${r.name.padEnd(width)}  ${String(r.kb).padStart(7)}  / ${r.limit}${toward}`
    );
  }

  if (breaches.length > 0) {
    console.error("\nover budget:\n");
    for (const b of breaches) {
      console.error(
        `  ${b.name}: ${b.kb} kB gzip, ceiling ${b.limit} kB (target ${b.target} kB)`
      );
    }
    console.error(
      "\nThe ceiling is a ratchet set from what the bundle already weighed, so\n" +
        "crossing it means this change added weight. Either bring it back under,\n" +
        "or raise the ceiling deliberately in scripts/check-budget.mjs and say why\n" +
        "in the commit. Do not raise it as a reflex to get the build green.\n"
    );
    process.exit(1);
  }

  const drifting = rows.filter((r) => r.aboveTarget);
  console.log(
    `\nwithin budget. ${drifting.length} of ${rows.length} above target.\n`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
