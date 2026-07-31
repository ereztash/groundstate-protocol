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
    // Was "×5 עד 7.5". The ledger audit of 2026-07-29 found that multiplier has
    // zero occurrences in the vault as a per-client figure, and that the nearest
    // number is an industry statistic ("ROI פי 5.7–7 בארגונים המחדירים תרבות
    // אימון") that had been converted into a client table. The band that IS
    // corroborated is the 2026-07-22 reconciliation: "value/fee ratio: כל 4
    // בתוך 3x-10x, 0 מדוגלים". Wider and weaker, and the one that is measured.
    value: "×3 עד 10",
    label: "הערך שנפתח ביחס למחיר, אצל 4 הלקוחות שהשלימו את הרצף עם ערך מדיד. n=4",
    level: "operator",
  },
  {
    // Two corrections from ledger 2026-07-13, which supersedes the 07-07 row:
    // the revenue landed between meetings 3 and 4, not after stage 4, and the
    // "10 outreaches that went out" framing asserted the same send-in-meeting
    // mechanism the graph marks 🪦. The CRM cross-check is still pending, which
    // the reader is entitled to know before weighing a single reported case.
    value: "₪5,500",
    label:
      "הכנסה שנרשמה אצל לקוח אחד, בין מפגש 3 למפגש 4. הצלבה מול CRM טרם הושלמה. n=1",
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
