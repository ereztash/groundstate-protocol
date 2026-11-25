import { describe, it, expect } from "vitest";
import { approvedClients, sessionMoments, testimonials, worksheetVoices } from "./clients";

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

/**
 * The session moments are the one place client words appear with no name
 * beside them, and the transcripts they were cut from are not in this
 * repository. So this cannot check them against a source. It checks what must
 * not be added: a name, a link, a date, or a field that could hold one.
 */
describe("session moments", () => {
  const firstNames = approvedClients.map((c) => c.name.split(" ")[0]);

  it("has moments to check", () => {
    expect(sessionMoments.length).toBeGreaterThan(0);
  });

  sessionMoments.forEach((turns, i) => {
    it(`moment ${i + 1} has a client's line and one of Erez's`, () => {
      const who = turns.map((t) => t.who);
      expect(who).toContain("client");
      expect(who).toContain("erez");
    });

    it(`moment ${i + 1} names nobody and points nowhere`, () => {
      for (const turn of turns) {
        const extra = Object.keys(turn).filter((k) => !["who", "text", "later"].includes(k));
        expect(extra).toEqual([]);
        expect(turn.text).not.toMatch(/https?:|\d/);
        for (const name of firstNames) {
          expect(turn.text.includes(name), `"${name}" appears in a session moment`).toBe(false);
        }
      }
    });
  });
});
