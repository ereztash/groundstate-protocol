import { Link } from "react-router-dom";
import { testimonials, type Testimonial } from "@/lib/clients";
import VideoTestimonial from "./VideoTestimonial";
import FullQuote from "./FullQuote";
import SectionHead from "./SectionHead";

/**
 * Four people who worked with Erez, in their own words.
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
      <FullQuote quote={t.quote} more="להמלצה המלאה" less="לסגור" />
    </>
  ) : (
    <p className="leading-relaxed text-foreground">{t.quote}</p>
  );

  return (
    <figure className="ld-plain ld-edge flex flex-col p-6 sm:p-7">
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
      <SectionHead label="המלצות" />
      <h2 id="proof-title" className="cor-title mt-4 max-w-2xl text-foreground">
        מה אמרו ארבעה אנשים שעבדו איתי.
      </h2>

      <div className="mt-12 grid gap-6 lg:gap-8">
        <div className="ld-plain ld-edge p-6 sm:p-8 lg:px-12">
          <VideoTestimonial />
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((t) => (
            <QuoteCard key={t.attribution} t={t} />
          ))}
        </div>
      </div>

      <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
        מה אני יודע ומה עוד לא,{" "}
        <Link to="/protocol#evidence" className="ld-link">
          בעמוד הפרוטוקול
        </Link>
      </p>
    </div>
  </section>
);

export default ProofSection;
