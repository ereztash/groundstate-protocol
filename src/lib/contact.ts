/**
 * How to reach Erez outside the calendar, kept in one place.
 *
 * WhatsApp is the default channel for small business in Israel: four of the
 * eight competitor pages checked on 2026-10-01 float a WhatsApp button, and
 * none of them offers calendar booking. The calendar stays the first path on
 * this site; WhatsApp is the second, for the reader who would rather write.
 *
 * The number and the LinkedIn profile were given by Erez for publication on
 * 2026-10-01.
 */
export type Lang = "he" | "en";

export const WHATSAPP_DISPLAY = "052-4545963";
const WHATSAPP_INTL = "972524545963";

/** The first message, pre-filled, so the chat opens with a reason to answer. */
const WHATSAPP_OPENER: Record<Lang, string> = {
  he: "היי ארז, הגעתי מהאתר ואשמח לשמוע על שיחת התאמה.",
  en: "Hi Erez, I found your site and would like to hear about a fit call.",
};

/**
 * The opener for the 90-day offer (2026-11-22). It keeps "הגעתי מהאתר", which
 * is how a chat that started on the site is found in Erez's WhatsApp.
 */
const WHATSAPP_OPENER_90 = "היי ארז, הגעתי מהאתר ואשמח לשמוע על הליווי ל-90 יום.";

/**
 * The opener for a door page (2026-11-23). The page's one small step is to send
 * the sentence you use today, so the chat opens ready for it, after the words
 * "הגעתי מהאתר" that find the chat in Erez's WhatsApp.
 */
const WHATSAPP_OPENER_SENTENCE = "היי ארז, הגעתי מהאתר. זה המשפט שלי היום: ";

export function whatsappUrl(lang: Lang = "he", topic?: "offer90" | "sentence"): string {
  const text =
    lang !== "he"
      ? WHATSAPP_OPENER[lang]
      : topic === "offer90"
        ? WHATSAPP_OPENER_90
        : topic === "sentence"
          ? WHATSAPP_OPENER_SENTENCE
          : WHATSAPP_OPENER.he;
  return `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(text)}`;
}

/**
 * The first line of the message a /bidul worksheet sends. The prediction
 * locked on the page (ACQ-N26) counts chats that open with exactly this, so
 * changing it breaks the count. It carries no word of the person's own.
 */
export const WHATSAPP_OPENER_SHEET =
  "היי ארז, הגעתי מהאתר. מילאתי את דף חמש השאלות.";

export type SheetLine = { label: string; text: string };

/** Per-answer and whole-message limits for the WhatsApp link, in characters. */
const SHEET_ANSWER_MAX = 260;
const SHEET_TEXT_MAX = 1700;

function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).trimEnd()}…`;
}

/**
 * The worksheet as plain text: the person's sentence, then their answers,
 * numbered. `max` clips each answer; the copy button passes none and gets the
 * whole text.
 */
export function sheetText(sentence: string, lines: SheetLine[], max?: number): string {
  const cut = (t: string) => (max ? clip(t, max) : t.trim());
  const body = lines
    .filter((l) => l.text.trim() !== "")
    .map((l, i) => `${i + 1}. ${l.label}\n${cut(l.text)}`);
  const head = sentence.trim() === "" ? [] : [cut(sentence)];
  return [...head, ...body].join("\n\n");
}

/**
 * A wa.me link that opens a chat with the worksheet already written in it.
 * Hebrew costs six characters a letter once encoded, and a link that long is
 * cut short by some phones, so answers are clipped here and only here.
 */
export function whatsappSheetUrl(sentence: string, lines: SheetLine[]): string {
  const whole = `${WHATSAPP_OPENER_SHEET}\n\n${sheetText(sentence, lines, SHEET_ANSWER_MAX)}`;
  // The whole message is cut without flattening its line breaks.
  const text =
    whole.length <= SHEET_TEXT_MAX
      ? whole
      : `${whole.slice(0, SHEET_TEXT_MAX - 1).trimEnd()}…`;
  return `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(text)}`;
}

/**
 * A wa.me link with no number, so WhatsApp asks whom to send it to and the
 * person can pick their own chat (2026-11-26). It carries the same sheet and
 * the page's address, for coming back to it after a break. No opener: the
 * message is to themselves, and it must not be counted as a chat with Erez.
 */
export function whatsappSelfUrl(sentence: string, lines: SheetLine[], pageUrl: string): string {
  const tail = pageUrl ? `\n\n${pageUrl}` : "";
  const sheet = sheetText(sentence, lines, SHEET_ANSWER_MAX);
  const room = SHEET_TEXT_MAX - tail.length;
  const body = sheet.length <= room ? sheet : `${sheet.slice(0, room - 1).trimEnd()}…`;
  return `https://wa.me/?text=${encodeURIComponent(`${body}${tail}`)}`;
}

export const LINKEDIN_URL = "https://www.linkedin.com/in/erez-tal-shir/";

/**
 * 7,538 followers on 2026-10-01, as Erez reported it. Stated as a floor so the
 * line stays true while the number grows and nobody has to remember to edit it.
 */
export const LINKEDIN_FOLLOWERS: Record<Lang, string> = {
  he: "מעל 7,500 עוקבים בלינקדאין",
  en: "7,500+ followers on LinkedIn",
};
