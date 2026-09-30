import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { walk, stripComments } from "./copyScan";

/**
 * The site addresses its reader in the plural, or in neutral forms.
 *
 * Operator decision 2026-09-29, replacing the feminine address of 2026-08-01.
 * That decision rested on "roughly 70% of clients are women". The CRM export
 * of 2026-06-03 shows five paying clients, three women and two men, and the
 * sprints since then include men; no source for the 70% was found. With a
 * mixed readership, a page that speaks to one gender was speaking past part of
 * it, so the operator chose plural and neutral forms: "אתם", infinitives on
 * buttons ("לתיאום שיחת התאמה"), impersonal phrasing ("אפשר", "כדאי").
 *
 * This file used to be feminineAddress.test.ts, which banned the masculine.
 * The mechanism is the same; what it bans is now any singular second person.
 *
 * SCOPE, and its limit: it bans only forms with no other reading.
 *
 * - The masculine pronoun אתה.
 * - The singular second-person suffixes: שלך, לך, אותך, איתך, עצמך, אליך,
 *   אלייך, עלייך, ממך, בשבילך, אצלך. These are spelled the same in both
 *   genders unvocalised, which is why the feminine guard could not ban them,
 *   and why this one can: they are singular whichever gender is meant.
 * - A short list of singular imperatives, masculine and feminine, chosen
 *   because neither has a second reading.
 *
 * Not banned, and left to review: the feminine pronoun את, because it is
 * spelled like the accusative marker את that appears in almost every sentence,
 * and verb agreement, because in unvocalised Hebrew the second-person future
 * is homographic with the third-person feminine future (תקבל, תבחרי).
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

/** This file necessarily contains the forms it bans. */
const SELF = "readerAddress.test.ts";

/**
 * Files exempt for a reason, not for convenience.
 *
 * `clients.ts` is verbatim third-party testimony. Conjugating a named person's
 * sentences to match a house style would misquote someone who linked their
 * own LinkedIn profile to those words, which is the same reason noDashes.test.ts
 * yields on this file.
 *
 * `why-prompt-engineering-fails.md` is an article about prompting whose worked
 * examples are prompts, and a prompt addresses a model: "אתה יועץ ארגוני בכיר"
 * is the text you type, not the reader being spoken to.
 *
 * `guaranteeVariants.ts` and `guaranteeReviewNotes.ts` hold the three guarantee
 * options that were not adopted, kept verbatim as they were reviewed. Their
 * only importer is /guarantee-review, which is compiled out of production, and
 * e2e/case-intake.spec.ts asserts they never reach the bundle.
 *
 * `CaseIntake.tsx` and `GuaranteeReview.tsx` are the two dev-only tools,
 * addressed to the operator rather than to a visitor, and compiled out of
 * production for the same reason.
 */
const EXEMPT = [
  "src/lib/clients.ts",
  "content/insights/why-prompt-engineering-fails.md",
  "src/data/guaranteeVariants.ts",
  "src/data/guaranteeReviewNotes.ts",
  "src/pages/CaseIntake.tsx",
  "src/pages/GuaranteeReview.tsx",
];

/**
 * Hebrew-letter boundaries rather than \b, which does not treat Hebrew as word
 * characters the way this needs. Optional one-letter prefixes (ו, ש, כש, ה) are
 * allowed in front of the pronoun and the suffix forms.
 */
const B = "(?<![א-ת])";
const E = "(?![א-ת])";

const SINGULAR_PRONOUN = new RegExp(`${B}(ו|ש|כש)?אתה${E}`);

const SINGULAR_SUFFIX = new RegExp(
  `${B}(ו|ש|כש)?(שלך|לך|אותך|איתך|עצמך|לעצמך|אליך|אלייך|עלייך|ממך|בשבילך|אצלך)${E}`
);

/**
 * Singular imperatives with no second reading. Masculine: בוא, קח, תן, שים,
 * דמיין (בדוק is also "verified", כתוב "written", עשה and נסה and שאל are also
 * past tense, so they stay out). Feminine: the same five plus בחרי, שלחי,
 * קבעי, whose -י ending has no other reading on these roots.
 */
const SINGULAR_IMPERATIVE = new RegExp(
  `${B}ו?(בוא|קח|תן|שים|דמיין|בואי|קחי|תני|שימי|דמייני|בחרי|שלחי|קבעי)${E}`
);

/**
 * Blanks verbatim testimony inside the structured data before scanning. The
 * rest of index.html, including the FAQPage answers and the meta descriptions,
 * stays in scope: those are the site's own words.
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

describe("displayed copy addresses the reader in the plural", () => {
  const files = SCAN.flatMap((p) =>
    statSync(p).isDirectory() ? walk(p) : [p]
  ).filter(
    (f) =>
      !f.endsWith(SELF) &&
      !f.includes("/src/components/ui/") &&
      !EXEMPT.some((e) => f.endsWith(e))
  );

  it("scans a non-trivial number of files", () => {
    const scanned = files.filter((f) => displayedCopy(f) !== null);
    expect(scanned.length).toBeGreaterThan(50);
  });

  it("still scans the files most likely to regress", () => {
    // A typo in a SCAN root would leave this suite green over nothing. These
    // carry most of the reader-facing prose.
    const rel = files.map((f) => f.replace(ROOT + "/", ""));
    expect(rel).toContain("src/components/landing/Hero.tsx");
    expect(rel).toContain("src/data/faq.ts");
    expect(rel).toContain("public/llms.txt");
    expect(rel).toContain(
      "content/insights/why-you-cannot-diagnose-yourself.md"
    );
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

  const how =
    'The site addresses the reader as "אתם", or neutrally. If this is verbatim testimony, a quoted prompt, or a dev-only tool, add the file to EXEMPT with the reason.';

  it("uses no singular second-person pronoun", () => {
    const offenders = scanFor(SINGULAR_PRONOUN);
    expect(offenders, `${how}\n\n${offenders.join("\n")}`).toEqual([]);
  });

  it("uses no singular second-person suffix", () => {
    const offenders = scanFor(SINGULAR_SUFFIX);
    expect(
      offenders,
      `${how} Use שלכם, לכם, אתכם, עצמכם.\n\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("uses no singular imperative", () => {
    const offenders = scanFor(SINGULAR_IMPERATIVE);
    expect(
      offenders,
      `${how} Use the plural (בואו, קחו, בחרו) or an infinitive on buttons.\n\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
