import type { CSSProperties, ReactNode } from "react";

/**
 * The four symptoms, set as four notes pinned side by side, then the one
 * diagnosis they share in the display face.
 *
 * The copy is unchanged from the previous page apart from the last paragraph,
 * which answered "why not GPT / a coach"; that answer lives in the FAQ now,
 * where a reader who has that question goes looking for it. The line about
 * time only making it dearer stays, because it is the reason to act this
 * month rather than someday.
 */
const NOTES: ReactNode[] = [
  <>
    כל כמה שבועות את נכנסת ללינקדאין ומשנה את הכותרת. כבר הצטברו{" "}
    <strong className="font-bold text-foreground">15 גרסאות</strong> של ״מי
    אני״, וכל אחת, אחרי חודש, כבר ״לא מספיק מדויקת״.
  </>,
  <>
    רשמת מספר לפני השיחה. כשהגיע הרגע להגיד אותו בקול, התחלת להסס, ו
    <strong className="font-bold text-foreground">מספר נמוך יותר</strong> יצא
    לך מהפה.
  </>,
  <>
    התחלת ב<strong className="font-bold text-foreground">חמישה תחומים</strong>{" "}
    כי כדאי להיות גמישה. היום אף אחד מהם לא מובהק, ואת עייפה.
  </>,
  <>
    נתת חצי שעת ייעוץ לבן-דוד של חבר. כשהמוצר שלך הוא הידע שלך,{" "}
    <strong className="font-bold text-foreground">נתת אותו במתנה</strong>.
  </>,
];

const WhatYouTriedSection = () => (
  <section
    dir="rtl"
    aria-labelledby="what-you-tried-title"
    className="ld-section border-t border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <p className="cor-overline-he">למה הגעת לכאן</p>
      <h2 id="what-you-tried-title" className="cor-title mt-4 max-w-2xl text-foreground">
        ארבעה דברים שאת מכירה מקרוב.
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
            עוד לא תרגמת את מה שאת יודעת לשפה שהלקוח שלך משלם עליה.
          </span>
        </p>
        <p className="cor-body-lg mt-6 max-w-2xl text-foreground/80">
          וכל חודש שזה נשאר ככה גובה מחיר: עסקאות שנסגרות מתחת לערך, לקוחות שלא
          מבינים למה דווקא את, ועוד גרסה של ״מי אני״ שלא תחזיק. הזמן לבדו לא
          מתרגם, הוא רק מייקר.
        </p>
      </div>
    </div>
  </section>
);

export default WhatYouTriedSection;
