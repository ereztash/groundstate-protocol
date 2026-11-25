import { describe, it, expect } from "vitest";
import { testimonials, worksheetVoices } from "./clients";

/**
 * The pull-quote rule.
 *
 * ClientProofSection shows `pullQuote` first and hides the rest behind a
 * <details>. That is only honest while the short version is a literal extract:
 * the moment someone "tidies" it, the site is displaying a sentence in
 * quotation marks, over a named person's photo, next to a link to their
 * LinkedIn, that they did not write. clients.ts bars editing client words, and
 * this is the one place the code could break that rule without it being
 * obvious on screen.
 */
describe("client testimonials", () => {
  it("has testimonials to check", () => {
    expect(testimonials.length).toBeGreaterThan(0);
  });

  for (const t of testimonials) {
    if (!t.pullQuote) continue;

    it(`pull quote for ${t.attribution} is verbatim from the full quote`, () => {
      expect(
        t.quote.includes(t.pullQuote!),
        `pullQuote for ${t.attribution} is not a literal substring of quote.\n\npullQuote: ${t.pullQuote}`
      ).toBe(true);
    });

    it(`pull quote for ${t.attribution} is shorter than the quote`, () => {
      // A pull quote as long as the original hides nothing and just adds a
      // control that does nothing when pressed.
      expect(t.pullQuote!.length).toBeLessThan(t.quote.length);
    });
  }
});

/**
 * The same rule for the worksheet page, which shows single sentences instead
 * of whole recommendations. A sentence there has no "read more" beside it, so
 * the only thing keeping it honest is that it is cut from the source and not
 * retyped.
 */
describe("worksheet voices", () => {
  for (const [key, voice] of Object.entries(worksheetVoices)) {
    it(`${key} is verbatim from ${voice.attribution}'s recommendation`, () => {
      const source = testimonials.find((t) => t.attribution === voice.attribution);
      expect(source, `no testimonial for ${voice.attribution}`).toBeDefined();
      expect(source!.quote.includes(voice.text)).toBe(true);
      expect(source!.linkedin).toBe(voice.linkedin);
    });
  }
});
