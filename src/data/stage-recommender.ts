import type { StageValue } from "@/components/landing/DiagnosticFormProvider";
import { getStage, outreachCount, program } from "@/data/sprint-stages";
import type { Answer } from "@/lib/wizardState";

/**
 * The wizard's content and the rule that turns four answers into one
 * recommendation.
 *
 * Split out of StageRecommenderSection.tsx, which was 757 lines of which about
 * 180 were this. Nothing here touches React: given four answers and the open
 * text, `recommend()` is a pure function, and it is the part with behaviour
 * worth testing on its own. The component keeps the wizard's UI and state.
 *
 * Stage facts (number, name, deliverable) and the programme price are read from
 * sprint-stages.ts rather than repeated, so the wizard and the page cannot
 * drift. Each recommendation owns only what is specific to it: the reflection
 * shown back to the reader, and the reason for the entry point.
 *
 * Since 2026-09-29 the programme is one unit at `program.priceLabel`, so a
 * recommendation names where to start, not what to buy. Copy addresses the
 * reader in the plural, per the operator decision of the same day.
 */

type Option = {
  label: string;
  value: Answer;
};

export type Question = {
  key: "narrative" | "valueprop" | "product" | "outreach";
  anticipation: string;
  text: string;
  options: [Option, Option, Option];
};

export type Recommendation = {
  stage: StageValue;
  number: "01" | "02" | "03" | "04" | null;
  name: string;
  /** The programme price, shown on every path. Stages are not priced. */
  price: string;
  deliverable: string;
  reflection: string;
  reason: string;
  ctaPrimary: string;
};

const PROGRAM_PRICE = `נקודת כניסה לתוכנית המלאה, ${program.priceLabel}`;

function baseFor(
  value: StageValue
): Pick<
  Recommendation,
  "stage" | "number" | "name" | "price" | "deliverable" | "ctaPrimary"
> {
  const s = getStage(value);
  if (!s) throw new Error(`Unknown stage: ${value}`);
  return {
    stage: value,
    number: s.number,
    name: s.name,
    price: PROGRAM_PRICE,
    deliverable: s.deliverable,
    ctaPrimary: s.ctaLabel,
  };
}

export const QUESTIONS: Question[] = [
  {
    key: "narrative",
    anticipation: "שתי השניות הראשונות של כל פגישה.",
    text: "כשאתם מספרים במסיבה במה אתם עוסקים, מה קורה לרוב?",
    options: [
      { label: "האדם מבין מיד ושואל שאלה ספציפית.", value: 0 },
      {
        label:
          "האדם מנסה לקטלג (״אה, אז זה כמו…?״) ונדרשים עוד שני משפטי הסבר.",
        value: 1,
      },
      { label: "האדם מהנהן בנימוס ומחליף נושא.", value: 2 },
    ],
  },
  {
    key: "valueprop",
    anticipation: "הרגע השני של אמת, מיד אחרי המשפט.",
    text: "כשלקוח רואה את המחיר שלכם, מה התגובה הראשונה?",
    options: [
      { label: "״מצוין, מתי מתחילים?״", value: 0 },
      { label: "״אהמ, אחזור אליכם״ (לפעמים חוזרים, לפעמים לא).", value: 1 },
      { label: "״וואו, זה הרבה״, וצריך לנמק.", value: 2 },
    ],
  },
  {
    key: "product",
    anticipation: "מה אתם שולחים, אחרי שהוא ביקש.",
    text: "לקוח שואל ״מה אני מקבל בדיוק?״, מה אתם עושים?",
    options: [
      { label: "שולחים קובץ מוכן שיוצא לכל פנייה.", value: 0 },
      { label: "שולחים משהו ישן ומוסיפים הסבר בגוף המייל.", value: 1 },
      { label: "פותחים Word ריק ומתחילים לכתוב.", value: 2 },
    ],
  },
  {
    key: "outreach",
    anticipation: "השאלה האחרונה, והקריטית מכולן.",
    text: "בחודש הבא, מאיפה הלקוחות הבאים שלכם יבואו?",
    options: [
      {
        label: "ידוע בדיוק: יש 3 שיחות פתוחות / לקוח חוזר / הפניה ידועה.",
        value: 0,
      },
      { label: "יש כמה הזדמנויות ותקווה, בלי ודאות.", value: 1 },
      { label: "אין לי מושג. אם לא ייכנס משהו, החודש יהיה ריק.", value: 2 },
    ],
  },
];

// Single-problem recommendations (one "2" wins).
const SINGLE_RECS: Record<number, Recommendation> = {
  0: {
    ...baseFor("stage-1"),
    reflection:
      "אמרתם שכשאתם מספרים במסיבה מה אתם עושים, האדם מהנהן ומחליף נושא. זה האות שהנרטיב עוד לא יודע לתפוס את הקרקע. כל מה שבא אחריו, מחיר, מוצר, פניות, נשען עליו. אז שם מתחילים.",
    reason:
      "כל מה שבא אחר כך מבוסס על משפט הליבה שלכם. בלעדיו, השלבים הבאים נשענים על קרקע רכה.",
  },
  1: {
    ...baseFor("stage-2"),
    // Was "זו לא בעיה של מחיר, זו בעיה של הצעה": the not-X-it-is-Y
    // construction the house rules ban. Same diagnosis, stated directly.
    reflection:
      "סיפרתם שלקוח רואה את המחיר ואומר ״וואו, זה הרבה״, ואתם מנמקים בכל פעם. מה שדורש עבודה הוא ההצעה, והמחיר רק חושף את זה. אם הלקוח לא רואה למה זה שווה לפני שראה את הסכום, הסכום תמיד ייראה גדול.",
    reason:
      "יש לכם נרטיב. מה שחסר הוא הצעה ברורה ללקוח: מה הוא מקבל, ולמה זה שווה את הסכום.",
  },
  2: {
    ...baseFor("stage-3"),
    reflection:
      "אמרתם שכשלקוח שואל ״מה אני מקבל?״ אתם פותחים Word ריק. כלומר כל לקוח מתחיל מאפס, וזה גוזל זמן ומשדר חוסר ביטחון. צריך מסמך אחד שעובד פעם אחר פעם.",
    reason:
      "יש לכם הצעת ערך, אבל אין תיעוד מוצרי. ניצור מסמך אחד שנשלח שוב ושוב, במקום לבנות מאפס בכל פעם.",
  },
  3: {
    ...baseFor("stage-4"),
    reflection:
      "אמרתם שאתם לא יודעים מאיפה יבואו הלקוחות הבאים. מה שחסר כאן הוא מערכת. כל החודש נסמך על תקווה, וצריך צינור פעיל, גם אם הוא קטן.",
    // Was "שיביא את 10 השיחות הבאות": an outcome number with no evidence
    // level, from a stage that produces outreachCount messages.
    reason: `המוצר מוכן והנרטיב חד. חסר צינור פנייה פעיל, שמתחיל ב-${outreachCount} פניות.`,
  },
};

// Dual-problem reflections: when exactly two answers are "2".
// Recommendation is always the lower-indexed stage (more foundational).
const DUAL_REFLECTIONS: Record<string, string> = {
  "0-1":
    "אנשים מהנהנים ומחליפים נושא, וגם לקוחות אומרים וואו על המחיר. שני אלה מצביעים על נושא אחד: המאזין לא מבין מה אתם מוכרים עד שראה את הסכום, ובלי הבנה סכום תמיד נראה גדול. הנרטיב הוא הקרקע, אז משם מתחילים.",
  "0-2":
    "אנשים מהנהנים ומחליפים נושא, וגם אתם פותחים Word ריק לכל לקוח. שני אלה אומרים שהמסר עוד לא מקודד. בלי משפט ליבה אי אפשר לתחזק מסמך אחד, ובלי מסמך אחד כל לקוח דורש מאמץ מאפס. נרטיב ראשון, מוצר אחריו.",
  "0-3":
    "אנשים מהנהנים ומחליפים נושא, וגם לא ברור מאיפה יבוא החודש הבא. כשפניות יוצאות לא עובדות, חלק גדול מהסיבה הוא משפט ראשון שלא תופס. הנרטיב מטפל בשני הדברים יחד.",
  // Used to say stage 2 "מייצר את התיאור הראשון". The product description is
  // stage 3's deliverable; stage 2 produces the core sentence and pain lexicon.
  "1-2":
    "לקוחות אומרים וואו על המחיר, וגם אתם פותחים Word ריק לכל פנייה. כשאין הצעת ערך ברורה, אין מה לקבע במסמך, וכשאין מסמך, הצעת הערך נשארת בעל פה. מתחילים בשלב 2, ושלב 3 מקבע אותה בתיאור מוצר.",
  "1-3":
    "לקוחות אומרים וואו על המחיר, וגם אין צינור פנייה ברור. שני אלה אומרים שהצעת הערך עוד לא חדה מספיק כדי שמי שמקבל פנייה יבין מהר למה זה רלוונטי אליו. עובדים על שלב 2 קודם, ואז שלב 4 נעשה הרבה יותר קל.",
  "2-3":
    "אתם פותחים Word ריק לכל לקוח, וגם אין צינור פנייה ברור. שני אלה אומרים שעוד אין נכס להעביר הלאה. בלי מוצר מנוסח, גם פנייה שנכתבה לא תפעל. מתחילים בשלב 3.",
};

const ALL_ZERO_REC: Recommendation = {
  ...baseFor("stage-4"),
  // "רוב הלקוחות שלי מגיעים אחרי שמשהו נשבר" came out: a claim about the
  // client base with no count behind it.
  reflection:
    "מבחינת המבנה, אתם במצב טוב. נרטיב חד, הצעה ברורה, מוצר מוכן. מה שמוסיף כאן הוא שכבה של פניות יוצאות, שמגדילה בלי להזיז דבר אחר.",
  reason:
    "אתם במצב טוב. פניות יוצאות הן שכבה נוספת, שנותנת שליטה על קצב הלקוחות.",
};

const MILD_REC: Recommendation = {
  ...baseFor("stage-1"),
  reflection:
    "יש לכם כיוון בכל ארבעת התחומים, אבל אף אחד מהם לא ממש חד. חידוד הנרטיב הוא בדרך כלל הנקודה שכשפותחים אותה, השאר נפתח אחריה. עדיף לחדד את הקרקע לפני שמוסיפים שכבות.",
  reason:
    "יש כיוון בכל התחומים, ואף אחד לא חד. חידוד הנרטיב מחדד גם את שאר השלבים.",
};

const FULL_PACKAGE_REC: Recommendation = {
  stage: "full-package",
  number: null,
  name: program.name,
  price: `${program.priceLabel}, ${program.installmentsLabel}`,
  deliverable: program.deliverable,
  reflection:
    "כמה תחומים דורשים עבודה במקביל. כאן הרצף המלא עושה את העבודה: ארבעה שלבים בסדר קבוע, עם ליווי בין הפגישות ששומר על המומנטום.",
  reason:
    "כמה שלבים דורשים עבודה. הרצף המלא, מהשלב הראשון, שומר על המומנטום בין הפגישות.",
  ctaPrimary: program.ctaLabel,
};

function findTwos(answers: Answer[]): number[] {
  const twos: number[] = [];
  answers.forEach((a, i) => {
    if (a >= 2) twos.push(i);
  });
  return twos;
}

export function recommend(answers: Answer[], openText: string): Recommendation {
  const twos = findTwos(answers);

  let base: Recommendation;

  if (twos.length >= 3) {
    base = FULL_PACKAGE_REC;
  } else if (twos.length === 2) {
    const key = `${twos[0]}-${twos[1]}`;
    const reflection = DUAL_REFLECTIONS[key];
    const single = SINGLE_RECS[twos[0]];
    base = { ...single, reflection };
  } else if (twos.length === 1) {
    base = SINGLE_RECS[twos[0]];
  } else {
    // Annotated, because Answer is a 0|1|2 union: without it the accumulator is
    // inferred as Answer and s + v widens to number, which does not fit back in.
    const sum = answers.reduce<number>((s, v) => s + v, 0);
    base = sum === 0 ? ALL_ZERO_REC : MILD_REC;
  }

  if (openText.trim()) {
    const quote = openText.trim().slice(0, 200);
    return {
      ...base,
      reflection: `כתבתם: ״${quote}״.\n\n${base.reflection}`,
    };
  }

  return base;
}
