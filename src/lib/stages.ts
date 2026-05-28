import type { StageValue } from "@/components/landing/DiagnosticFormProvider";

export type StageNumber = "01" | "02" | "03" | "04";

export type Stage = {
  number: StageNumber;
  name: string;
  /** The cognitive verb for this stage, displayed as a badge in SequenceSection. */
  verb: string;
  description: string;
  deliverable: string;
  priceNis: number;
  /** Canonical Hebrew formatting (e.g. "1,000 ש״ח"). One source of truth. */
  priceLabel: string;
  value: StageValue;
  /** CTA copy used in SequenceSection cards. */
  ctaLabel: string;
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
    priceLabel: "1,000 ש״ח",
    value: "stage-1",
    ctaLabel: "אני רוצה את שלב 1",
  },
  {
    number: "02",
    name: "הצעת ערך ייחודית",
    verb: "הבלטה",
    description:
      "פגישה אחת להבלטת הערך הייחודי שלך מתוך הנרטיב, עם ניתוח שוק ומילון כאב מבוסס שיח לקוחות. לא מוותרים על חלקים. בוחרים על מה האור נופל.",
    deliverable: "משפט ליבה ומילון כאב מוכן לשליחה.",
    priceNis: 1300,
    priceLabel: "1,300 ש״ח",
    value: "stage-2",
    ctaLabel: "אני רוצה את שלב 2",
  },
  {
    number: "03",
    name: "מוצר ייחודי",
    verb: "תרגום",
    description:
      "פגישה אחת לתרגום הצעת הערך למוצר עם תמחור ורציונל. מהשפה שלך לשפה שהלקוח שלך משלם עליה.",
    deliverable: "תיאור מוצר עם תמחור ורציונל, מוכן לשליחה.",
    priceNis: 1600,
    priceLabel: "1,600 ש״ח",
    value: "stage-3",
    ctaLabel: "אני רוצה את שלב 3",
  },
  {
    number: "04",
    name: "רכישת לקוחות פרואקטיבית",
    verb: "הפעלה",
    description:
      "פגישה אחת להפעלה: רשימת מקבלי החלטות וטיוטות פנייה. התוצר עובר משלב התכנון לשלב התנועה בשטח.",
    deliverable:
      "10 פניות שנכתבו, נשלחו, ותועדו עם אותות הקנייה שזיהיתי בתגובות.",
    priceNis: 1900,
    priceLabel: "1,900 ש״ח",
    value: "stage-4",
    ctaLabel: "אני רוצה את שלב 4",
  },
];

export function getStage(value: StageValue): Stage | undefined {
  return stages.find((s) => s.value === value);
}

/**
 * Full-package pricing. The discount math (full − bundled = savings)
 * lives here so the kicker, the savings copy, and the wizard all agree.
 */
export const fullPackage = {
  priceNis: 4500,
  priceLabel: "4,500 ש״ח",
  fullPriceNis: 5800,
  fullPriceLabel: "5,800 ש״ח",
  savingsNis: 1300,
  savingsLabel: "1,300 ש״ח",
  name: "החבילה המלאה",
  deliverable: "כל ארבעת השלבים ברצף, עם ליווי בין הפגישות.",
  description:
    "כל ארבעת השלבים. ליווי בין הפגישות. תמחור אגרגטיבי שחוסך 1,300 ש״ח לעומת רכישה שלב אחר שלב.",
  ctaLabel: "אני רוצה את החבילה המלאה",
} as const;
