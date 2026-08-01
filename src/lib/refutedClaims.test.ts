import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { walk, stripComments, flattenJsx } from "./copyScan";

/**
 * Claims the knowledge graph has refuted, barred from displayed copy.
 *
 * Every entry here was live on the site at some point and was removed against a
 * dated ledger row, not against an opinion. The check exists because that is the
 * only kind of correction that reliably comes back: the sentences read well, the
 * numbers are memorable, and nothing in the codebase objects when one is typed
 * again. A review document does not survive the next copy edit. A failing test
 * does.
 *
 * Adding to this list is cheap. Removing from it requires a new ledger row that
 * supersedes the one quoted, which is the same bar the graph itself applies.
 *
 * Comments are exempt (see copyScan.stripComments): each correction quotes the
 * sentence it replaced, and flagging the record would force every fix to erase
 * its own reason.
 */

const ROOT = process.cwd();
/**
 * `public` and the root index.html are scanned as well as the app source.
 *
 * They were outside the walk until 2026-08-01, and the gap was not theoretical:
 * sprint-stages.ts had "נשלחו" removed from the stage-4 deliverable, with the
 * graph row quoted in the comment, while public/llms.txt went on telling every
 * model that reads it "10 פניות שנכתבו, נשלחו, ותועדו". The corrected file was
 * guarded; the file that survives a copy edit longest was not.
 *
 * These are the site's highest-leverage sentences per byte — the meta
 * description is what Google prints, and llms.txt is written to be quoted back
 * verbatim by an assistant. A retracted claim living there outlives the page.
 */
const SCAN = [
  join(ROOT, "src"),
  join(ROOT, "content"),
  join(ROOT, "public"),
  join(ROOT, "index.html"),
];
const CODE_EXT = new Set([".ts", ".tsx"]);
/**
 * .txt and .html join .md here for the public roots. Deliberately not .svg or
 * .xml: sitemap.xml is a URL list and placeholder.svg is path data, so neither
 * holds a sentence, and scanning them only invents ways to trip the check.
 */
const TEXT_EXT = new Set([".md", ".txt", ".html"]);

/** This file necessarily contains the strings it bans. */
const SELF = "refutedClaims.test.ts";

type RefutedClaim = {
  /**
   * Matched against each line of displayed copy. Non-global on purpose: a /g/
   * regex carries lastIndex between .test() calls and would skip every other
   * match.
   *
   * A pattern rather than a substring because the first version of this file
   * banned the literal "7.5" and immediately flagged `expect(kb(151079))
   * .toBe(147.5)` in an unrelated test. An over-broad guard is not a strict
   * guard; it is one that gets an exemption list, and then the exemption list
   * is where the real offender eventually hides. Match the claim, not a digit
   * that appears inside it.
   */
  pattern: RegExp;
  /** What asserting it would claim. */
  claim: string;
  /** The ledger row that refutes it, quoted so a failure explains itself. */
  ledger: string;
};

const REFUTED: RefutedClaim[] = [
  {
    pattern: /בתוך הפגישה/,
    claim: "that the first outreach is sent during the stage-4 meeting",
    ledger:
      '`מפגש-4 הפעלה`, 2026-07-04 cross-check and 2026-07-28 re-read: 🪦 קריטריון-"שליחה-במהלך-המפגש" (הופרך ×2). "הפועל ≠ המקודד... בפועל השליחה מחליקה לשיעורי-בית / מפגש-5 / לא-קורית."',
  },
  {
    pattern: /במהלך המפגש/,
    claim: "the same send-inside-the-meeting criterion, phrased differently",
    ledger:
      "`מפגש-4 הפעלה`: the criterion is 🪦 regardless of how the sentence is worded.",
  },
  {
    // The multiplier form, not the bare number: "5 עד 7.5", "×5-7.5", "5.0-7.5".
    pattern: /[\u00d7xX]?\s*5(\.0)?\s*(עד|-|\u2013|\u2014|to)\s*7\.5/,
    claim: "a value-to-fee multiplier of 5 to 7.5 per client",
    ledger:
      // Hyphen rather than the ledger's en dash: this string is displayed copy
      // as far as the dash scanner is concerned, and the character is not what
      // the quote is carrying.
      'Ledger 2026-07-29: "מכפיל «×5.0-7.5» לכל לקוח, אפס הופעות בכספת... ממוצע-ענף הוסב לטבלת-לקוחות". The corroborated band is 2026-07-22: "value/fee ratio: כל 4 בתוך 3x-10x, 0 מדוגלים".',
  },
  {
    pattern: /86 פגישות/,
    claim: "a measured meeting count feeding a close rate",
    ledger:
      '`חדר-המכירה`, 2026-07-20: "שני המספרים הם הערכת מפעיל, לא מדידה. conversion_log.csv לא נמצא. אסור להשתמש ב-86 או ב-10 אחוז בחישוב, במודל, בהצעה, או בתוכן שיווקי."',
  },
  {
    // Both nouns. "מפגשים" is the correct word for what 22 counts, which makes
    // it the likelier way the figure comes back: someone checks the ledger,
    // finds the noun mismatch, fixes the noun, and leaves the number on a page
    // where it still reads as delivered client work.
    pattern: /(?<!\d)22\s*(פגישות|מפגשים)/,
    claim: "22 delivered meetings, using a research corpus count",
    ledger:
      'Ledger 2026-07-13 rows 207-209, all describing the H8 blind-coding corpus: "H8 סבב-2, קידוד-עיוור על הקורפוס המלא (12+10 מתוך 28)" and "146 זוגות תור-מאמן→תגובת-לקוח · 22 מפגשים · 9 לקוחות". Rows 207-208 write "22 פגישות" for that same corpus; row 209 writes "מפגשים". It is 22 of 28 coaching transcripts from 9 clients, sampled for a methodology test, not meetings held with clients.',
  },
  {
    // The construction, not the verb alone: "נשלחו" on its own is ordinary
    // Hebrew and appears in prose that claims nothing.
    pattern: /פניות\s+שנכתבו,?\s*נשלחו/,
    claim: "that the outreach messages went out, as a stage-4 deliverable",
    ledger:
      '`מפגש-4 הפעלה`: "הפועל ≠ המקודד: \'10 פניות נשלחו-ותועדו במפגש\' הוא אידיאל. בפועל השליחה מחליקה לשיעורי-בית / מפגש-5 / לא-קורית." sprint-stages.ts states the deliverable as written and documented, with a guided run of the first in the room. public/llms.txt kept the retracted wording for as long as the scan did not reach it.',
  },
  {
    // Ten was the count everywhere on the site while guarantee.ts promised five
    // and attached a refund to it. Now that the two agree, the loser needs a
    // guard: it is the number in every old draft, deck and screenshot.
    pattern: /(?<!\d)10\s*פניות/,
    claim: "ten outreach messages, superseded by the count the guarantee covers",
    ledger:
      "Operator decision 2026-08-01: the stage-4 deliverable is five. `guarantee.ts` variant `outreach-sent` already promised \"בסוף שלב 4 יצאו חמש פניות בפועל... אם לא יצאו, החזר מלא של שלב 4\", and a refund-backed number outranks marketing copy. src/data/sprint-stages.ts `outreachCount` is the single source for everything that can import it.",
  },
  {
    // The spelled-out form. faq.ts said "מיפוי של עשרה מקבלי החלטות ספציפיים,
    // ניסוח פנייה נפרד לכל אחד מהם", which makes the count of decision makers
    // the count of outreaches, and the numeral guard above could not see a word.
    pattern: /עשרה\s+(מקבלי החלטות|פניות|נמענים)/,
    claim: "ten recipients, which is the superseded outreach count in words",
    ledger:
      "Same operator decision 2026-08-01 as the numeral form. Written out rather than digits, so it survived the first pass; the FAQ answer it sat in promised a separate outreach per mapped decision maker, which is the deliverable guarantee.ts refunds.",
  },
  {
    pattern: /מיליון שקל/,
    claim: "an unattributed revenue increase, on a site that declares its claims verifiable",
    ledger:
      "Action plan finding 0.1. Removed from OriginStorySection and About in an earlier round; it survived in content/insights and had no anchor in the vault.",
  },
];

function displayedCopy(path: string): string | null {
  const ext = extname(path);
  if (CODE_EXT.has(ext)) return stripComments(readFileSync(path, "utf8"));
  if (TEXT_EXT.has(ext)) return readFileSync(path, "utf8");
  return null;
}

describe("refuted claims stay out of displayed copy", () => {
  // SCAN holds directories and one bare file (index.html), so entries are
  // stat'd rather than assumed to be walkable.
  const files = SCAN.flatMap((p) =>
    statSync(p).isDirectory() ? walk(p) : [p]
  ).filter((f) => !f.endsWith(SELF));

  it("scans a non-trivial number of files", () => {
    // Guards against the walk silently returning nothing and the suite passing
    // for the wrong reason, which is how a scanner rots without anyone noticing.
    const scanned = files.filter((f) => displayedCopy(f) !== null);
    expect(scanned.length).toBeGreaterThan(50);
  });

  for (const entry of REFUTED) {
    it(`does not claim ${entry.claim}`, () => {
      const offenders: string[] = [];

      for (const file of files) {
        const copy = displayedCopy(file);
        if (copy === null) continue;
        const rel = file.replace(ROOT + "/", "");

        let hit = false;
        copy.split("\n").forEach((line, i) => {
          if (entry.pattern.test(line)) {
            hit = true;
            offenders.push(`${rel}:${i + 1}  ${line.trim()}`);
          }
        });
        if (hit) continue;

        // Same claim, spread over several elements. No line number to give: the
        // sentence does not live on a line. The excerpt is what the reader gets.
        const flat = flattenJsx(copy);
        const match = flat.match(entry.pattern);
        if (match && match.index !== undefined) {
          const from = Math.max(0, match.index - 40);
          offenders.push(
            `${rel}  (split across elements) …${flat.slice(from, match.index + match[0].length + 40).trim()}…`
          );
        }
      }

      expect(
        offenders,
        `${entry.pattern} asserts ${entry.claim}.\n\nRefuted by: ${entry.ledger}\n\nFound in:\n${offenders.join("\n")}`
      ).toEqual([]);
    });
  }
});
