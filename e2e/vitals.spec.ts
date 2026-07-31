import { test, expect } from "@playwright/test";

/**
 * Core Web Vitals, measured on the production bundle under a throttled mobile
 * profile.
 *
 * The audit recorded LCP 224ms on desktop and 1,952ms on a weak mobile 4G
 * connection, with CLS 0, and then nothing held those numbers. Measured once is
 * a fact about a day; this is the part that makes it a property of the build.
 *
 * Thresholds are Google's "good" boundaries rather than the measured values.
 * That is deliberate: a gate pinned to today's number turns every unrelated
 * runner slowdown into a red build, gets muted, and then guards nothing. The
 * headroom between what this measures locally and the threshold is the margin
 * that keeps the signal trustworthy. If a change eats that margin, the number
 * to look at is the reported one, not the pass or fail.
 *
 * Throttling is applied over CDP rather than through a device preset, because
 * the CPU multiplier is the part that actually moves LCP on this page and no
 * device descriptor carries it.
 */

/** Google's "good" boundary. Above this a real visitor on 4G feels the wait. */
const LCP_BUDGET_MS = 2500;
/** Google's "good" boundary for cumulative layout shift. */
const CLS_BUDGET = 0.1;

/** Roughly a slow 4G line: 1.6 Mbps down, 750 kbps up, 150ms RTT. */
const NETWORK = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

/** Mid-range phone territory. The site's own audit assumed a weak device. */
const CPU_THROTTLE = 4;

test.describe("Core Web Vitals (production bundle, throttled mobile)", () => {
  test.slow();

  test("landing page stays inside the LCP and CLS budgets", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", NETWORK);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU_THROTTLE });

    // Registered before navigation so no entry is missed: both observers are
    // buffered, but the script has to exist in the document to receive them.
    await page.addInitScript(() => {
      const w = window as unknown as { __vitals: { lcp: number; cls: number } };
      w.__vitals = { lcp: 0, cls: 0 };

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // LCP is reported repeatedly as bigger candidates paint; the last one
          // before interaction is the real value.
          w.__vitals.lcp = entry.startTime;
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          // Shifts within 500ms of a user input are excluded from CLS by
          // definition; nothing here interacts, but the guard keeps the number
          // honest if a future test does.
          if (!shift.hadRecentInput) w.__vitals.cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto("/", { waitUntil: "load" });

    // Let late-arriving work land: lazy chunks, fonts swapping in, and any
    // shift they cause. A CLS number read at load fires before the shifts it
    // is supposed to catch.
    await page.waitForTimeout(3000);

    const vitals = await page.evaluate(
      () => (window as unknown as { __vitals: { lcp: number; cls: number } }).__vitals
    );

    console.log(
      `LCP ${Math.round(vitals.lcp)}ms (budget ${LCP_BUDGET_MS}ms) · ` +
        `CLS ${vitals.cls.toFixed(4)} (budget ${CLS_BUDGET})`
    );

    expect(vitals.lcp, "no LCP entry was recorded, so nothing was measured").toBeGreaterThan(0);
    expect(
      vitals.lcp,
      `LCP ${Math.round(vitals.lcp)}ms exceeds ${LCP_BUDGET_MS}ms on a throttled mobile profile`
    ).toBeLessThan(LCP_BUDGET_MS);
    expect(
      vitals.cls,
      `CLS ${vitals.cls.toFixed(4)} exceeds ${CLS_BUDGET}. Usually an image or ` +
        `font box that reserves no space before it loads.`
    ).toBeLessThan(CLS_BUDGET);
  });
});
