import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stripComments } from "@/lib/copyScan";
import { program } from "./sprint-stages";
import { PROMO90_ENDS_AT, isPromo90Live, promo90 } from "./promo90";

/**
 * The 90-day offer says what the ad of 2026-11-22 says, and nothing that was
 * not decided. See promo90.ts for the source.
 */

const ROOT = process.cwd();
const COPY_FILES = [
  "src/data/promo90.ts",
  "src/components/landing/Promo90Section.tsx",
];
const copy = COPY_FILES.map((f) => stripComments(readFileSync(join(ROOT, f), "utf8"))).join("\n");

describe("promo90: what was decided", () => {
  it("is ₪8,000 for up to 12 meetings over up to 90 days", () => {
    expect(promo90.priceNis).toBe(8000);
    expect(promo90.priceLabel).toBe("₪8,000");
    expect(promo90.meetings).toContain("12");
    expect(promo90.meetings).toContain("90");
  });

  it("compares with three months of the monthly programme, read from its price", () => {
    expect(promo90.compareNis).toBe(program.priceNis * 3);
    expect(promo90.compareNis).toBe(12000);
    expect(promo90.compareLabel).toBe("₪12,000");
  });
});

describe("promo90: what was not decided stays off the page", () => {
  // Erez, 2026-11-22: instalments, cancellation and refund are not decided.
  const UNDECIDED: { what: string; pattern: RegExp }[] = [
    { what: "instalments", pattern: /תשלומים|פריסה|פריסת|בתשלום/ },
    { what: "cancellation", pattern: /ביטול|לבטל/ },
    { what: "refund", pattern: /החזר|מחזיר|ערבות|התחייבות/ },
    { what: "VAT status", pattern: /מע״מ|מע"מ/ },
  ];
  for (const { what, pattern } of UNDECIDED) {
    it(`does not mention ${what}`, () => {
      expect(copy).not.toMatch(pattern);
    });
  }
});

describe("promo90: ends with 30.11 at midnight, Israel time", () => {
  it("is live on 30.11 at 23:59 in Israel", () => {
    expect(isPromo90Live(Date.parse("2026-11-30T23:59:00+02:00"))).toBe(true);
  });

  it("is gone at 1.12 00:00 in Israel", () => {
    expect(PROMO90_ENDS_AT).toBe(Date.parse("2026-12-01T00:00:00+02:00"));
    expect(isPromo90Live(Date.parse("2026-12-01T00:00:00+02:00"))).toBe(false);
  });

  it("has a rebuild scheduled right after the deadline, so the static HTML drops it", () => {
    const deploy = readFileSync(join(ROOT, ".github/workflows/deploy.yml"), "utf8");
    // 22:10 UTC on 30.11 is 00:10 on 1.12 in Israel.
    expect(deploy).toMatch(/cron:\s*["']10 22 30 11 \*["']/);
  });
});
