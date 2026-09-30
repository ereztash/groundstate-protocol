import type { StageValue } from "@/components/landing/DiagnosticFormProvider";
import type { SampleSource } from "@/lib/evidence";

/**
 * The four sprint stages, once.
 *
 * Moved here from src/lib/stages.ts and widened to carry the artefact spec that
 * DeliverablesPreview used to keep in a parallel record of its own. Two
 * surfaces were rendering the same four stages from two different sources; the
 * stage names were additionally re-typed as literals in
 * DiagnosticFormSection's payload labels, so a rename had three places to go
 * wrong.
 *
 * Anything that needs a stage name, deliverable or artefact sample reads it from
 * here. Nothing re-types them.
 *
 * The stages carry no price of their own. Operator decision 2026-09-29: the
 * programme is sold as one unit at `program.priceLabel`, and a stage is an
 * entry point into it, not something bought separately. The per-stage ladder
 * (1,000 / 1,300 / 1,600 / 1,900, package 4,500) came out with that decision.
 */

export type StageNumber = "01" | "02" | "03" | "04";

/**
 * How many outreach messages stage 4 produces. Operator decision 2026-08-01.
 *
 * A constant rather than a typed literal because the number was previously
 * written by hand in six places and had already drifted: the site said ten
 * everywhere while guarantee.ts promised five, and the guarantee is the one
 * that carries a refund. Anything inside the bundle now derives from here.
 *
 * index.html and public/llms.txt cannot import it, so they are hand-maintained
 * and held by the refuted-claims scan instead. That scan is the reason the drift
 * cannot come back silently.
 */
export const outreachCount = 5;

/**
 * The visible deliverable each stage produces. This is a specification of what
 * the client walks away holding, not a claim about an outcome. See
 * src/lib/evidence.ts for why the two are kept apart.
 */
export type StageArtifact = {
  /** Document label on the artefact card. */
  docLabel: string;
  /** Companion artefact, only where the stage actually defines one. */
  secondaryDoc?: string;
  /** One representative line from the artefact. */
  sample: string;
  /** Redacted-real or method-reconstruction. Drives the visible label. */
  sampleSource: SampleSource;
  /** Body lines drawn in the mock, purely visual. */
  lineCount: number;
};

export type Stage = {
  number: StageNumber;
  name: string;
  /** The cognitive verb for this stage. */
  verb: string;
  description: string;
  deliverable: string;
  /**
   * What the deliverable is FOR, in the reader's terms. A spec answers
   * "what do I get"; this answers "so what". Kept as a separate field so it
   * cannot drift into the deliverable and quietly turn a description of an
   * artefact into a claim about a result.
   */
  benefit: string;
  value: StageValue;
  /** CTA copy used in SequenceSection cards and the wizard. Names an entry point. */
  ctaLabel: string;
  /** Label used on the lead payload and in the operator's sheet. */
  payloadLabel: string;
  artifact: StageArtifact;
};

export const stages: readonly Stage[] = [
  {
    number: "01",
    name: "נרטיב ייחודי",
    verb: "חילוץ",
    description:
      "פגישה אחת שמחלצת את הבידול שלכם מתוך החומר שכבר קיים אצלכם.",
    deliverable:
      "מסמך נרטיב באורך עמוד עד שניים עם 3 עד 5 ניסוחים מילוליים מוכנים.",
    benefit:
      "כדי להפסיק להחליף כותרת כל שלושה שבועות, ולהגיד את אותו משפט גם בעוד חצי שנה.",
    value: "stage-1",
    ctaLabel: "להתחיל משלב 1",
    payloadLabel: "שלב 1, נרטיב ייחודי",
    artifact: {
      docLabel: "מסמך נרטיב",
      sample:
        "אני עוזרת ליועצים להפוך 20 שנות ניסיון למשפט אחד שאומרים בלי לגמגם.",
      sampleSource: "method-reconstruction",
      lineCount: 8,
    },
  },
  {
    number: "02",
    name: "הצעת ערך ייחודית",
    verb: "הבלטה",
    description:
      "פגישה אחת להבלטת הערך הייחודי שלכם מתוך הנרטיב, עם ניתוח שוק ומילון כאב מבוסס שיח לקוחות. כל החלקים נשארים, ובוחרים על מה האור נופל.",
    deliverable: "משפט ליבה ומילון כאב מוכן לשליחה.",
    benefit:
      "כדי להפסיק לנחש איזה כאב מדליק לקוח, ולכתוב במילים שהוא כבר אמר.",
    value: "stage-2",
    ctaLabel: "להתחיל משלב 2",
    payloadLabel: "שלב 2, הצעת ערך ייחודית",
    artifact: {
      docLabel: "הצעת ערך",
      secondaryDoc: "מילון כאב",
      sample:
        "מה לקוח אומר: ״הניסוח שלי תקוע״. מה אני שומע: ״ההצעה לא חתוכה.״",
      sampleSource: "method-reconstruction",
      lineCount: 7,
    },
  },
  {
    number: "03",
    name: "מוצר ייחודי",
    verb: "תרגום",
    description:
      "פגישה אחת לתרגום הצעת הערך למוצר עם תמחור ורציונל. מהשפה שלכם לשפה שהלקוח שלכם משלם עליה.",
    deliverable: "תיאור מוצר עם תמחור ורציונל, מוכן לשליחה.",
    benefit:
      "כדי שהלקוח יבין מה הוא קונה עוד לפני שהוא שואל כמה זה עולה.",
    value: "stage-3",
    ctaLabel: "להתחיל משלב 3",
    payloadLabel: "שלב 3, מוצר ייחודי",
    artifact: {
      docLabel: "תיאור מוצר",
      sample: "מסלול 4 פגישות / 30 יום. נכס שעובד גם בעוד שנה.",
      sampleSource: "method-reconstruction",
      lineCount: 9,
    },
  },
  {
    number: "04",
    name: "רכישת לקוחות פרואקטיבית",
    verb: "הפעלה",
    description:
      "פגישה אחת להפעלה: רשימת מקבלי החלטות וטיוטות פנייה. התוצר עובר משלב התכנון לשלב התנועה בשטח.",
    // "נשלחו" came out of this line. The graph's `מפגש-4 הפעלה` node marks the
    // send-inside-the-meeting criterion 🪦 and states the gap plainly: "הפועל ≠
    // המקודד: '10 פניות נשלחו-ותועדו במפגש' הוא אידיאל. בפועל השליחה מחליקה
    // לשיעורי-בית / מפגש-5 / לא-קורית." Written and documented is what the
    // stage actually produces; the guided run is what happens in the room.
    //
    // The count in that quote is the graph's, from when the stage claimed ten.
    // The stage now produces `outreachCount`, matching the number guarantee.ts
    // attaches a refund to.
    deliverable: `${outreachCount} פניות שנכתבו ותועדו, והרצה מונחית של הראשונה בחדר. יומן אותות קנייה למעקב אחרי התגובות.`,
    benefit:
      "כדי שהמסמכים ייצאו מהמחשב אל אנשים ששמם ידוע לכם, ולא יישארו תוכנית.",
    value: "stage-4",
    ctaLabel: "להתחיל משלב 4",
    payloadLabel: "שלב 4, רכישת לקוחות פרואקטיבית",
    artifact: {
      docLabel: `${outreachCount} פניות מתועדות`,
      secondaryDoc: "יומן אותות קנייה",
      sample: "Subject: ראיתי מה שכתבת על המשבר ב-Q2. שאלה אחת.",
      sampleSource: "method-reconstruction",
      lineCount: 10,
    },
  },
];

export function getStage(value: StageValue): Stage | undefined {
  return stages.find((s) => s.value === value);
}

/** Payload labels, derived rather than re-typed. */
export const stagePayloadLabels: Record<string, string> = {
  ...Object.fromEntries(stages.map((s) => [s.value, s.payloadLabel])),
  "full-package": "התוכנית המלאה",
};

/**
 * The programme, sold as one unit. Operator decision 2026-09-29, matching the
 * standard price in the webinar plan of 2026-08-05: four meetings, ₪4,000, in
 * two payments of ₪2,000.
 *
 * The stage value stays "full-package" because the lead sheet and the journey
 * enums already carry it; only the visible label changed.
 */
export const program = {
  priceNis: 4000,
  priceLabel: "₪4,000",
  installmentsLabel: "בשני תשלומים של ₪2,000",
  name: "התוכנית המלאה",
  deliverable: "ארבעת השלבים ברצף, עם ליווי בין הפגישות.",
  ctaLabel: "לשיחת התאמה על התוכנית",
} as const;
