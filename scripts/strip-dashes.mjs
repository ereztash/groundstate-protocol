/**
 * One-off codemod: removes em and en dashes from displayed copy, leaving code
 * comments alone.
 *
 * The distinction matters in both directions. Displayed dashes break a style
 * rule the site is held to. Comment dashes are prose written for whoever reads
 * the code next, and rewriting them mechanically turns explanations into
 * comma-spliced sentences, which is a real cost for no benefit.
 *
 * Kept in the repo rather than run ad hoc so the next sweep starts from a known
 * tool instead of an improvised regex. src/lib/noDashes.test.ts is what actually
 * enforces the rule.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
/** Verbatim third-party testimony. Never edited. */
const SKIP = ["src/lib/clients.ts", "src/lib/noDashes.test.ts"];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Applies the replacements to a stretch of non-comment text. */
function fixText(text) {
  return text
    .replace(/(>)\s*—\s+/g, "$1")
    .replace(/([,:;])\s*—\s+/g, "$1 ")
    .replace(/\s+—\s+/g, ", ")
    .replace(/(\d)\s*–\s*(\d)/g, "$1 עד $2");
}

/**
 * Splits each line into code and comment, fixes only the code half. Tracks
 * block comments across lines; treats a `//` as starting a comment only when it
 * is not inside a string, which is what keeps protocol-relative URLs intact.
 */
function fixSource(src) {
  let inBlock = false;
  return src
    .split("\n")
    .map((line) => {
      if (inBlock) {
        const end = line.indexOf("*/");
        if (end === -1) return line;
        inBlock = false;
        return line.slice(0, end + 2) + fixText(line.slice(end + 2));
      }

      let quote = null;
      for (let i = 0; i < line.length; i += 1) {
        const c = line[i];
        if (quote) {
          if (c === "\\") i += 1;
          else if (c === quote) quote = null;
          continue;
        }
        if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
        if (c === "/" && line[i + 1] === "/") {
          return fixText(line.slice(0, i)) + line.slice(i);
        }
        if (c === "/" && line[i + 1] === "*") {
          const end = line.indexOf("*/", i + 2);
          if (end === -1) { inBlock = true; return fixText(line.slice(0, i)) + line.slice(i); }
          return fixText(line.slice(0, i)) + line.slice(i, end + 2) + fixText(line.slice(end + 2));
        }
      }
      return fixText(line);
    })
    .join("\n");
}

let changed = 0;
for (const dir of ["src", "content"]) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = file.replace(ROOT + "/", "");
    if (SKIP.includes(rel)) continue;
    const ext = extname(file);
    if (![".ts", ".tsx", ".md"].includes(ext)) continue;

    const before = readFileSync(file, "utf8");
    const after = ext === ".md" ? fixText(before) : fixSource(before);
    if (after !== before) {
      writeFileSync(file, after);
      changed += 1;
    }
  }
}
console.log(`strip-dashes: rewrote ${changed} files`);
