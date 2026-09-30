import { testimonials, type Testimonial } from "@/lib/clients";
import VideoTestimonial from "./VideoTestimonial";
import SectionHead from "./SectionHead";

/**
 * Three people who worked with Erez, in their own words.
 *
 * Every sentence comes from src/lib/clients.ts and is rendered verbatim; the
 * long one opens on its verbatim pull quote and expands to the full text, as
 * the pull-quote rule in that file requires. Names link to LinkedIn so a
 * reader can check that the person exists, which is the only kind of proof a
 * testimonial can carry.
 */
function QuoteCard({ t }: { t: Testimonial }) {
  const body = t.pullQuote ? (
    <>
      <p className="font-heading text-xl font-bold leading-snug text-foreground">
        ״{t.pullQuote}״
      </p>
      <details className="group mt-3">
        <summary className="ld-link cursor-pointer list-none text-sm">
          <span className="group-open:hidden">להמלצה המלאה</span>
          <span className="hidden group-open:inline">לסגור</span>
        </summary>
        <p className="mt-3 leading-relaxed text-foreground/80">{t.quote}</p>
      </details>
    </>
  ) : (
    <p className="leading-relaxed text-foreground/85">{t.quote}</p>
  );

  return (
    <figure className="ld-sheet flex flex-col p-6 sm:p-7">
      <blockquote>{body}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5">
        {t.photo ? (
          <img
            src={t.photo}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
            className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
          />
        ) : null}
        <div className="text-sm leading-snug">
          {t.linkedin ? (
            <a
              href={t.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-primary"
            >
              {t.attribution}
              <span className="sr-only"> (נפתח בלינקדאין)</span>
            </a>
          ) : (
            <span className="font-bold text-foreground">{t.attribution}</span>
          )}
          {t.outcome && (
            <span className="block text-muted-foreground">{t.outcome}</span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

const ProofSection = () => (
  <section
    id="proof"
    dir="rtl"
    aria-labelledby="proof-title"
    className="ld-section"
  >
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <SectionHead n="04" label="בלשונם" />
      <h2 id="proof-title" className="cor-title mt-4 max-w-2xl text-foreground">
        מה אמרו שלושה אנשים שעבדו איתי.
      </h2>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="ld-sheet p-6 sm:p-8">
          <VideoTestimonial />
        </div>
        <div className="grid gap-6">
          {testimonials.map((t) => (
            <QuoteCard key={t.attribution} t={t} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProofSection;
