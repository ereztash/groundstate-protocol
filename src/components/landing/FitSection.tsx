import { Link } from "react-router-dom";
import SectionHead from "./SectionHead";

const portrait = `${import.meta.env.BASE_URL}portrait.webp`;

/**
 * Who this is for, who it is not for, and who is on the other side of the
 * call, on one spread.
 *
 * The filter is part of the conversion, not a courtesy: a call with someone
 * the programme cannot help costs both people thirty minutes and trains the
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
  "אתם בתחילת הדרך כעצמאים, ובוער לכם להבין מה בעצם אתם מוכרים.",
  "יש לכם כבר לקוחות מרוצים, אבל קשה לכם להסביר למי שעוד לא עבד איתכם למה לבחור דווקא בכם.",
  "אתם משלבים שני עולמות, ולא מצליחים להסביר את השילוב במשפט אחד.",
  "אתם מוכנים לפגישה בשבוע ולמשימה קצרה בין הפגישות, במשך חודש.",
];

const NOT_FOR = [
  "אתם נותנים שירות בעיקר לתאגידים, לא לעצמאים.",
  "יש לכם כבר 30+ לקוחות פעילים ואתם רוצים לסנן.",
  "אתם רגילים לעבוד לפי תחושה, ועבודה לפי מבנה תעצבן אתכם.",
  "אתם מחפשים בעיקר מישהו שיחזיק לכם את היד, ואני פחות מתחבר לזה.",
];

const FitSection = () => (
  <section
    id="fit"
    dir="rtl"
    aria-labelledby="fit-title"
    className="ld-section border-t border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <SectionHead label="התאמה" />
      <h2 id="fit-title" className="cor-title mt-4 max-w-2xl text-foreground">
        למי זה מתאים
      </h2>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="ld-plain p-6 sm:p-8">
          <h3 className="font-heading text-xl font-black text-foreground">
            מתאים לכם אם
          </h3>
          <ul className="mt-5 space-y-4">
            {FOR.map((line) => (
              <li key={line} className="flex gap-3 leading-relaxed text-foreground">
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ld-draft p-6 sm:p-8">
          <h3 className="font-heading text-xl font-black text-foreground">
            פחות מתאים לכם אם
          </h3>
          <ul className="mt-5 space-y-4">
            {NOT_FOR.map((line) => (
              <li key={line} className="flex gap-3 leading-relaxed text-muted-foreground">
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
            אני עושה את זה כי הייתי בדיוק שם.
          </p>
          <p className="cor-body-lg mt-4 text-foreground">
            היה לי ידע וניסיון מתחומים מגוונים, ולא הבנתי איך אני גוזר את כולם למשהו אחד שמגיע לו כסף. ניסיתי המון זמן להבין את זה, ומשם יצא התהליך שאני עושה היום.
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
