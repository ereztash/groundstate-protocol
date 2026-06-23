import { Reveal } from "./Reveal";

const WhatYouTriedSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="what-you-tried-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-8">
          <div>
            <p className="cor-overline-he">
              למה הגעת לכאן
            </p>
            <h2
              id="what-you-tried-title"
              className="cor-title mt-2 text-foreground"
            >
              ארבעה דברים שאתה מכיר מקרוב.
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              <p className="cor-body-lg text-foreground/85">
                כל כמה שבועות אתה נכנס ללינקדאין ומשנה את הכותרת. כבר הצטברו <strong className="font-semibold text-foreground">15 גרסאות</strong> של ״מי אני״ — וכל אחת, אחרי חודש, כבר ״לא מספיק מדויקת״.
              </p>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              <p className="cor-body-lg text-foreground/85">
                רשמת מספר לפני השיחה. כשהגיע הרגע להגיד אותו בקול — התחלת להסס, ו<strong className="font-semibold text-foreground">מספר נמוך יותר</strong> יצא לך מהפה.
              </p>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              <p className="cor-body-lg text-foreground/85">
                התחלת ב<strong className="font-semibold text-foreground">חמישה תחומים</strong> כי כדאי להיות גמיש. היום אף אחד מהם לא מובהק, ואתה עייף.
              </p>
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
              <p className="cor-body-lg text-foreground/85">
                נתת חצי שעת ייעוץ לבן-דוד של חבר. כשהמוצר שלך הוא הידע שלך, <strong className="font-semibold text-foreground">נתת אותו במתנה</strong>.
              </p>
            </li>
          </ul>

          <div className="border-r-2 border-accent pr-4">
            <p className="cor-body-lg text-foreground">
              ארבעת הדברים האלה נראים כמו ארבע בעיות נפרדות. הם לא. הם ארבע פנים של דבר אחד: <strong className="font-semibold text-accent">עוד לא תרגמת את מה שאתה יודע לשפה שהלקוח שלך משלם עליה.</strong>
            </p>
          </div>

          <p className="cor-body-lg text-foreground/85">
            וכל חודש שזה נשאר ככה גובה מחיר: עסקאות שנסגרות מתחת לערך, לקוחות שלא מבינים למה דווקא אתה, ועוד גרסה של ״מי אני״ שלא תחזיק. הזמן לבדו לא מתרגם — הוא רק מייקר.
          </p>

          <p className="cor-body-lg text-foreground/85">
            וזה גם לא נפתר לבד, ולא נקנה מכלי. GPT יחזיר לך את עצמך עם יותר מילים. יועץ ייתן עצה. מאמן ישאל שאלה. את המסגרת שאתה נמצא בתוכה אי אפשר לראות מבפנים. צריך מישהו מבחוץ שיציב מולה מסגרת אחרת, ויחלץ את מה שאתה כבר יודע אבל עוד לא ניסחת.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default WhatYouTriedSection;
