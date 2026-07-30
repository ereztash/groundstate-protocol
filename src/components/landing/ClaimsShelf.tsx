import { Reveal } from "./Reveal";
import EvidenceTag from "@/components/EvidenceTag";
import { claims } from "@/data/claims";

/**
 * The two claims, side by side, with what each one entitles a reader to
 * conclude.
 *
 * The site had no place for the claim that is actually anchored. It argued the
 * method from its outputs and its process, and left the structural finding
 * unsaid, so the only thing a reader could weigh was the business claim, which
 * is the one not yet earned.
 *
 * Rendering both together is a requirement rather than a layout choice. Shown
 * alone, the structural claim reads as a promise about revenue, which is the
 * inference it does not support.
 *
 * No corpus size and no percentages here: those wait on the source-integrity
 * gate. What can be published now is the shape of each claim and its level.
 */
const ClaimsShelf = () => {
  return (
    <section
      id="claims"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="claims-title"
    >
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="mx-auto max-w-2xl">
          <p className="cor-overline-he">גבולות המתודה</p>
          <h2 id="claims-title" className="cor-title mt-2 text-foreground">
            מה נבדק, ומה עדיין לא.
          </h2>
          <p className="cor-body-lg mt-4 text-foreground/80">
            שתי טענות נפרדות, בשתי רמות ראיה שונות. הן מוצגות יחד כדי שאף אחת
            מהן לא תיקרא כאילו היא האחרת.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {claims.map((claim) => (
            <Reveal key={claim.id}>
              <article
                aria-label={claim.label}
                className="flex h-full flex-col rounded-xl border border-border bg-card p-6"
              >
                <header className="flex items-center justify-between gap-3 border-b border-border pb-3">
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground">
                    {claim.label}
                  </span>
                  <EvidenceTag level={claim.level} />
                </header>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                  {claim.statement}
                </p>

                <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-foreground/70">
                  {claim.entitlement}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClaimsShelf;
