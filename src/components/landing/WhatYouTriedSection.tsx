import type { CSSProperties, ReactNode } from "react";

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
    אתם יודעים בדיוק מה אתם עושים בשביל לקוחות. כשמישהו חדש שואל{" "}
    <strong className="font-bold text-foreground">מה אתם מוכרים</strong>, התשובה
    עוד לא ברורה, גם לכם.
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
    נתתם חצי שעת ייעוץ לבן-דוד של חבר. כשהמוצר שלכם הוא הידע שלכם,{" "}
    <strong className="font-bold text-foreground">נתתם אותו במתנה</strong>.
  </>,
];

const WhatYouTriedSection = () => (
  <section
    dir="rtl"
    aria-labelledby="what-you-tried-title"
    className="ld-section border-t border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <p className="cor-overline-he">למה הגעתם לכאן</p>
      <h2 id="what-you-tried-title" className="cor-title mt-4 max-w-2xl text-foreground">
        מבריקים על הלקוחות שלכם. נתקעים על עצמכם.
      </h2>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {NOTES.map((note, i) => (
          <li key={i} className="ld-draft px-5 py-5" style={{ "--tilt": i % 2 ? "0.5deg" : "-0.5deg" } as CSSProperties}>
            <span className="font-heading text-sm font-black text-accent" aria-hidden="true">
              {i + 1}.
            </span>
            <p className="mt-2 leading-relaxed text-foreground/85">{note}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14 max-w-4xl">
        <p className="font-heading text-[1.625rem] font-black leading-[1.25] text-foreground sm:text-[2.125rem]">
          ארבעת הדברים האלה נראים כמו ארבע בעיות נפרדות. הם ארבע פנים של דבר
          אחד:{" "}
          <span className="underline decoration-accent decoration-[3px] underline-offset-[0.28em]">
            עוד לא תרגמתם את מה שאתם יודעים לשפה שהלקוח שלכם משלם עליה.
          </span>
        </p>
        <p className="cor-body-lg mt-6 max-w-2xl text-foreground/80">
          וכל חודש שזה נשאר ככה גובה מחיר: עסקאות שנסגרות מתחת לערך, לקוחות שלא
          מבינים למה דווקא אתם, ועוד גרסה של ״מי אני״ שלא תחזיק. הזמן לבדו לא
          מתרגם, הוא רק מייקר.
        </p>
      </div>
    </div>
  </section>
);

export default WhatYouTriedSection;
