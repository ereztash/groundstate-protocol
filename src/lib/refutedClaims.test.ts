import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
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
const SCAN = [join(ROOT, "src"), join(ROOT, "content")];
const CODE_EXT = new Set([".ts", ".tsx"]);
const TEXT_EXT = new Set([".md"]);

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
  const files = SCAN.flatMap((d) => walk(d)).filter((f) => !f.endsWith(SELF));

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
