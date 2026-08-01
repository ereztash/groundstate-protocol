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
 * Anything that needs a stage name, price, deliverable or artefact sample reads
 * it from here. Nothing re-types them.
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
  priceNis: number;
  /** Canonical formatting: ₪ prefix, e.g. "₪1,000". One source of truth. */
  priceLabel: string;
  value: StageValue;
  /** CTA copy used in SequenceSection cards. */
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
      "פגישה אחת לחילוץ הבידול שלך מתוך החומר שכבר קיים אצלך. לא מוסיפים. מוציאים החוצה.",
    deliverable:
      "מסמך נרטיב באורך עמוד עד שניים עם 3 עד 5 ניסוחים מילוליים מוכנים.",
    priceNis: 1000,
    priceLabel: "₪1,000",
    value: "stage-1",
    ctaLabel: "אני רוצה את שלב 1",
    payloadLabel: "שלב 1, נרטיב ייחודי",
    artifact: {
      docLabel: "מסמך נרטיב",
      sample:
        "אני עוזר ליועצים להפוך 20 שנות ניסיון למשפט אחד שאומרים בלי לגמגם.",
      sampleSource: "method-reconstruction",
      lineCount: 8,
    },
  },
  {
    number: "02",
    name: "הצעת ערך ייחודית",
    verb: "הבלטה",
    description:
      "פגישה אחת להבלטת הערך הייחודי שלך מתוך הנרטיב, עם ניתוח שוק ומילון כאב מבוסס שיח לקוחות. לא מוותרים על חלקים. בוחרים על מה האור נופל.",
    deliverable: "משפט ליבה ומילון כאב מוכן לשליחה.",
    priceNis: 1300,
    priceLabel: "₪1,300",
    value: "stage-2",
    ctaLabel: "אני רוצה את שלב 2",
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
      "פגישה אחת לתרגום הצעת הערך למוצר עם תמחור ורציונל. מהשפה שלך לשפה שהלקוח שלך משלם עליה.",
    deliverable: "תיאור מוצר עם תמחור ורציונל, מוכן לשליחה.",
    priceNis: 1600,
    priceLabel: "₪1,600",
    value: "stage-3",
    ctaLabel: "אני רוצה את שלב 3",
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
    priceNis: 1900,
    priceLabel: "₪1,900",
    value: "stage-4",
    ctaLabel: "אני רוצה את שלב 4",
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
  "full-package": "חבילה מלאה",
};

/**
 * Full-package pricing. The discount math (full − bundled = savings) lives here
 * so the kicker, the savings copy, and the wizard all agree.
 */
export const fullPackage = {
  priceNis: 4500,
  priceLabel: "₪4,500",
  fullPriceNis: 5800,
  fullPriceLabel: "₪5,800",
  savingsNis: 1300,
  savingsLabel: "₪1,300",
  name: "החבילה המלאה",
  deliverable: "כל ארבעת השלבים ברצף, עם ליווי בין הפגישות.",
  description:
    "כל ארבעת השלבים. ליווי בין הפגישות. תמחור אגרגטיבי שחוסך ₪1,300 לעומת רכישה שלב אחר שלב.",
  ctaLabel: "אני רוצה את החבילה המלאה",
} as const;
