import type { StageValue } from "@/components/landing/DiagnosticFormProvider";
import { fullPackage, getStage } from "@/data/sprint-stages";
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
 * Stage facts — number, name, price, deliverable — are read from
 * sprint-stages.ts rather than repeated, so the wizard and the price ladder
 * cannot drift. Each recommendation owns only what is specific to it: the
 * reflection shown back to the reader, and the reason for the stage.
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
  price: string;
  deliverable: string;
  reflection: string;
  reason: string;
  ctaPrimary: string;
};

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
    price: s.priceLabel,
    deliverable: s.deliverable,
    ctaPrimary: `${s.ctaLabel}, ${s.priceLabel}`,
  };
}

export const QUESTIONS: Question[] = [
  {
    key: "narrative",
    anticipation: "שתי השניות הראשונות של כל פגישה.",
    text: "כשאת אומרת במסיבה ״אני עוסקת ב-X״, מה קורה לרוב?",
    options: [
      { label: "האדם מבין מיד ושואל שאלה ספציפית.", value: 0 },
      {
        label:
          "האדם מנסה לקטלג (״אה, אז את כמו…?״) ואני מסבירה עוד שני משפטים.",
        value: 1,
      },
      { label: "האדם מהנהן בנימוס ומחליף נושא.", value: 2 },
    ],
  },
  {
    key: "valueprop",
    anticipation: "הרגע השני של אמת, מיד אחרי המשפט.",
    text: "כשלקוח רואה את המחיר שלך, מה התגובה הראשונה?",
    options: [
      { label: "״מצוין, מתי מתחילים?״", value: 0 },
      { label: "״אהמ, אחזור אליך״ (לפעמים חוזרים, לפעמים לא).", value: 1 },
      { label: "״וואו, זה הרבה״, וצריך לנמק.", value: 2 },
    ],
  },
  {
    key: "product",
    anticipation: "מה את שולחת, אחרי שהוא ביקש.",
    text: "לקוח שואל ״מה אני מקבל בדיוק?״, מה את עושה?",
    options: [
      { label: "שולחת קובץ מוכן שאני שולחת לכל פנייה.", value: 0 },
      { label: "שולחת משהו ישן ומוסיפה הסבר בגוף המייל.", value: 1 },
      { label: "פותחת Word ריק ומתחילה לכתוב.", value: 2 },
    ],
  },
  {
    key: "outreach",
    anticipation: "השאלה האחרונה, והקריטית מכולן.",
    text: "חודש הבא, מאיפה הלקוחות הבאים שלך יבואו?",
    options: [
      {
        label: "יודעת בדיוק, יש 3 שיחות פתוחות / לקוח חוזר / הפניה ידועה.",
        value: 0,
      },
      { label: "מקווה, יש כמה הזדמנויות, לא בטוחה.", value: 1 },
      { label: "אין לי מושג. אם לא ייכנס משהו, החודש יהיה ריק.", value: 2 },
    ],
  },
];

// Single-problem recommendations (one "2" wins).
const SINGLE_RECS: Record<number, Recommendation> = {
  0: {
    ...baseFor("stage-1"),
    reflection:
      "אמרת שכשאת אומרת במסיבה מה את עושה, האדם מהנהן ומחליף נושא. זה האות שהנרטיב עוד לא יודע לתפוס את הקרקע. כל מה שבא אחריו, מחיר, מוצר, פניות, נשען עליו. אז שם מתחילים.",
    reason:
      "כל מה שבא אחר כך מבוסס על משפט הליבה שלך. בלעדיו, השלבים הבאים נשענים על קרקע רכה.",
  },
  1: {
    ...baseFor("stage-2"),
    reflection:
      "סיפרת שלקוח רואה את המחיר ואומר ״וואו, זה הרבה״, ואת מנמקת בכל פעם. זו לא בעיה של מחיר, זו בעיה של הצעה. אם הלקוח לא רואה למה זה שווה לפני שראה את הסכום, הסכום תמיד יהיה גדול.",
    reason:
      "יש לך נרטיב. החסר הוא ההצעה הברורה ללקוח, מה הוא מקבל, ולמה זה שווה את הסכום.",
  },
  2: {
    ...baseFor("stage-3"),
    reflection:
      "אמרת שכשלקוח שואל ״מה אני מקבל?״ את פותחת Word ריק. זה אומר שאת מתחילה מאפס לכל לקוח, וזה גוזל זמן ומשדר חוסר ביטחון. צריך מסמך אחד שעובד פעם אחר פעם.",
    reason:
      "יש לך הצעת ערך אבל אין תיעוד מוצרי. ניצור מסמך אחד שנשלח שוב ושוב, במקום לבנות מאפס בכל פעם.",
  },
  3: {
    ...baseFor("stage-4"),
    reflection:
      "אמרת שאת לא יודעת מאיפה יבואו הלקוחות הבאים. זו לא בעיה של איכות, זו בעיה של מערכת. כל החודש שלך נסמך על תקווה. צריך צינור פעיל, גם אם הוא קטן.",
    reason:
      "המוצר מוכן והנרטיב חד. חסר רק צינור פנייה שיביא את 10 השיחות הבאות.",
  },
};

// Dual-problem reflections — when exactly two answers are "2".
// Recommendation is always the lower-indexed stage (more foundational).
const DUAL_REFLECTIONS: Record<string, string> = {
  "0-1":
    "אנשים מהנהנים ומחליפים נושא, וגם לקוחות בוואו על המחיר. שני אלה ביחד מצביעים על נושא אחד: המאזין לא מבין מה את מוכרת עד שראה את הסכום. ובלי הבנה, סכום תמיד גדול. הנרטיב הוא הקרקע, אז משם מתחילים.",
  "0-2":
    "אנשים מהנהנים ומחליפים נושא, וגם את פותחת Word ריק לכל לקוח. שני אלה ביחד אומרים שהמסר עוד לא מקודד. בלי משפט ליבה לא תוכלי לתחזק מסמך אחד; בלי מסמך אחד, כל לקוח דורש מאמץ מאפס. נרטיב ראשון, מוצר אחריו.",
  "0-3":
    "אנשים מהנהנים ומחליפים נושא, וגם את לא יודעת מאיפה יבוא חודש הבא. אם פניות יוצאות לא מצליחות, חלק גדול מהסיבה הוא שהמשפט הראשון לא תופס. נרטיב מתקן את שני הצמתים ביחד.",
  "1-2":
    "לקוחות בוואו על המחיר, וגם את פותחת Word ריק לכל פנייה. כשאין הצעת ערך ברורה, אין מה לקבוע במסמך; וכשאין מסמך, הצעת הערך נשארת בעל-פה. שני אלה נפתרים בשלב 2 שמייצר את התיאור הראשון.",
  "1-3":
    "לקוחות בוואו על המחיר, וגם אין צינור פנייה ברור. שני אלה ביחד אומרים: הצעת הערך לא מספיק חדה כדי שמי שמקבל פנייה ידע מהר למה זה רלוונטי אליו. עובדים על שלב 2 קודם, אחר כך שלב 4 יהיה הרבה יותר קל.",
  "2-3":
    "את פותחת Word ריק לכל לקוח, וגם אין צינור פנייה ברור. שני אלה ביחד אומרים שאין לך ׳נכס׳ להעביר הלאה. בלי מוצר מנוסח, הפנייה, גם אם תיכתב, לא תפעל. שלב 3 הוא הצומת הראשון.",
};

const ALL_ZERO_REC: Recommendation = {
  ...baseFor("stage-4"),
  reflection:
    "מבחינת המבנה, את במצב טוב. נרטיב חד, הצעה ברורה, מוצר מוכן. רוב הלקוחות שלי מגיעים אחרי שמשהו נשבר פתאום: לקוח מרכזי עזב, השוק זז, החלטת להעלות מחיר. עד שזה קורה אצלך, תוסף של פניות יוצאות יכול להגדיל בלי להזיז דבר אחר.",
  reason:
    "את במצב טוב. פניות יוצאות הן תוסף, לא תיקון, אלא שכבה שתיתן לך שליטה על קצב הלקוחות.",
};

const MILD_REC: Recommendation = {
  ...baseFor("stage-1"),
  reflection:
    "יש לך כיוון בכל ארבעת הצמתים, אבל אף אחד לא ממש חד. ברוב המקרים, חידוד הנרטיב הוא הצומת שכשפותחים אותו השאר נפתח אוטומטית. עדיף לחדד את הקרקע לפני שמוסיפים שכבות.",
  reason:
    "יש לך כיוון בכל הצמתים, אף אחד לא חד. חידוד הנרטיב מחדד את שאר השלבים כתוצאה.",
};

const FULL_PACKAGE_REC: Recommendation = {
  stage: "full-package",
  number: null,
  name: fullPackage.name,
  price: fullPackage.priceLabel,
  deliverable: fullPackage.deliverable,
  reflection: `כמה צמתים דורשים עבודה ביחד. במקום לקנות שלבים בנפרד, החבילה המלאה זולה ב-${fullPackage.savingsLabel} ושומרת על המומנטום בין הפגישות.`,
  reason: `כמה שלבים דורשים עבודה. החבילה המלאה זולה ב-${fullPackage.savingsLabel} לעומת רכישה שלב-אחר-שלב, ושומרת על המומנטום.`,
  ctaPrimary: `${fullPackage.ctaLabel}, ${fullPackage.priceLabel}`,
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
      reflection: `כתבת: ״${quote}״.\n\n${base.reflection}`,
    };
  }

  return base;
}
