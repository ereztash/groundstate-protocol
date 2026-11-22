import { program } from "./sprint-stages";

/**
 * The 90-day accompaniment, offered for Black Friday until 30.11.2026 at
 * midnight, Israel time.
 *
 * Source: the WhatsApp ad of 2026-11-22 (Meta campaign
 * "2026-11-sprint-whatsapp", its `message` field) and Erez's handoff of the
 * same day. The ad links to this site, so a visitor who clicks through has to
 * find the same offer here, in the same words.
 *
 * What is decided: up to 12 meetings over up to 90 days, ₪8,000 for the whole
 * period, until 30.11 at midnight. The ₪12,000 it is compared with is three
 * months of the monthly programme that stays on the page (`program`, ₪4,000),
 * which is why it is derived here rather than typed.
 *
 * What is NOT decided, and therefore not written anywhere on the page:
 * payment in instalments, cancellation, refund. The written guarantee on the
 * page belongs to the 30-day programme and is not repeated for this one.
 * `promo90.test.ts` fails the build if any of those words reach this copy.
 *
 * After the deadline the offer disappears by itself: `isPromo90Live` is read at
 * render time, so the prerender of any build after midnight leaves it out,
 * and a visitor whose cached page still carries it loses it on load.
 * `.github/workflows/deploy.yml` rebuilds the site a few minutes after
 * midnight so the static HTML drops it too. Once that has run, this file, the
 * section, the hero strip and the schedule can be deleted.
 */

/** 1.12.2026 00:00 in Israel (UTC+2 in winter), i.e. the end of 30.11. */
export const PROMO90_ENDS_AT = Date.UTC(2026, 10, 30, 22, 0, 0);

export function isPromo90Live(now: number = Date.now()): boolean {
  return now < PROMO90_ENDS_AT;
}

const MONTHS = 3;

export const promo90 = {
  name: "ליווי אישי של עד 90 יום",
  sheetTitle: "הצעה לליווי אישי של עד 90 יום",
  meetings: "עד 12 מפגשים, לאורך עד 90 יום",
  occasion: "לרגל בלאק פריידי, עד 30.11 בחצות",
  deadline: "עד 30.11 בחצות",
  priceNis: 8000,
  priceLabel: "₪8,000",
  priceNote: "לכל התקופה",
  /** Three months of the monthly programme, derived from its price. */
  compareNis: program.priceNis * MONTHS,
  compareLabel: `₪${(program.priceNis * MONTHS).toLocaleString("en-US")}`,
  compareBasis: `שלושה חודשים בתוכנית החודשית, ${MONTHS} × ${program.priceLabel}`,
  /** What happens in it, in the ad's order and words, addressed in the plural. */
  steps: [
    {
      title: "שלושה אנשים שנעזרו בכם",
      body: "מניחים אותם זה לצד זה ובודקים מה חזר בהם: עם איזו בעיה הגיעו אליכם, מה עשיתם שעזר להם, ומה השתנה אצלם בעקבות העבודה.",
    },
    {
      title: "למי פונים",
      body: "משם בוחרים למי לפנות.",
    },
    {
      title: "הצעת שירות שאפשר להסביר במשפט",
      body: "מנסחים אותה, נותנים לה מחיר ומציעים אותה.",
    },
    {
      title: "בכל פגישה, מה קרה בפנייה",
      body: "עוברים יחד על מה שקרה, ומחליטים מה כדאי לשנות.",
    },
  ],
  cta: "לכתוב לי בוואטסאפ",
  ctaNote:
    "אפשר לכתוב על אדם אחד שנעזר בכם לאחרונה. מספיק לספר עם מה הוא הגיע אליכם. משם נתחיל.",
} as const;
