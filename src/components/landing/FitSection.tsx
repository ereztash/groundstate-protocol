import { Link } from "react-router-dom";
import SectionHead from "./SectionHead";

const portrait = `${import.meta.env.BASE_URL}portrait.webp`;

/**
 * Who this is for, who it is not for, and who is on the other side of the
 * call, on one spread.
 *
 * The filter is part of the conversion, not a courtesy: a call with someone
 * the programme cannot help costs both people twenty minutes and trains the
 * page to attract the wrong reader. The "for" list is written as situations,
 * not segments (graph H21), and drawn from conditions the graph and the site
 * already state: the ICP node's entry trigger (left a job, unpaid leave,
 * unstable income), which is what makes the gap felt now (the payable-answer
 * filter's first condition); the form's screen for an active practice; and
 * the FAQ's weekly rhythm. The "not for" list is the previous
 * NotForEveryoneSection, in the plural it took on 2026-09-30.
 *
 * The origin paragraph is OriginStorySection's, cut to its first beat.
 */
const FOR = [
  "משהו השתנה לאחרונה: עזבתם עבודה, יצאתם לחל״ת, או שההכנסה עוד לא יציבה, והשאלה מה אתם מוכרים הפכה דחופה.",
  "יש לכם כבר לקוחות, והם מרוצים. הקושי הוא להסביר למי שעוד לא עבד איתכם למה דווקא אתם.",
  "אתם משלבים שני עולמות, ולא מצליחים להגיד את הצירוף במשפט אחד.",
  "אתם מוכנים לפגישה בשבוע ולמשימה קצרה בין הפגישות, במשך חודש.",
];

const NOT_FOR = [
  "אתם נותנים שירות בעיקר לתאגידים, לא לעצמאים.",
  "יש לכם כבר 30+ לקוחות פעילים ואתם רוצים לסנן.",
  "אתם רגילים לעבוד על תחושה ולא על מבנה, זה ירגיש מעצבן.",
  "אתם מחפשים חימום רגשי לפני פעולה, אני לא הכתובת.",
];

const FitSection = () => (
  <section
    id="fit"
    dir="rtl"
    aria-labelledby="fit-title"
    className="ld-section border-t border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <SectionHead n="06" label="התאמה" />
      <h2 id="fit-title" className="cor-title mt-4 max-w-2xl text-foreground">
        זה לא מתאים לכולם, וזה בסדר.
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="ld-sheet p-6 sm:p-8">
          <h3 className="font-heading text-xl font-black text-foreground">
            זה בשבילכם אם
          </h3>
          <ul className="mt-5 space-y-4">
            {FOR.map((line) => (
              <li key={line} className="flex gap-3 leading-relaxed text-foreground/85">
                <svg viewBox="0 0 28 20" aria-hidden="true" className="mt-1.5 h-3.5 w-5 shrink-0">
                  <path className="ld-mark" d="M2 11 L10 18 L26 2" />
                </svg>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ld-draft p-6 sm:p-8">
          <h3 className="font-heading text-xl font-black text-foreground">
            זה לא בשבילכם אם
          </h3>
          <ul className="mt-5 space-y-4">
            {NOT_FOR.map((line) => (
              <li key={line} className="flex gap-3 leading-relaxed text-foreground/75">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1.5 h-3.5 w-3.5 shrink-0">
                  <path className="ld-mark" d="M3 3 L17 17 M17 3 L3 17" />
                </svg>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Who is on the other side of the call. */}
      <div className="mt-16 grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-12">
        <img
          src={portrait}
          alt="ארז טל-שיר"
          width={200}
          height={200}
          loading="lazy"
          decoding="async"
          className="h-36 w-36 rounded-full border border-border object-cover sm:h-44 sm:w-44"
        />
        <div className="max-w-2xl">
          <p className="cor-overline-he">מי מולכם בשיחה</p>
          <p className="mt-4 font-heading text-2xl font-black leading-snug text-foreground sm:text-3xl">
            גם לי היה ידע. ולא ידעתי איך להעביר אותו.
          </p>
          <p className="cor-body-lg mt-4 text-foreground/80">
            שנים החזקתי רק את הצד האנושי, סיפור ונרטיב. כשנכנסתי לעולם העסקי,
            גיליתי שאני יודע דברים שאחרים לא יודעים, וגם שאין לי שום מושג איך
            להסביר את זה ללקוח. מצאתי שהמבנה הוא החצי השני של אותה צורה.
          </p>
          <Link to="/about" className="ld-link mt-4 inline-block">
            עוד עליי
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default FitSection;
