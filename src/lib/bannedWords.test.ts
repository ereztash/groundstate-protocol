import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { walk, stripComments } from "./copyScan";

/**
 * Words the operator's own rules ban from anything a reader sees.
 *
 * Two sources, both the operator's style rules: the site brief's list of hype
 * words (מדהים, מהפכני, משנה חיים, טרנספורמטיבי, עוצמתי) and the content rule
 * that bans "גמגם/גמגום" as insulting to the reader. The second one was live
 * in the meta description, in an article, and in the stage-1 sample line that
 * the 2026-09-29 hero put at its centre, and nothing caught it: the rule lived
 * in a notes file, not in the build.
 *
 * Same sweep as noDashes: displayed copy in src/ and content/, comments
 * stripped from code, plus index.html and llms.txt, which a crawler reads.
 * Client quotes are exempt because they are other people's words.
 */
const ROOT = process.cwd();
const SCAN = [join(ROOT, "src"), join(ROOT, "content")];
const EXTRA = [join(ROOT, "index.html"), join(ROOT, "public", "llms.txt")];
const CODE_EXT = new Set([".ts", ".tsx"]);
const TEXT_EXT = new Set([".md", ".html", ".txt"]);
const SELF = "bannedWords.test.ts";

/** Compared as repo-relative, forward-slash paths so the exemption holds on Windows too. */
const QUOTE_FILES = ["src/lib/clients.ts"];
const rel = (f: string) => relative(ROOT, f).split(sep).join("/");

const BANNED: { word: string; pattern: RegExp }[] = [
  { word: "גמגם / גמגום", pattern: /גמגמ|גמגום|לגמגם/ },
  { word: "מדהים", pattern: /(?<![א-ת])מדהימ?(ה|ים|ות)?(?![א-ת])/ },
  { word: "מהפכני", pattern: /מהפכני/ },
  { word: "משנה חיים", pattern: /משנה[\s-]+חיים/ },
  { word: "טרנספורמטיבי", pattern: /טרנספורמטיב/ },
  { word: "עוצמתי", pattern: /עוצמתי/ },
];

describe("banned words stay out of displayed copy", () => {
  const files = [...SCAN.flatMap((d) => walk(d)), ...EXTRA].filter(
    (f) => !f.endsWith(SELF) && !QUOTE_FILES.includes(rel(f))
  );

  it("scans a non-trivial number of files, including the head and llms.txt", () => {
    expect(files.length).toBeGreaterThan(40);
    expect(files.map(rel)).toContain("index.html");
    expect(files.map(rel)).toContain("public/llms.txt");
  });

  for (const { word, pattern } of BANNED) {
    it(`does not use "${word}"`, () => {
      const offenders: string[] = [];
      for (const file of files) {
        const ext = extname(file);
        let text: string;
        if (CODE_EXT.has(ext)) text = stripComments(readFileSync(file, "utf8"));
        else if (TEXT_EXT.has(ext)) text = readFileSync(file, "utf8");
        else continue;
        text.split("\n").forEach((line, i) => {
          if (pattern.test(line)) offenders.push(`${rel(file)}:${i + 1}  ${line.trim().slice(0, 90)}`);
        });
      }
      expect(offenders, `"${word}" in displayed copy:\n${offenders.join("\n")}`).toEqual([]);
    });
  }
});
