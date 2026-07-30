import { describe, it, expect } from "vitest";
import { isSpotsCountStale, SPOTS_STALE_AFTER_DAYS } from "./spots";

/**
 * The scarcity line is the one place on the site that makes a claim nobody is
 * watching: it reads a spreadsheet cell, and a cell nobody updated still
 * renders as "נותרו 3 מקומות החודש". These cases pin the rule that decides
 * whether a number is allowed to be shown at all.
 */

const NOW = Date.parse("2026-07-30T12:00:00Z");
const daysAgo = (n: number) =>
  new Date(NOW - n * 86_400_000).toISOString();

describe("isSpotsCountStale", () => {
  it("treats an absent field as fresh, so a not-yet-redeployed script keeps working", () => {
    // The deployed Apps Script may predate the freshness stamp. Failing closed
    // here would silently kill a counter that is being maintained.
    expect(isSpotsCountStale(undefined, NOW)).toBe(false);
  });

  it("treats a supported-but-never-stamped cell as stale", () => {
    // The script knows about the stamp and reports it empty — that is a real
    // signal that nobody has touched the count.
    expect(isSpotsCountStale(null, NOW)).toBe(true);
  });

  it("accepts a count edited today", () => {
    expect(isSpotsCountStale(daysAgo(0), NOW)).toBe(false);
  });

  it("accepts a count edited just inside the window", () => {
    expect(isSpotsCountStale(daysAgo(SPOTS_STALE_AFTER_DAYS - 0.5), NOW)).toBe(
      false,
    );
  });

  it("rejects a count edited past the window", () => {
    expect(isSpotsCountStale(daysAgo(SPOTS_STALE_AFTER_DAYS + 0.5), NOW)).toBe(
      true,
    );
  });

  it("rejects a badly-formatted timestamp rather than trusting the number", () => {
    expect(isSpotsCountStale("not a date", NOW)).toBe(true);
  });

  it("rejects a future timestamp only once it is not merely clock skew", () => {
    // A stamp slightly ahead of the client clock is skew, not staleness.
    expect(isSpotsCountStale(daysAgo(-0.1), NOW)).toBe(false);
  });
});
