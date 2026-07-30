/**
 * Quantified proof band. High-ticket, trust-based purchases convert on
 * undeniable numbers (Spiegel: aggregate proof lift grows with price/risk).
 *
 * Every figure here is graph-verified and marketing-safe:
 * - the value:fee ratio is the ×5–7.5 across the four clients with a closed,
 *   measured value_realized (framed honestly as "clients who completed the
 *   sprint");
 * - the ₪5,500 deal is already public on the landing.
 * Deliberately excluded: the "~10% of 86 meetings" figure the graph forbids in
 * marketing until there's a conversion log, and any client name.
 */

const STATS: { value: string; label: string }[] = [
  {
    value: "×5–7.5",
    // n stated explicitly. This file's own closing line commits to "מעט
    // ומאומת", and a range with no n doesn't meet that standard — while
    // ClientProofSection already discloses its n ("22 פגישות בוצעו עד כה").
    label: "הערך שנפתח ביחס למחיר — אצל 4 הלקוחות שהשלימו את הרצף עם ערך מדיד",
  },
  {
    value: "₪5,500",
    label: "עסקה ראשונה שנסגרה אחרי שלב 4, מתוך 10 הפניות שיצאו בליווי",
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
            <dt className="text-3xl font-bold tracking-tight text-accent md:text-4xl">
              {s.value}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-foreground/80">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        מבוסס על הלקוחות שהשלימו את הרצף עם ערך מדיד. אני מעדיף לספר מעט ומאומת,
        מאשר הרבה ולא בדוק.
      </p>
    </div>
  );
};

export default QuantifiedProof;
