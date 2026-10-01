import type { CSSProperties, ReactNode } from "react";
import SectionHead from "./SectionHead";

/**
 * The four symptoms, set as four notes pinned side by side, then the one
 * diagnosis they share in the display face.
 *
 * Chosen and ordered by the operator's client-language research, which ranks
 * pain patterns by how many clients raised them: "knows the work, not what she
 * sells" is the most common and comes first. Paraphrased at pattern level; no
 * client is quoted.
 *
 * The "five fields" note that used to sit here was dropped: the same research
 * found that people with several fields are proud of the combination and do
 * not present it as a problem, so the note described the coach's exercise,
 * not the reader.
 *
 * The heading is the ICP line in the plural the site uses since 2026-09-30,
 * with "נתקעים" rather than the banned "מגמגמים". The notes keep main's plural
 * wording where the sentence already existed.
 */
const NOTES: ReactNode[] = [
  <>
    כשמישהו חדש שואל{" "}
    <strong className="font-bold text-foreground">מה אתם מוכרים</strong>, קשה
    לכם להגיד לו מה יוצא לו מזה.
  </>,
  <>
    כל כמה שבועות אתם נכנסים ללינקדאין ומשנים את הכותרת. כבר הצטברו{" "}
    <strong className="font-bold text-foreground">15 גרסאות</strong> של ״מי
    אני״, וכל אחת, אחרי חודש, כבר ״לא מספיק מדויקת״.
  </>,
  <>
    רשמתם מספר לפני השיחה. כשהגיע הרגע להגיד אותו בקול, התחלתם להסס, ו
    <strong className="font-bold text-foreground">מספר נמוך יותר</strong> יצא
    לכם מהפה.
  </>,
  <>
    נתתם{" "}
    <strong className="font-bold text-foreground">חצי שעת ייעוץ</strong> לבן-דוד
    של חבר.
  </>,
];

const WhatYouTriedSection = () => (
  <section
    dir="rtl"
    aria-labelledby="what-you-tried-title"
    className="ld-section border-t border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <SectionHead label="למה הגעתם לכאן" />
      <h2 id="what-you-tried-title" className="cor-title mt-4 max-w-2xl text-foreground">
        הסנדלר הולך יחף, גם אצלכם וגם אצלי.
      </h2>
      <p className="cor-body-lg mt-5 max-w-2xl text-foreground">
        בדרך כלל זה מגיע אחרי שעזבתם עבודה, יצאתם לחל״ת, או כשההכנסה מהעסק
        עוד לא יציבה.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {NOTES.map((note, i) => (
          <li key={i} className="ld-draft px-5 py-5" style={{ "--tilt": i % 2 ? "0.5deg" : "-0.5deg" } as CSSProperties}>
            <span className="font-heading text-sm font-black text-accent" aria-hidden="true">
              {i + 1}.
            </span>
            <p className="mt-2 leading-relaxed text-foreground">{note}</p>
          </li>
        ))}
      </ul>

    </div>
  </section>
);

export default WhatYouTriedSection;
