import { describe, it, expect } from "vitest";
import { recommend } from "./stage-recommender";
import type { Answer } from "@/lib/wizardState";

/**
 * Logic tests for the wizard's `recommend()` function. The function maps
 * 4 ordered behavioral answers (0=fine, 1=ish, 2=problem) plus an optional
 * free-text answer into a stage recommendation.
 *
 * Test surface: single-problem, dual-problem (the 6 combinations), full-package,
 * all-zero augmentation, mild-mixed.
 */

const a = (n0: Answer, n1: Answer, n2: Answer, n3: Answer): Answer[] => [
  n0,
  n1,
  n2,
  n3,
];

describe("recommend()", () => {
  describe("single-problem cases (one answer is 2)", () => {
    it("narrative=2 → stage 1", () => {
      expect(recommend(a(2, 0, 0, 0), "")).toMatchObject({
        stage: "stage-1",
        number: "01",
        name: "נרטיב ייחודי",
      });
    });

    it("valueprop=2 → stage 2", () => {
      expect(recommend(a(0, 2, 0, 0), "")).toMatchObject({
        stage: "stage-2",
        number: "02",
      });
    });

    it("product=2 → stage 3", () => {
      expect(recommend(a(0, 0, 2, 0), "")).toMatchObject({
        stage: "stage-3",
        number: "03",
      });
    });

    it("outreach=2 → stage 4", () => {
      expect(recommend(a(0, 0, 0, 2), "")).toMatchObject({
        stage: "stage-4",
        number: "04",
      });
    });
  });

  describe("dual-problem cases (two answers are 2)", () => {
    it("narrative+valueprop → stage 1 (foundational wins) with cross-referenced reflection", () => {
      const r = recommend(a(2, 2, 0, 0), "");
      expect(r.stage).toBe("stage-1");
      expect(r.reflection).toContain("מהנהנים");
      expect(r.reflection).toContain("וואו");
    });

    it("narrative+product → stage 1 with narrative-product reflection", () => {
      const r = recommend(a(2, 0, 2, 0), "");
      expect(r.stage).toBe("stage-1");
      expect(r.reflection).toContain("מהנהנים");
      expect(r.reflection).toContain("Word ריק");
    });

    it("narrative+outreach → stage 1", () => {
      const r = recommend(a(2, 0, 0, 2), "");
      expect(r.stage).toBe("stage-1");
      expect(r.reflection).toContain("מהנהנים");
      expect(r.reflection).toContain("חודש הבא");
    });

    it("valueprop+product → stage 2", () => {
      const r = recommend(a(0, 2, 2, 0), "");
      expect(r.stage).toBe("stage-2");
      expect(r.reflection).toContain("וואו");
      expect(r.reflection).toContain("Word ריק");
    });

    it("valueprop+outreach → stage 2", () => {
      const r = recommend(a(0, 2, 0, 2), "");
      expect(r.stage).toBe("stage-2");
    });

    it("product+outreach → stage 3", () => {
      const r = recommend(a(0, 0, 2, 2), "");
      expect(r.stage).toBe("stage-3");
      expect(r.reflection).toContain("Word ריק");
    });
  });

  describe("multi-problem (3+ twos) → full package", () => {
    it("three twos → full package", () => {
      expect(recommend(a(2, 2, 2, 0), "")).toMatchObject({
        stage: "full-package",
        number: null,
      });
    });

    it("all four twos → full package", () => {
      expect(recommend(a(2, 2, 2, 2), "")).toMatchObject({
        stage: "full-package",
      });
    });
  });

  describe("no twos", () => {
    it("all zeros → stage 4 as augmentation (not 'you don't need me')", () => {
      const r = recommend(a(0, 0, 0, 0), "");
      expect(r.stage).toBe("stage-4");
      expect(r.reflection).toContain("מצב טוב");
    });

    it("mostly zeros with some ones (sum ≤ 2) → stage 1 (sharpen)", () => {
      const r = recommend(a(1, 1, 0, 0), "");
      expect(r.stage).toBe("stage-1");
    });

    it("many ones (sum 3+, but no twos) → still stage 1 (mild path; full-package gated on twos)", () => {
      const r = recommend(a(1, 1, 1, 1), "");
      expect(r.stage).toBe("stage-1");
    });
  });

  describe("open-text personalization", () => {
    it("empty open text → reflection unchanged", () => {
      const r = recommend(a(2, 0, 0, 0), "");
      expect(r.reflection.startsWith("כתבת")).toBe(false);
    });

    it("non-empty open text → reflection prepends a quote of the user's words", () => {
      const userInput = "אני לא יודע איך להציג את עצמי";
      const r = recommend(a(2, 0, 0, 0), userInput);
      expect(r.reflection.startsWith("כתבת:")).toBe(true);
      expect(r.reflection).toContain(userInput);
    });

    it("open text longer than 200 chars is truncated in the quote", () => {
      const long = "א".repeat(300);
      const r = recommend(a(2, 0, 0, 0), long);
      // The quoted portion should be at most 200 chars
      const quoteMatch = r.reflection.match(/״([^״]+)״/);
      expect(quoteMatch).not.toBeNull();
      expect(quoteMatch![1].length).toBeLessThanOrEqual(200);
    });

    it("whitespace-only open text is treated as empty", () => {
      const r = recommend(a(2, 0, 0, 0), "   \n\t  ");
      expect(r.reflection.startsWith("כתבת")).toBe(false);
    });
  });

  describe("CTA copy", () => {
    it("exposes price in primary CTA for every recommendation path", () => {
      // every stage's ctaPrimary should mention a shekel sign
      const cases: Answer[][] = [
        a(2, 0, 0, 0),
        a(0, 2, 0, 0),
        a(0, 0, 2, 0),
        a(0, 0, 0, 2),
        a(2, 2, 0, 0),
        a(2, 2, 2, 0),
        a(0, 0, 0, 0),
        a(1, 1, 1, 1),
      ];
      for (const ans of cases) {
        const r = recommend(ans, "");
        // Currency is the ₪-prefix form site-wide (see stages.ts) — the page
        // previously mixed "1,000 ש״ח", "1,000 ₪" and "₪1,000".
        expect(r.ctaPrimary).toMatch(/₪[\d,]+/);
      }
    });
  });
});
