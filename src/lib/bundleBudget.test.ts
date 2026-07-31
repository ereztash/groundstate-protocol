import { describe, it, expect } from "vitest";
import { BUDGETS, kb, evaluate, initialAssets } from "../../scripts/check-budget.mjs";

/**
 * A size gate is only worth having if it fails. The failure mode of this kind
 * of script is not a wrong number, it is a scan that quietly matches nothing
 * and reports success, which reads exactly like being under budget.
 *
 * So the load-bearing tests here are the ones about what gets counted: that an
 * absolute URL never joins the initial payload, and that a breach is reported
 * as a breach rather than rounded away.
 */

describe("kb", () => {
  it("converts bytes to kB at one decimal", () => {
    expect(kb(1024)).toBe(1);
    expect(kb(151079)).toBe(147.5);
    expect(kb(0)).toBe(0);
  });
});

describe("initialAssets", () => {
  it("collects relative js and css, normalised", () => {
    const html = `
      <link rel="stylesheet" href="./assets/index-abc.css">
      <script type="module" src="./assets/index-def.js"></script>
    `;
    expect(initialAssets(html)).toEqual(["assets/index-abc.css", "assets/index-def.js"]);
  });

  it("drops absolute loopback URLs left by the prerender capture server", () => {
    // The exact shape that shipped: modulepreload hrefs pointing at the
    // throwaway server the prerender ran on. Counting them inflated the file
    // count while contributing zero bytes, because the path does not exist.
    const html = `
      <script type="module" src="./assets/index-def.js"></script>
      <link rel="modulepreload" href="http://127.0.0.1:43351/assets/proxy-xyz.js">
    `;
    expect(initialAssets(html)).toEqual(["assets/index-def.js"]);
  });

  it("drops cross-origin and protocol-relative assets", () => {
    const html = `
      <link rel="stylesheet" href="https://cdn.example.com/assets/x.css">
      <script src="//cdn.example.com/assets/y.js"></script>
      <script type="module" src="./assets/ours.js"></script>
    `;
    expect(initialAssets(html)).toEqual(["assets/ours.js"]);
  });

  it("returns nothing when there is nothing to find", () => {
    // Guards the silent-zero path: main() treats this as a hard error rather
    // than a pass, and this pins the shape it keys on.
    expect(initialAssets("<html><body>no assets</body></html>")).toEqual([]);
  });

  it("de-duplicates a reference that appears as both preload and script", () => {
    const html = `
      <link rel="modulepreload" href="./assets/index-def.js">
      <script type="module" src="./assets/index-def.js"></script>
    `;
    expect(initialAssets(html)).toEqual(["assets/index-def.js"]);
  });
});

describe("evaluate", () => {
  const budgets = { initial: { limit: 100, target: 80 } };

  it("passes under the limit and flags nothing", () => {
    const { rows, breaches } = evaluate(
      [{ name: "initial", bytes: 50 * 1024, budget: "initial" }],
      budgets
    );
    expect(breaches).toEqual([]);
    expect(rows[0].aboveTarget).toBe(false);
  });

  it("separates above-target from over-limit", () => {
    // The distinction the ratchet depends on: 90 kB is worse than the target
    // and must be visible, but failing on it would mean the gate lands red and
    // gets switched off.
    const { rows, breaches } = evaluate(
      [{ name: "initial", bytes: 90 * 1024, budget: "initial" }],
      budgets
    );
    expect(breaches).toEqual([]);
    expect(rows[0].aboveTarget).toBe(true);
    expect(rows[0].over).toBe(false);
  });

  it("reports a breach over the limit", () => {
    const { breaches } = evaluate(
      [{ name: "initial", bytes: 101 * 1024, budget: "initial" }],
      budgets
    );
    expect(breaches).toHaveLength(1);
    expect(breaches[0].kb).toBe(101);
  });

  it("does not round a breach away at the boundary", () => {
    // 100.04 kB rounds to 100.0 and must pass; 100.06 rounds to 100.1 and must
    // fail. Without this, a rounding change could turn the gate off by a hair.
    const under = evaluate(
      [{ name: "x", bytes: Math.round(100.04 * 1024), budget: "initial" }],
      budgets
    );
    const over = evaluate(
      [{ name: "x", bytes: Math.round(100.06 * 1024), budget: "initial" }],
      budgets
    );
    expect(under.breaches).toEqual([]);
    expect(over.breaches).toHaveLength(1);
  });

  it("throws on a budget name that does not exist", () => {
    expect(() =>
      evaluate([{ name: "x", bytes: 1, budget: "nope" }], budgets)
    ).toThrow(/no budget named/);
  });
});

describe("the shipped budgets", () => {
  it("sets every limit at or above its target", () => {
    // A limit below its target would mean the ratchet demands something the
    // target says is already good enough, which is incoherent rather than
    // strict.
    for (const [name, b] of Object.entries(BUDGETS) as [
      string,
      { limit: number; target: number },
    ][]) {
      expect(b.limit, `${name}: limit below target`).toBeGreaterThanOrEqual(b.target);
    }
  });

  it("keeps the initial payload budget under the 170 kB mobile guideline", () => {
    // The number this site is actually judged on: what a first landing view
    // costs. Anything above roughly 170 kB gzip stops being defensible on a
    // weak mobile connection regardless of what the ratchet currently allows.
    expect(BUDGETS.initial.limit).toBeLessThanOrEqual(170);
  });
});
