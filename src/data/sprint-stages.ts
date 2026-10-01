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
  /**
   * The stage in the buyer's words: what she walks out holding, as she would
   * say it. Shown as the heading on the landing page, where the method's own
   * names ("נרטיב ייחודי", "חילוץ") read as the expert's vocabulary. Graph
   * heuristic H21 (שפת-הלקוח-הסופי): at the marketing gate, describe the
   * problem the way the buyer describes it. Each title is lifted from this
   * stage's own `benefit` or its /protocol exit criterion, so it adds no claim.
   */
  buyerTitle: string;
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
    name: "נרטיב",
    buyerTitle: "משפט אחד שמחזיק גם בעוד חצי שנה",
    verb: "חילוץ",
    description:
      "פגישה אחת שבה אנחנו מחפשים את הבידול שלכם בתוך הסיפורים שאתם כבר מספרים.",
    deliverable:
      "מסמך נרטיב של עמוד או שניים, עם 3 עד 5 ניסוחים מוכנים.",
    benefit:
      "כדי להפסיק להחליף כותרת כל שלושה שבועות.",
    value: "stage-1",
    ctaLabel: "להתחיל משלב 1",
    payloadLabel: "שלב 1, נרטיב ייחודי",
    artifact: {
      docLabel: "מסמך נרטיב",
      sample:
        // Was "...שאומרים בלי לגמגם". The content iron rules (graph node
        // כללי-ברזל RUNNER) ban "גמגם/גמגום" as insulting to the reader, and
        // this line became the hero's centrepiece on 2026-09-29.
        "אני פותרת ליועצים עם 20 שנות ניסיון את הבעיה שאין להם משפט אחד שמסביר מה הם עושים.",
      sampleSource: "method-reconstruction",
      lineCount: 8,
    },
  },
  {
    number: "02",
    name: "הצעת ערך",
    buyerTitle: "המילים שהלקוחות שלכם כבר אומרים",
    verb: "הבלטה",
    description:
      "פגישה אחת להבלטת הערך הייחודי שלכם מתוך הנרטיב, עם ניתוח שוק ומילון כאב מבוסס שיח לקוחות. כל החלקים נשארים, ובוחרים על מה האור נופל.",
    deliverable: "משפט מוכן לשליחה, ורשימה של מה שהלקוחות שלכם אומרים.",
    benefit:
      "ככל שמדברים יותר בשפה של הלקוח, צריך פחות להתאמץ כדי להסביר לו מה אתם עושים.",
    value: "stage-2",
    ctaLabel: "להתחיל משלב 2",
    payloadLabel: "שלב 2, הצעת ערך ייחודית",
    artifact: {
      docLabel: "הצעת ערך",
      secondaryDoc: "מילון כאב",
      sample:
        "כשלקוח אומר ״הניסוח שלי תקוע״, מה שאני שומע זה שההצעה עוד לא מדויקת.",
      sampleSource: "method-reconstruction",
      lineCount: 7,
    },
  },
  {
    number: "03",
    name: "מוצר",
    buyerTitle: "מוצר עם מחיר שאפשר להגיד בקול",
    verb: "תרגום",
    description:
      "פגישה אחת לתרגום הצעת הערך למוצר עם תמחור ורציונל. מהשפה שלכם לשפה שהלקוח שלכם משלם עליה.",
    deliverable: "תיאור של המוצר, עם המחיר ולמה הוא כזה.",
    benefit:
      "כדי שהלקוח יבין מה הוא קונה עוד לפני שהוא שואל כמה זה עולה.",
    value: "stage-3",
    ctaLabel: "להתחיל משלב 3",
    payloadLabel: "שלב 3, מוצר ייחודי",
    artifact: {
      docLabel: "תיאור מוצר",
      sample: "מסלול 4 פגישות / 30 יום.",
      sampleSource: "method-reconstruction",
      lineCount: 9,
    },
  },
  {
    number: "04",
    name: "פנייה יזומה",
    buyerTitle: `${outreachCount} פניות לאנשים שיכולים לקנות מכם`,
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
    deliverable: `${outreachCount} פניות כתובות ומתועדות. על הראשונה אנחנו עוברים ביחד בפגישה, ואת התגובות רושמים ביומן.`,
    benefit:
      "כדי שהמסמכים ייצאו מהמחשב ויגיעו אל האנשים שבחרתם.",
    value: "stage-4",
    ctaLabel: "להתחיל משלב 4",
    payloadLabel: "שלב 4, רכישת לקוחות פרואקטיבית",
    artifact: {
      docLabel: `${outreachCount} פניות מתועדות`,
      secondaryDoc: "יומן אותות קנייה",
      sample: "נושא: חברה דומה לשלכם הייתה באותה בעיה בדיוק",
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
  /**
   * Erez is an exempt dealer (עוסק פטור, 2026-10-01), so the price is final.
   * Said out loud because the market quotes "+ מע״מ": of 21 competitor pages
   * that show a price, 12 mention VAT, and most full programmes add it, so
   * their ₪6,500 reaches the buyer as about ₪7,670.
   */
  vatLabel: "סופי, ללא מע״מ",
  name: "התוכנית המלאה",
  deliverable: "ארבעת השלבים ברצף, עם ליווי בין הפגישות.",
  ctaLabel: "לשיחת התאמה על התוכנית",
} as const;
