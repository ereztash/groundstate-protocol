import { describe, it, expect } from "vitest";
import { getCtaCopy } from "@/lib/dwellCopy";

describe("getCtaCopy()", () => {
  it("returns a non-empty string for every phase", () => {
    expect(getCtaCopy("fresh").length).toBeGreaterThan(0);
    expect(getCtaCopy("engaged").length).toBeGreaterThan(0);
    expect(getCtaCopy("committed").length).toBeGreaterThan(0);
    expect(getCtaCopy("returning").length).toBeGreaterThan(0);
  });

  it("each phase returns a distinct copy", () => {
    const copies = new Set([
      getCtaCopy("fresh"),
      getCtaCopy("engaged"),
      getCtaCopy("committed"),
      getCtaCopy("returning"),
    ]);
    expect(copies.size).toBe(4);
  });

  it("all copies fit in a mobile CTA (under 40 chars to leave layout room)", () => {
    // The sticky mobile CTA renders these inside an h-12 button; long copies wrap.
    for (const phase of ["fresh", "engaged", "committed", "returning"] as const) {
      expect(getCtaCopy(phase).length).toBeLessThanOrEqual(40);
    }
  });

  it("returning phase explicitly recognizes the visitor returning", () => {
    expect(getCtaCopy("returning")).toMatch(/חזרת|שמחתי/);
  });

  it("fresh phase is the canonical pitch", () => {
    expect(getCtaCopy("fresh")).toContain("20 דקות");
  });
});
