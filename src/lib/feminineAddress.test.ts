import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { walk, stripComments } from "./copyScan";

/**
 * The site addresses its reader in the feminine.
 *
 * Operator decision 2026-08-01: roughly 70% of clients are women. Hebrew has no
 * neutral second person, so "generic" masculine is not neutral — it is a choice
 * that happens to be invisible, and it was being made against the majority of
 * the people reading. The feminine is marked, which is the point: it is the
 * fastest signal a visitor gets that the page is talking to her.
 *
 * Enforced in CI because a default is exactly what creeps back. Every future
 * copy edit will be written in the register the writer thinks in, and one
 * "אתה" in a new section is invisible in review and jarring on the page.
 *
 * SCOPE, and its limit: this checks the pronoun, not every conjugation. In
 * unvocalised Hebrew the second-person-masculine future is homographic with the
 * third-person-feminine future — תקבל is both "you (m) will receive" and "she
 * will receive" — so banning those forms would flag "המערכת תקבל" and every
 * sentence like it. The pronoun is unambiguous, it is what a writer reaches for
 * first, and a section written in masculine will always contain one. Verb
 * agreement is left to review.
 *
 * Note that many forms need no rule at all: שלך, לך, אותך, איתך, עצמך, אמרת,
 * ניסית and עבדת are spelled identically in both genders unvocalised, and were
 * already addressing everyone.
 */

const ROOT = process.cwd();
const SCAN = [
  join(ROOT, "src"),
  join(ROOT, "content"),
  join(ROOT, "public"),
  join(ROOT, "index.html"),
];
const CODE_EXT = new Set([".ts", ".tsx"]);
const TEXT_EXT = new Set([".md", ".txt", ".html"]);

/** This file necessarily contains the pronoun it bans. */
const SELF = "feminineAddress.test.ts";

/**
 * Files exempt for a reason, not for convenience.
 *
 * `clients.ts` is verbatim third-party testimony. Conjugating a named person's
 * sentences so they match a house style would misquote someone who linked their
 * own LinkedIn profile to those words, which is the same reason noDashes.test.ts
 * yields on this file.
 *
 * `why-prompt-engineering-fails.md` is an article about prompting whose worked
 * examples are prompts, and a prompt addresses a model: "אתה יועץ ארגוני בכיר"
 * is the text you type, not the reader being spoken to. Rewriting those would
 * make the examples wrong.
 *
 * `pages/Index.tsx` is not routed in App.tsx and ships in no bundle. It is dead
 * scaffolding from another project, and it is listed here rather than converted
 * so the exemption stays visible until someone deletes the file.
 */
const EXEMPT = [
  "src/lib/clients.ts",
  "content/insights/why-prompt-engineering-fails.md",
  "src/pages/Index.tsx",
];

/**
 * Masculine second-person pronoun, standalone or with a ו/ש/כש prefix. The
 * lookarounds are Hebrew-letter boundaries rather than \b, which does not treat
 * Hebrew as word characters the way this needs.
 */
const MASCULINE_YOU = /(?<![א-ת])(אתה|ואתה|שאתה|כשאתה)(?![א-ת])/;

/**
 * Blanks verbatim testimony inside the structured data before scanning.
 *
 * index.html carries client reviews in JSON-LD, and a review is the client's
 * sentences. The rest of that file, including the FAQPage answers and the meta
 * descriptions, stays in scope: those are the site's own words, and the FAQ
 * answers are additionally pinned to src/data/faq.ts by faq.test.ts.
 */
function blankReviewBodies(text: string): string {
  return text.replace(/"reviewBody":"(?:[^"\\]|\\.)*"/g, '"reviewBody":""');
}

function displayedCopy(path: string): string | null {
  const ext = extname(path);
  if (CODE_EXT.has(ext)) return stripComments(readFileSync(path, "utf8"));
  if (TEXT_EXT.has(ext)) {
    const raw = readFileSync(path, "utf8");
    return ext === ".html" ? blankReviewBodies(raw) : raw;
  }
  return null;
}

describe("displayed copy addresses the reader in the feminine", () => {
  const files = SCAN.flatMap((p) =>
    statSync(p).isDirectory() ? walk(p) : [p]
  ).filter(
    (f) =>
      !f.endsWith(SELF) &&
      !EXEMPT.some((e) => f.endsWith(e.replace(/\//g, "/")))
  );

  it("scans a non-trivial number of files", () => {
    const scanned = files.filter((f) => displayedCopy(f) !== null);
    expect(scanned.length).toBeGreaterThan(50);
  });

  it("still scans the files most likely to regress", () => {
    // A typo in a SCAN root would leave this suite green over nothing. These
    // three carry most of the reader-facing prose.
    const rel = files.map((f) => f.replace(ROOT + "/", ""));
    expect(rel).toContain("src/components/landing/Hero.tsx");
    expect(rel).toContain("src/data/faq.ts");
    expect(rel).toContain("public/llms.txt");
  });

  it("uses no masculine second-person pronoun", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const copy = displayedCopy(file);
      if (copy === null) continue;

      copy.split("\n").forEach((line, i) => {
        if (MASCULINE_YOU.test(line)) {
          offenders.push(
            `${file.replace(ROOT + "/", "")}:${i + 1}  ${line.trim().slice(0, 120)}`
          );
        }
      });
    }

    expect(
      offenders,
      `Masculine second person in displayed copy. The site addresses the reader as "את".\nIf this is verbatim client testimony or a prompt example, add the file to EXEMPT with the reason.\n\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
