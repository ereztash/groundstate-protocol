import { Reveal } from "./Reveal";
import EvidenceTag from "@/components/EvidenceTag";
import {
  CHAIN_COLUMNS,
  CHAIN_COLUMN_LABEL,
  publishableCases,
  type CaseRecord,
} from "@/lib/caseChain";

/**
 * One client case as a five-column causal chain: what was said, what was
 * identified, what was created, what was done, what happened.
 *
 * Renders nothing at all when no case passes both publication gates (consent
 * granted, source integrity confirmed). That is the expected state today: the
 * machinery is here so that granting consent is a data change rather than a
 * code change, and so a case can never appear by accident.
 *
 * Every cell carries its own evidence tag. The caveats render as body text
 * beside the chain, not as a footnote below the fold: a reader who sees the
 * outcome and not the "n=1" beside it has been shown a stronger claim than the
 * evidence supports.
 *
 * On a case that did not convert, the rule recorded before the outcome was
 * known renders above the chain, because that is the whole reason such a case
 * is worth publishing.
 */

const OutcomeBadge = ({ outcome }: { outcome: CaseRecord["outcome"] }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
      outcome === "converted"
        ? "border-primary/40 bg-primary/[0.07] text-primary"
        : "border-border bg-foreground/[0.05] text-muted-foreground"
    }`}
  >
    {outcome === "converted" ? "המיר" : "לא המיר"}
  </span>
);

const CaseChain = ({ record }: { record: CaseRecord }) => {
  const byColumn = new Map(record.chain.map((c) => [c.column, c]));

  return (
    <article
      aria-label={`שרשרת ראיה, מקרה ${record.id}`}
      className="rounded-xl border border-border bg-card p-6 md:p-8"
    >
      <header className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground">
          {record.subject_label}
        </span>
        <OutcomeBadge outcome={record.outcome} />
      </header>

      {record.pre_registered_rule && (
        <div className="mt-5 border-s-2 border-primary/40 ps-4">
          <p className="text-[11px] font-semibold tracking-wide text-primary">
            הכלל שנרשם לפני שהתוצאה היתה ידועה
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/85">
            {record.pre_registered_rule}
          </p>
        </div>
      )}

      {/* Five columns on desktop, a vertical sequence on a phone. Each cell is
          a list item so the order survives being read aloud. */}
      <ol className="mt-6 grid gap-5 md:grid-cols-5 md:gap-4">
        {CHAIN_COLUMNS.map((col, i) => {
          const cell = byColumn.get(col);
          if (!cell) return null;
          return (
            <li key={col} className="flex flex-col">
              <div className="flex items-baseline gap-2 border-t border-foreground/80 pt-3">
                <span className="font-mono text-[11px] text-muted-foreground">
                  0{i + 1}
                </span>
                <span className="text-[11px] font-semibold tracking-wide text-foreground">
                  {CHAIN_COLUMN_LABEL[col]}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {cell.text}
              </p>
              <p className="mt-3">
                <EvidenceTag level={cell.evidence_level} />
              </p>
            </li>
          );
        })}
      </ol>

      {record.caveats.length > 0 && (
        <div className="mt-7 border-t border-border pt-5">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
            מה המקרה הזה לא אומר
          </p>
          <ul className="mt-2 space-y-1.5">
            {record.caveats.map((c) => (
              <li
                key={c}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground"
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

const EvidenceChain = () => {
  const cases = publishableCases();
  if (cases.length === 0) return null;

  return (
    <section
      id="evidence-chain"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="evidence-chain-title"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl">
          <p className="cor-overline-he">שרשרת ראיה</p>
          <h2
            id="evidence-chain-title"
            className="cor-title mt-2 text-foreground"
          >
            מה נאמר, מה זוהה, מה נוצר, מה נעשה, מה קרה.
          </h2>
          <p className="cor-body-lg mt-4 text-foreground/80">
            לכל שלב בשרשרת יש תג שאומר על מה הוא נשען: שורת פנקס, דיווח שלי, או
            לא נמדד. התגים מוצגים במלואם, גם כשהם מחלישים את הטענה.
          </p>
        </Reveal>

        <div className="mt-12 space-y-8">
          {cases.map((c) => (
            <Reveal key={c.id}>
              <CaseChain record={c} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EvidenceChain;
