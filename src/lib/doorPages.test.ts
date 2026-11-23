import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Door pages (2026-11-23): an article with `step: sentence` in its frontmatter.
 *
 * Erez, 23.11: the hook is the reader's problem, which is what brings them to
 * the page, and the answer is the result he promises. The map of the sprint
 * buyer (22.11) gives two barriers this file can hold in code:
 *
 * - The fear of paying for help is its own barrier, so a door page carries no
 *   word on payment, and not "free" either. The site's call box says "ללא
 *   תשלום", which is why a door page does not show it.
 * - The page opens on the reader's moment, so the body starts with a sentence,
 *   not a heading, and the first heading comes only after the result.
 */
const DIR = join(process.cwd(), "content", "insights");
const PAY = /תשלום|לשלם|בחינם|חינם|ללא עלות|בלי עלות|מחיר מיוחד|הנחה/;

const doors = readdirSync(DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ file: f, raw: readFileSync(join(DIR, f), "utf8") }))
  .filter(({ raw }) => /^step:\s*sentence\s*$/m.test(raw.split(/\r?\n---/)[0]));

describe("door pages", () => {
  it("exist", () => {
    expect(doors.length).toBeGreaterThan(0);
  });

  it.each(doors)("$file carries no word on payment", ({ raw }) => {
    const hits = raw.split(/\r?\n/).filter((l) => PAY.test(l));
    expect(hits).toEqual([]);
  });

  it.each(doors)("$file opens on the reader, with three paragraphs before any heading", ({ raw }) => {
    const body = raw.replace(/^---[\s\S]*?\r?\n---\r?\n/, "").trim();
    const blocks = body.split(/\r?\n\s*\r?\n/);
    const firstHeading = blocks.findIndex((b) => b.startsWith("#"));
    expect(firstHeading === -1 || firstHeading >= 3).toBe(true);
  });
});
