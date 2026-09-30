import EvidenceTag from "@/components/EvidenceTag";
import { claims } from "@/data/claims";
import { EVIDENCE_MEANING } from "@/lib/evidence";
import { preRegistration as pre } from "@/data/preRegistration";
import SectionHead from "./SectionHead";

const ROWS = [pre.window, pre.measures, pre.cohort, pre.reporting] as const;

/**
 * The two figures the composition sets large, read out of the data rather than
 * re-typed: the threshold percentage and the end of the measurement window.
 * If either sentence is reworded so the pattern no longer matches, the large
 * figure simply does not render and the sentence still does.
 */
const THRESHOLD = pre.failureThreshold.value.match(/\d+%/)?.[0] ?? null;
const WINDOW_END = pre.window.value.match(/\d{2}\/\d{4}/)?.[0] ?? null;

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
 *
 * A structure-teal grid on the sheet (2026-09-30): the brand's diagnostic
 * screen, for the one section that is a measurement record. It was charcoal
 * until the 30.9 pilot (see Day31Section). The threshold
 * figure is the section's copper, because it is the line that costs something
 * to say.
 */
const EvidenceSection = () => (
  <section
    id="evidence"
    dir="rtl"
    aria-labelledby="evidence-title"
    className="ld-section ld-band-sheet cor-blueprint border-y border-foreground/10"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <div className="max-w-2xl">
        <SectionHead n="05" label="מה נבדק, ומה עוד לא" />
        <h2 id="evidence-title" className="cor-title mt-4 text-foreground">
          מה התחייבתי למדוד, לפני שאני יודע את התוצאה.
        </h2>
        <p className="cor-body-lg mt-5 text-foreground">
          זה כאן כדי שבעוד שנה תוכלו לבדוק אם מה שכתוב בעמוד הזה החזיק. זו
          התחייבות לפרסם מה קרה, כולל המקרה שבו השיטה לא עבדה, והיא אינה הוכחה
          שהיא עובדת.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {claims.map((c) => (
          <div key={c.id} className="flex flex-col border border-border bg-card/85 p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-[0.08em] text-muted-foreground">
                {c.label}
              </p>
              <EvidenceTag level={c.level} />
            </div>
            <p className="mt-3 leading-relaxed text-foreground">{c.statement}</p>
            <p className="mt-auto border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
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
              <dd className="leading-relaxed text-foreground">
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
        <div className="relative self-start border border-border border-s-4 border-s-signal bg-card p-6 pt-8 sm:p-7 sm:pt-9">
          {WINDOW_END && (
            <span className="ld-stamp absolute -top-5 end-5 bg-card text-xs" aria-hidden="true">
              <span>נרשם מראש</span>
              <span className="font-heading text-sm">עד {WINDOW_END}</span>
            </span>
          )}
          <p className="text-xs font-bold tracking-[0.08em] text-accent">
            {pre.failureThreshold.label}
          </p>
          {THRESHOLD && (
            <p
              className="mt-2 font-heading text-[3.25rem] font-black leading-none text-signal"
              aria-hidden="true"
            >
              <span dir="ltr">{THRESHOLD}</span>
            </p>
          )}
          <p className="mt-3 text-xl font-bold leading-snug text-foreground">
            {pre.failureThreshold.value}
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default EvidenceSection;
