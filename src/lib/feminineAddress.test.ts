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
 * SCOPE, and its limit: this checks the pronoun and a short list of imperatives,
 * not every conjugation. In unvocalised Hebrew the second-person-masculine
 * future is homographic with the third-person-feminine future — תקבל is both
 * "you (m) will receive" and "she will receive" — so banning those forms would
 * flag "המערכת תקבל" and every sentence like it. The pronoun is unambiguous, it
 * is what a writer reaches for first, and a section written in masculine will
 * always contain one. Remaining verb agreement is left to review.
 *
 * The imperative list was added on 2026-08-01, after the pronoun rule went green
 * while "בוא נדבר" was still the header CTA on every page. An imperative carries
 * no pronoun, so the first rule could not see it, and it is the one form a
 * writer uses without noticing the register: "בוא נדבר" reads as an idiom rather
 * than as addressing a man. Only forms with no other reading are listed, which
 * is why it is five words and not fifty — בדוק is also "verified", כתוב is also
 * "written", עשה and נסה and שאל are also third-person past. Those stay out.
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
 */
const EXEMPT = [
  "src/lib/clients.ts",
  "content/insights/why-prompt-engineering-fails.md",
];

/**
 * Masculine second-person pronoun, standalone or with a ו/ש/כש prefix. The
 * lookarounds are Hebrew-letter boundaries rather than \b, which does not treat
 * Hebrew as word characters the way this needs.
 */
const MASCULINE_YOU = /(?<![א-ת])(אתה|ואתה|שאתה|כשאתה)(?![א-ת])/;

/**
 * Masculine singular imperatives that have no second reading, with an optional
 * ו prefix. Each one's feminine differs by a letter that a reader notices:
 * בואי, קחי, תני, שימי, דמייני.
 *
 * The plural בואו is deliberately absent. It addresses a group, where the
 * masculine plural is the only form Hebrew offers for a mixed one, and the
 * decision recorded above is about how the site speaks to one reader.
 */
const MASCULINE_IMPERATIVE = /(?<![א-ת])ו?(בוא|קח|תן|שים|דמיין)(?![א-ת])/;

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

  const scanFor = (re: RegExp): string[] => {
    const offenders: string[] = [];

    for (const file of files) {
      const copy = displayedCopy(file);
      if (copy === null) continue;

      copy.split("\n").forEach((line, i) => {
        if (re.test(line)) {
          offenders.push(
            `${file.replace(ROOT + "/", "")}:${i + 1}  ${line.trim().slice(0, 120)}`
          );
        }
      });
    }

    return offenders;
  };

  it("uses no masculine second-person pronoun", () => {
    const offenders = scanFor(MASCULINE_YOU);

    expect(
      offenders,
      `Masculine second person in displayed copy. The site addresses the reader as "את".\nIf this is verbatim client testimony or a prompt example, add the file to EXEMPT with the reason.\n\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("uses no masculine imperative", () => {
    const offenders = scanFor(MASCULINE_IMPERATIVE);

    expect(
      offenders,
      `Masculine imperative in displayed copy. Use בואי, קחי, תני, שימי, דמייני.\nThese five have no other reading, so a hit here is a real one.\n\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
