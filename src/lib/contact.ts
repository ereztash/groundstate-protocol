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

export function whatsappUrl(lang: Lang = "he"): string {
  return `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(WHATSAPP_OPENER[lang])}`;
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
