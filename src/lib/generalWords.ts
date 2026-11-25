/**
 * General words, for the /bidul worksheet.
 *
 * A general word is one that someone else in the same field would write about
 * themselves unchanged. The page's second question quotes one back and asks
 * what it means in a single example, which is the move with the highest yield
 * in the transcripts the page was built from.
 *
 * This is a fixed list, and the page says so. It does not understand the text.
 * Two things keep it from embarrassing the reader with a false catch:
 *
 * - Prefix letters are stripped only in combinations that exist in Hebrew, and
 *   never the participle mem, so a verb that happens to end in a listed word
 *   is not caught.
 * - STOP holds the few real words that still collide after that.
 *
 * No regex lookbehind: older Safari on iPhone throws on it at parse time, and
 * that would take the whole page down.
 */

const SINGLE_PREFIX = new Set(["ו", "ה", "ב", "ל", "כ", "ש"]);
const DOUBLE_PREFIX = new Set([
  "וה", "וב", "ול", "וכ", "וש", "שה", "שב", "של", "שכ", "כש",
]);

/** Real words that end in a listed word and mean something else. */
const STOP = new Set(["במיוחד", "למסור", "הזמין", "הזמינה"]);

const WORDS = new RegExp(
  "^(" +
    [
      "מקצועי(ת|ים|ות)?",
      "מקצועיות",
      "מקצוענ(י|ית|ים|ות)?",
      "מקצוען",
      "מיוחד(ת|ים|ות)?",
      "יי?חודי(ת|ים|ות)?",
      "יי?חודיות",
      "איכותי(ת|ים|ות)?",
      "איכות",
      "אישית?",
      "אישיים",
      "אמין",
      "אמינ(ה|ים|ות)",
      "מסור(ה|ים|ות)?",
      "מסירות",
      "יסודי(ת|ים|ות)?",
      "יסודיות",
      "מנוס(ה|ים|ות)",
      "מומח(ה|ית|ים|יות)",
      "מומחיות",
      "זמין",
      "זמינ(ה|ים|ות)",
      "אכפתי(ת|ים|ות)?",
      "אכפתיות",
      "אי?כפת",
      "פתרונות",
      "הוליסטי(ת|ים|ות)?",
      "חדשני(ת|ים|ות)?",
      "חדשנות",
      "יצירתי(ת|ים|ות)?",
      "יצירתיות",
      "מדוי?יק(ת|ים|ות)?",
      "מותא(ם|מת|מים|מות)",
      "מקי(ף|פה|פים|פות)",
      "אמיתי(ת|ים|ות)?",
      "תוצאות",
      "מענה",
      "אותנטי(ת|ים|ות)?",
      "אותנטיות",
      "גמיש(ה|ים|ות)?",
      "גמישות",
      "קשוב(ה|ים|ות)?",
      "הקשבה",
      "סבלני(ת|ים|ות)?",
      "סבלנות",
      "אנושי(ת|ים|ות)?",
      "אנושיות",
      "מעול(ה|ים|ות)",
      "מצוי?ינ(ת|ים|ות)",
      "מצוי?ין",
      "מהיר(ה|ים|ות)?",
      "מהירות",
      "יעיל(ה|ים|ות)?",
      "יעילות",
      "אחריות",
      "מחוי?יב(ת|ים|ות)?",
      "מחוי?יבות",
      "אהבה",
    ].join("|") +
    ")$"
);

/** Two-word phrases. The first word may carry a prefix, the second is exact. */
const PHRASES: [RegExp, RegExp][] = [
  [/^יחס$/, /^(אישי|חם)$/],
  [/^ערך$/, /^מוסף$/],
  [/^(נות(ן|נת|נים|נות)|מביא(ה|ים|ות)?|מייצר(ת|ים|ות)?|לתת|להביא|לייצר)$/, /^ערך$/],
  [/^ראש$/, /^גדול$/],
  [/^גובה$/, /^העיניים$/],
  [/^(יורד(ת|ים|ות)?|ירידה|לרדת)$/, /^לפרטים$/],
  [/^מחוץ$/, /^לקופסה$/],
  [/^שנות$/, /^ני?סיון$/],
  [/^ני?סיון$/, /^(רב|עשיר|רחב)$/],
  [/^בעל(ת|י|ות)?$/, /^ני?סיון$/],
  [/^מכל$/, /^הלב$/],
  [/^הכי$/, /^טוב(ה|ים|ות)?$/],
  [/^שירות$/, /^(טוב|אישי|מעולה|מצוי?ין)$/],
  [/^מותא(ם|מת|מים|מות)$/, /^אישית$/],
];

export type GeneralWord = {
  /** The word as the person wrote it, without the prefix letters. */
  word: string;
  /** Character range in the source text, prefix letters excluded. */
  start: number;
  end: number;
};

type Token = { raw: string; start: number; end: number };

function tokens(text: string): Token[] {
  const out: Token[] = [];
  const re = /[א-ת]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ raw: m[0], start: m.index, end: m.index + m[0].length });
  }
  return out;
}

/**
 * The readings of a token: as written, then with a real prefix removed. Each
 * comes with the number of letters dropped. A reading in STOP ends the list,
 * so nothing shorter is tried.
 */
function readings(raw: string): [string, number][] {
  const out: [string, number][] = [];
  if (STOP.has(raw)) return out;
  out.push([raw, 0]);
  if (raw.length >= 4 && SINGLE_PREFIX.has(raw[0])) {
    const rest = raw.slice(1);
    if (STOP.has(rest)) return out;
    out.push([rest, 1]);
  }
  if (raw.length >= 5 && DOUBLE_PREFIX.has(raw.slice(0, 2))) {
    const rest = raw.slice(2);
    if (STOP.has(rest)) return out;
    out.push([rest, 2]);
  }
  return out;
}

/** Every general word in the text, in order, with its place in it. */
export function findGeneralWords(text: string): GeneralWord[] {
  const toks = tokens(text);
  const found: GeneralWord[] = [];

  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    const next = toks[i + 1];
    const forms = readings(t.raw);

    let hit: GeneralWord | null = null;

    // A phrase wins over a single word, so "יחס אישי" is one catch, not half.
    if (next && text.slice(t.end, next.start).trim() === "") {
      for (const [form, cut] of forms) {
        if (PHRASES.some(([a, b]) => a.test(form) && b.test(next.raw))) {
          hit = {
            word: `${form} ${next.raw}`,
            start: t.start + cut,
            end: next.end,
          };
          break;
        }
      }
    }
    if (hit) {
      found.push(hit);
      i++;
      continue;
    }

    for (const [form, cut] of forms) {
      if (WORDS.test(form)) {
        found.push({ word: form, start: t.start + cut, end: t.end });
        break;
      }
    }
  }
  return found;
}

/** The distinct general words in the text, in the order they appear. */
export function uniqueGeneralWords(text: string): string[] {
  const seen = new Set<string>();
  for (const { word } of findGeneralWords(text)) seen.add(word);
  return [...seen];
}

export type TextPart = { text: string; general: boolean };

/** The text cut into plain and general runs, for marking it on the sheet. */
export function splitByGeneralWords(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let at = 0;
  for (const { start, end } of findGeneralWords(text)) {
    if (start > at) parts.push({ text: text.slice(at, start), general: false });
    parts.push({ text: text.slice(start, end), general: true });
    at = end;
  }
  if (at < text.length) parts.push({ text: text.slice(at), general: false });
  return parts;
}
