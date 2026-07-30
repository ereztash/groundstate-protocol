import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

/**
 * Em and en dashes are barred from displayed copy. This enforces it in CI
 * rather than in a style document, because a rule that lives only in prose comes
 * back on the next edit.
 *
 * Scope is displayed text, so code comments are stripped before scanning: a
 * comment that quotes a removed sentence is a record of why something changed,
 * and deleting the quote would delete the reason.
 */

const ROOT = process.cwd();
const SCAN = [join(ROOT, "src"), join(ROOT, "content")];
const CODE_EXT = new Set([".ts", ".tsx"]);
const TEXT_EXT = new Set([".md"]);
const DASHES = /[—–]/;

/** This file necessarily contains the characters it bans. */
const SELF = "noDashes.test.ts";

/**
 * Verbatim third-party testimony. These are other people's sentences, and
 * editing them to satisfy a house punctuation rule would misquote a named
 * person who linked their own profile to the words. The rule yields here.
 *
 * Keep this list at exactly one file: all client words belong in clients.ts, so
 * a second entry means a quote was pasted somewhere it should not live.
 */
const QUOTE_FILES = ["src/lib/clients.ts"];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Blanks out comments so only strings and JSX text are scanned.
 *
 * String-aware, because a naive scan for "//" also blanks the rest of any line
 * holding a protocol-relative URL, and a naive line-start check misses trailing
 * comments, which is where the last offender was hiding. Mirrors the codemod in
 * scripts/strip-dashes.mjs so the check and the fix agree on what a comment is.
 */
function stripComments(src: string): string {
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

describe("no em or en dashes in displayed copy", () => {
  const files = SCAN.flatMap((d) => walk(d)).filter(
    (f) =>
      !f.endsWith(SELF) &&
      !QUOTE_FILES.some((q) => f.endsWith(q.replace(/\//g, "/")))
  );

  it("scans a non-trivial number of files", () => {
    // Guards against the walk silently returning nothing and the suite passing
    // for the wrong reason.
    expect(files.length).toBeGreaterThan(40);
  });

  it("finds none", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const ext = extname(file);
      let text: string;
      if (CODE_EXT.has(ext)) text = stripComments(readFileSync(file, "utf8"));
      else if (TEXT_EXT.has(ext)) text = readFileSync(file, "utf8");
      else continue;

      text.split("\n").forEach((line, i) => {
        if (DASHES.test(line)) {
          offenders.push(
            `${file.replace(ROOT + "/", "")}:${i + 1}  ${line.trim().slice(0, 90)}`
          );
        }
      });
    }

    expect(
      offenders,
      `dashes found in displayed copy:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
