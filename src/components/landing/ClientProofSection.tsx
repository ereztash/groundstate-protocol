import { Reveal } from "./Reveal";
import VideoTestimonial from "./VideoTestimonial";
import { testimonials } from "@/lib/clients";

/**
 * Client testimonial section. Testimonial data lives in the shared source of
 * truth at @/lib/clients (approved for site-wide use), so the landing and the
 * rest of the site stay in sync from one consented list.
 *
 * Research basis: testimonials with name + title + specific outcome convert
 * significantly better than anonymous quotes.
 */

const ClientProofSection = () => {
  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="client-proof-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="space-y-10">
          <div>
            <p className="cor-overline-he">
              עדויות
            </p>
            {/* Was "חודש אחד. תהליך מובנה. עסקה של ₪5,500." A headline that put
                the process next to a revenue figure, with no n and no source, so
                it read as a causal claim the evidence does not carry. The figure
                still appears, framed, in the hero and on /protocol. This heading
                now says what the section actually holds. */}
            <h2
              id="client-proof-title"
              className="cor-title mt-2 text-foreground"
            >
              מה אמרו שלושה אנשים שעבדו איתי.
            </h2>
          </div>

          {/* Aggregate, verifiable proof layer. Northwestern/Spiegel Research
              Center: showing aggregate proof lifts conversion, and the effect
              grows with price/perceived risk — so a higher-ticket 1:1 offer
              benefits most. NN/g lists "connected to the rest of the web"
              (third-party validation) as one of four core credibility factors.
              The numbers here are real and deliberately NOT inflated: 22
              sessions delivered to date, and every testimonial is attributable
              (full name + LinkedIn), which is what separates trusted proof from
              anonymous praise that visitors discount. */}
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-border/80 py-4">
            <div className="flex items-baseline gap-2">
              <dt className="sr-only">פגישות שבוצעו עד כה</dt>
              <dd className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  22
                </span>
                <span className="text-sm text-muted-foreground">
                  פגישות בוצעו עד כה
                </span>
              </dd>
            </div>
            <span aria-hidden="true" className="hidden text-border sm:inline">
              •
            </span>
            <div className="flex items-baseline gap-2">
              <dt className="sr-only">אמינות העדויות</dt>
              <dd className="text-sm text-muted-foreground">
                כל העדויות בשם מלא ובקישור ללינקדאין, ניתנות לאימות.
              </dd>
            </div>
          </dl>

          <VideoTestimonial />

          {testimonials.map((t, i) => (
            <figure key={i} className="space-y-5 border-t border-border pt-10">
              <blockquote className="pull-quote pr-8 md:pr-10">
                <p>{t.quote}</p>
              </blockquote>

              <figcaption className="flex items-start gap-3 border-t border-border pt-5">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.04] ring-1 ring-border text-sm font-semibold text-foreground/70"
                  >
                    {t.initials || "·"}
                  </span>
                )}
                <div className="space-y-0.5">
                  {t.linkedin ? (
                    <a
                      href={t.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {t.attribution}
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-3.5 w-3.5 fill-current text-primary/70"
                      >
                        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                      </svg>
                      <span className="sr-only">(נפתח בלינקדאין)</span>
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-foreground">
                      {t.attribution}
                    </p>
                  )}
                  {t.outcome && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {t.outcome}
                    </p>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
};

export default ClientProofSection;
