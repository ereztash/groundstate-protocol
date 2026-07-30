import EvidenceTag from "@/components/EvidenceTag";
import type { EvidenceLevel } from "@/lib/evidence";

/**
 * Quantified proof band.
 *
 * Each figure carries its own evidence level, because the two here are not the
 * same kind of number: the ratio is measured across a handful of completed
 * sprints, the revenue figure is a single case reported by the operator and not
 * cross-checked. Presenting them at equal strength was the defect.
 *
 * Both labels state their n. A figure whose n lives in a code comment is a
 * figure the reader cannot weigh, and the closing line of this component commits
 * the site to the opposite of that.
 *
 * Deliberately excluded: the "~10% of 86 meetings" figure, which stays out of
 * marketing until a conversion log exists, and any client name.
 */

type Stat = {
  value: string;
  label: string;
  level: EvidenceLevel;
};

const STATS: Stat[] = [
  {
    value: "×5 עד 7.5",
    label: "הערך שנפתח ביחס למחיר, אצל 4 הלקוחות שהשלימו את הרצף עם ערך מדיד. n=4",
    level: "operator",
  },
  {
    value: "₪5,500",
    label:
      "הכנסה שנרשמה אצל לקוח אחד, אחרי שלב 4, מתוך 10 הפניות שיצאו בליווי. n=1",
    level: "operator",
  },
];

const QuantifiedProof = ({ className }: { className?: string }) => {
  return (
    <div dir="rtl" className={className}>
      <p className="cor-overline-he">המספרים</p>
      <dl className="mt-6 grid gap-6 sm:grid-cols-2">
        {STATS.map((s) => (
          <div
            key={s.value}
            className="rounded-xl border border-border bg-card p-6"
          >
            <dt className="flex items-baseline justify-between gap-3">
              <span className="text-3xl font-bold tracking-tight text-accent md:text-4xl">
                {s.value}
              </span>
              <EvidenceTag level={s.level} />
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-foreground/80">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        שני המספרים הם דיווח שלי, ולא הוצלבו מול מקור שני. אני מעדיף לספר מעט
        ומסויג, מאשר הרבה ולא בדוק.
      </p>
    </div>
  );
};

export default QuantifiedProof;
