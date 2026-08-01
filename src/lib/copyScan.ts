import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Shared scanning helpers for the copy checks that run over `src/` and
 * `content/`.
 *
 * These lived inside noDashes.test.ts until a second check needed the same
 * comment-stripping. Duplicating a string-aware parser is how two scanners end
 * up disagreeing about what a comment is, and the whole value of these checks is
 * that they agree with each other and with scripts/strip-dashes.mjs.
 */

export function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Displayed copy with JSX tags dropped and whitespace collapsed, so a scan sees
 * what a reader sees rather than how the markup happens to be indented.
 *
 * A line-by-line regex misses any claim split across elements. That is not a
 * hypothetical: the meeting counter this repo bans was written as `22` inside
 * one <span> and `פגישות בוצעו עד כה` inside the next, which is one sentence on
 * the page and two unrelated lines to the scanner. The guard for it passed
 * against the very copy it was written to catch.
 *
 * Approximate by design. Attribute values are dropped with their tags, and an
 * arrow function inside an attribute ends the tag early, leaving a fragment of
 * code in the text. Both failure modes add text rather than hide it, so they
 * can cost a false positive but cannot let a banned sentence through, which is
 * the direction a ban list should fail in.
 */
export function flattenJsx(src: string): string {
  return src.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
}

/**
 * Blanks out comments so only strings and JSX text are scanned.
 *
 * String-aware, because a naive scan for "//" also blanks the rest of any line
 * holding a protocol-relative URL, and a naive line-start check misses trailing
 * comments, which is where the last offender was hiding. Mirrors the codemod in
 * scripts/strip-dashes.mjs so the check and the fix agree on what a comment is.
 *
 * Comments are exempt on purpose: a comment that quotes a removed sentence is
 * the record of why it was removed, and a scanner that flagged the record would
 * push every correction to delete its own reason.
 */
export function stripComments(src: string): string {
  let inBlock = false;
  return src
    .split("\n")
    .map((line) => {
      if (inBlock) {
        const end = line.indexOf("*/");
        if (end === -1) return "";
        inBlock = false;
        return line.slice(end + 2);
      }
      let quote: string | null = null;
      for (let i = 0; i < line.length; i += 1) {
        const c = line[i];
        if (quote) {
          if (c === "\\") i += 1;
          else if (c === quote) quote = null;
          continue;
        }
        if (c === '"' || c === "'" || c === "`") {
          quote = c;
          continue;
        }
        if (c === "/" && line[i + 1] === "/") return line.slice(0, i);
        if (c === "/" && line[i + 1] === "*") {
          const end = line.indexOf("*/", i + 2);
          if (end === -1) {
            inBlock = true;
            return line.slice(0, i);
          }
          return line.slice(0, i) + line.slice(end + 2);
        }
      }
      return line;
    })
    .join("\n");
}
