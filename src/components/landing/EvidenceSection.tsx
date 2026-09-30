import EvidenceTag from "@/components/EvidenceTag";
import { claims } from "@/data/claims";
import { EVIDENCE_MEANING } from "@/lib/evidence";
import { preRegistration as pre } from "@/data/preRegistration";

const ROWS = [pre.window, pre.measures, pre.cohort, pre.reporting] as const;

/**
 * What has been checked, what has not, and the commitment to find out, on the
 * landing page.
 *
 * The rebuild moved ClaimsShelf and PreRegistration to /protocol. The
 * operator's site brief names the pre-registration as the one asset the site
 * can publish without asking anyone for anything, and the
 * one a competitor cannot copy without taking the same exposure; it also
 * requires the structural claim and the business caveat to appear together or
 * not at all. So both return here, in the page's own layout and without the
 * scroll reveal (the landing page hydrates, and a reveal that renders
 * differently under prerender would not). /protocol keeps its fuller versions.
 *
 * Nothing is softened: the failure threshold is shown whole, at full weight.
 */
const EvidenceSection = () => (
  <section
    id="evidence"
    dir="rtl"
    aria-labelledby="evidence-title"
    className="ld-section border-t border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <div className="max-w-2xl">
        <p className="cor-overline-he">מה נבדק, ומה עוד לא</p>
        <h2 id="evidence-title" className="cor-title mt-4 text-foreground">
          מה התחייבתי למדוד, לפני שאני יודע את התוצאה.
        </h2>
        <p className="cor-body-lg mt-5 text-foreground/80">
          זה כאן כדי שבעוד שנה תוכלי לבדוק אם מה שכתוב בעמוד הזה החזיק. זו
          התחייבות לפרסם מה קרה, כולל המקרה שבו השיטה לא עבדה, והיא אינה הוכחה
          שהיא עובדת.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {claims.map((c) => (
          <div key={c.id} className="ld-sheet flex flex-col p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-[0.08em] text-muted-foreground">
                {c.label}
              </p>
              <EvidenceTag level={c.level} />
            </div>
            <p className="mt-3 leading-relaxed text-foreground">{c.statement}</p>
            <p className="mt-auto border-t border-border pt-4 text-sm leading-relaxed text-foreground/70">
              {c.entitlement}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {EVIDENCE_MEANING[c.level]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <dl className="divide-y divide-border border-y border-border">
          {ROWS.map((row) => (
            <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-xs font-bold tracking-[0.08em] text-primary">
                {row.label}
              </dt>
              <dd className="leading-relaxed text-foreground/85">
                {"items" in row ? (
                  <ul className="space-y-1">
                    {row.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        {/* The threshold stands apart at full weight: the one line a reader
            would most want softened, and the only one that costs anything to
            say. */}
        <div className="ld-sheet self-start border-s-4 border-s-accent p-6 sm:p-7">
          <p className="text-xs font-bold tracking-[0.08em] text-accent">
            {pre.failureThreshold.label}
          </p>
          <p className="mt-3 font-heading text-xl font-black leading-snug text-foreground">
            {pre.failureThreshold.value}
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default EvidenceSection;
