import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { CALENDLY_URL } from "@/lib/calendly";
import { Link, useHref } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionHead from "@/components/landing/SectionHead";
import FullQuote from "@/components/landing/FullQuote";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { CorSeal } from "@/components/brand/CorMark";
import { LinkedInIcon, WhatsAppIcon } from "@/components/brand/SocialIcons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useHomeLanguage } from "@/hooks/useHomeLanguage";
import { trackCtaClick } from "@/lib/analytics";
import { testimonials, videoTestimonial } from "@/lib/clients";
import { LINKEDIN_FOLLOWERS, LINKEDIN_URL, WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/contact";
import {
  PRICE,
  book,
  day31,
  faqEn,
  fit,
  hero,
  meta,
  offer,
  proof,
  testimonialsEn,
  why,
} from "@/data/en/landing";

const portrait = `${import.meta.env.BASE_URL}portrait.webp`;

/**
 * public/ files, from one level down. The CI and e2e build use a relative base,
 * so BASE_URL is "./" and "./portrait.webp" would resolve against /en/ (404);
 * the deploy build's absolute base is unaffected. Resolve "./" against the
 * router's root instead, which is right in both.
 */
function usePublicUrl() {
  const root = useHref("/").replace(/\/?$/, "/");
  return (url: string) => (url.startsWith("./") ? root + url.slice(2) : url);
}

// The Calendly embed is several hundred kB; as on the Hebrew page, it loads
// only as its section approaches the viewport.
const BookingSection = lazy(() => import("@/components/landing/BookingSection"));

/**
 * The home page in English, for English speakers in Israel (Erez, 2026-10-01:
 * the home page only; every other page stays Hebrew and says so where it is
 * linked). Same offer, same price in shekels, same calendar; the copy and its
 * rules live in src/data/en/landing.ts.
 *
 * It follows the Hebrew page section for section, on the same paper and with
 * the same components where they take a language, so a change to the Hebrew
 * page's layout shows up here as a difference to carry over, not as a second
 * design. What it leaves out: the "call me back" form (Hebrew, and it emails
 * Erez in Hebrew) and the video testimonial (Hebrew audio). WhatsApp covers
 * the first; the video's words appear as a translated quote.
 *
 * Every CTA is a plain link to #book on this page.
 */
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const onCta = (name: string) => () => trackCtaClick(name);

function Hero() {
  const pub = usePublicUrl();
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative pt-24 pb-14 md:pt-32 md:pb-20">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <div>
          <p className="cor-overline-he !text-base">{hero.overline}</p>
          <h1 id="hero-title" className="cor-display mt-5 text-foreground">
            {hero.title}
            <span className="cor-point">.</span>
          </h1>
          <p className="cor-body-lg mt-6 max-w-xl font-medium text-foreground">{hero.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#book"
              onClick={onCta("en_hero_book")}
              aria-describedby="hero-cta-note"
              className="ld-cta w-full shrink-0 sm:w-auto sm:whitespace-nowrap"
            >
              {hero.cta}
            </a>
            <p id="hero-cta-note" className="text-sm text-muted-foreground">
              {hero.ctaNote}{" "}
              <a href={whatsappUrl("en")} {...ext} onClick={onCta("whatsapp_en_hero")} className="ld-link">
                {hero.ctaNoteWhatsapp}
                <span className="sr-only"> (opens WhatsApp)</span>
              </a>
              .
            </p>
          </div>

          <dl className="mt-9 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-foreground/15 pt-5 text-sm">
            {/* English runs longer than the Hebrew here, so the terms wrap
                as whole phrases rather than breaking inside one. */}
            <div className="flex flex-wrap items-baseline gap-x-2">
              <dt className="whitespace-nowrap text-muted-foreground">{hero.priceTerm}</dt>
              <dd className="cor-price font-heading text-2xl font-black text-foreground">{PRICE.label}</dd>
              <dd className="whitespace-nowrap text-muted-foreground">{PRICE.installments}</dd>
              <dd className="whitespace-nowrap text-muted-foreground">{PRICE.vat}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">{hero.meetingsTerm}</dt>
              <dd className="font-bold text-foreground">{hero.meetingsValue}</dd>
            </div>
          </dl>
        </div>

        <div role="group" aria-label="Guarantee and testimonial" className="ld-sheet grid gap-6 p-6 sm:p-7 md:mt-10">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-primary">{hero.guaranteeLabel}</p>
            <p className="mt-2 leading-relaxed text-foreground">
              {hero.guarantee}{" "}
              <a href="#price" className="ld-link">{hero.guaranteeLink}</a>
            </p>
          </div>

          <figure className="border-t border-border pt-5">
            <blockquote className="text-lg font-medium leading-snug text-foreground">
              &ldquo;{hero.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-sm text-muted-foreground">
              <a
                href={videoTestimonial.linkedin}
                {...ext}
                className="font-bold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-primary"
              >
                {testimonialsEn[videoTestimonial.attribution].name}
                <span className="sr-only">{proof.opensLinkedIn}</span>
              </a>
              {", "}
              {hero.translated}
            </figcaption>
          </figure>

          <div className="flex items-center gap-3 border-t border-border pt-5">
            <img
              src={pub(portrait)}
              alt={hero.portraitAlt}
              width={64}
              height={64}
              loading="eager"
              decoding="async"
              className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
            />
            <div className="text-sm leading-snug">
              <p className="font-bold text-foreground">{hero.name}</p>
              <p className="text-muted-foreground">{hero.role}</p>
              <a
                href={LINKEDIN_URL}
                {...ext}
                onClick={onCta("linkedin_en_hero")}
                className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-primary"
              >
                <LinkedInIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
                {LINKEDIN_FOLLOWERS.en}
                <span className="sr-only">{proof.opensLinkedIn}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section aria-labelledby="why-title" className="ld-section border-t border-foreground/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHead label={why.label} />
        <h2 id="why-title" className="cor-title mt-4 max-w-2xl text-foreground">{why.title}</h2>
        <p className="cor-body-lg mt-5 max-w-2xl text-foreground">{why.trigger}</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {why.notes.map(([before, strong, after], i) => (
            <li key={strong} className="ld-draft px-5 py-5" style={{ "--tilt": i % 2 ? "-0.5deg" : "0.5deg" } as CSSProperties}>
              <span className="font-heading text-sm font-black text-accent" aria-hidden="true">{i + 1}.</span>
              <p className="mt-2 leading-relaxed text-foreground">
                {before}
                <strong className="font-bold text-foreground">{strong}</strong>
                {after}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section id="offer" aria-labelledby="offer-title" className="ld-section ld-desk">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <SectionHead label={offer.label} />
          <h2 id="offer-title" className="cor-title mt-4 text-foreground">{offer.title}</h2>
          <p className="cor-body-lg mt-5 text-foreground">{offer.intro}</p>
        </div>

        <p className="mt-10 text-sm text-muted-foreground md:hidden" aria-hidden="true">{offer.swipe}</p>
        <ol tabIndex={0} aria-label="The four weeks" className="relative -mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {offer.stages.map((s, i) => (
            <li key={s.name} className="ld-plain flex w-[84%] shrink-0 snap-center flex-col p-6 sm:w-[70%] sm:p-7 md:w-auto">
              <p className="text-xs font-bold text-muted-foreground">
                {offer.week} {i + 1}, {s.name}
              </p>
              <h3 className="mt-4 font-heading text-2xl font-black leading-tight text-foreground">
                <span className="sr-only">{offer.week} {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-2 leading-relaxed text-foreground">{s.deliverable}</p>
            </li>
          ))}
        </ol>

        <div id="price" className="ld-sheet ld-stack mt-8 p-6 sm:p-10 md:mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-foreground/15 pb-4">
            <h3 className="font-heading text-xl font-black text-foreground sm:text-2xl">{offer.proposal}</h3>
            <p className="text-xs font-bold text-muted-foreground">{hero.name}</p>
          </div>

          <div className="mt-6 grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:gap-14">
            <div>
              <ul className="space-y-3 text-foreground">
                {offer.lineItems.map((item) => (
                  <li key={item} className="ld-line">
                    <span>{item}</span>
                    <span className="ld-line__leader" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground">{offer.included}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-end justify-between gap-4 border-t-2 border-foreground pt-4">
                <span className="font-bold text-foreground">{offer.total}</span>
                <span className="text-end">
                  <span className="ld-price">{PRICE.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{PRICE.installments}</span>
                  <span className="block text-sm text-muted-foreground">The price is {PRICE.vat}</span>
                </span>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{offer.spots}</p>
            </div>
            <div className="flex flex-col gap-4 md:pt-1">
              <a href="#book" onClick={onCta("en_offer_book")} className="ld-cta w-full">{offer.cta}</a>
              <p className="text-sm leading-relaxed text-muted-foreground">{offer.ctaNote}</p>
            </div>
          </div>

          <div className="mt-10 border-t border-foreground/15 pt-8">
            <p className="text-xs font-bold tracking-[0.08em] text-primary">{offer.clauseLabel}</p>
            <p className="mt-2 text-lg font-bold leading-snug text-foreground sm:text-xl">{offer.clause}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="border-s-2 border-primary/40 ps-4">
                <p className="text-xs font-bold tracking-[0.08em] text-primary">{offer.countsLabel}</p>
                <ul className="mt-2 space-y-1.5">
                  {offer.counts.map((c) => (
                    <li key={c} className="text-sm leading-relaxed text-foreground">{c}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">{offer.countsNote}</p>
              </div>
              <div className="border-s-2 border-border ps-4">
                <p className="text-xs font-bold tracking-[0.08em] text-muted-foreground">{offer.notGuaranteedLabel}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{offer.notGuaranteed}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-end justify-end">
            <CorSeal id="cor-seal-offer-en" className="cor-seal relative z-10 -me-6 h-24 w-24 shrink-0 sm:h-28 sm:w-28" />
            <div className="ld-sign w-56 text-center">
              <span className="font-heading text-lg font-bold text-foreground">{hero.name}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Day31() {
  return (
    <section aria-labelledby="day-31-title" className="ld-section ld-band-sheet border-y border-foreground/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
          <div>
            <SectionHead label={day31.label} />
            <h2 id="day-31-title" className="mt-4 font-heading text-[3.25rem] font-black leading-none tracking-tight sm:text-[5rem]">
              {day31.title}
              <span className="cor-point">.</span>
            </h2>
          </div>
          <div className="max-w-2xl space-y-6 text-2xl leading-[1.5]">
            {day31.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <p className="border-t border-border pt-6 font-sans text-sm leading-relaxed text-muted-foreground">{day31.caveat}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Proof() {
  const pub = usePublicUrl();
  const cards = [
    { he: videoTestimonial.attribution, linkedin: videoTestimonial.linkedin, photo: undefined as string | undefined },
    ...testimonials.map((t) => ({ he: t.attribution, linkedin: t.linkedin, photo: t.photo })),
  ];
  return (
    <section id="proof" aria-labelledby="proof-title" className="ld-section">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHead label={proof.label} />
        <h2 id="proof-title" className="cor-title mt-4 max-w-2xl text-foreground">{proof.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{proof.translated}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {cards.map((c) => {
            const t = testimonialsEn[c.he];
            return (
              <figure key={c.he} className="ld-plain ld-edge flex flex-col p-6 sm:p-7">
                <blockquote>
                  {t.pullQuote ? (
                    <>
                      <p className="font-heading text-xl font-bold leading-snug text-foreground">&ldquo;{t.pullQuote}&rdquo;</p>
                      <FullQuote quote={t.quote} more={proof.more} less={proof.less} />
                    </>
                  ) : (
                    <p className="leading-relaxed text-foreground">{t.quote}</p>
                  )}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-5">
                  {c.photo ? (
                    <img src={pub(c.photo)} alt="" width={44} height={44} loading="lazy" decoding="async" className="h-11 w-11 shrink-0 rounded-full border border-border object-cover" />
                  ) : null}
                  <div className="text-sm leading-snug">
                    <a href={c.linkedin} {...ext} className="font-bold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-primary">
                      {t.name}
                      <span className="sr-only">{proof.opensLinkedIn}</span>
                    </a>
                    {t.outcome && <span className="block text-muted-foreground">{t.outcome}</span>}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
          {proof.evidence}{" "}
          <Link to="/protocol#evidence" hrefLang="he" className="ld-link">{proof.evidenceLink}</Link>
        </p>
      </div>
    </section>
  );
}

function Fit() {
  const pub = usePublicUrl();
  return (
    <section id="fit" aria-labelledby="fit-title" className="ld-section border-t border-foreground/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHead label={fit.label} />
        <h2 id="fit-title" className="cor-title mt-4 max-w-2xl text-foreground">{fit.title}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="ld-sheet p-6 sm:p-8">
            <h3 className="font-heading text-xl font-black text-foreground">{fit.forTitle}</h3>
            <ul className="mt-5 space-y-4">
              {fit.for.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-foreground">
                  <svg viewBox="0 0 28 20" aria-hidden="true" className="mt-1.5 h-3.5 w-5 shrink-0">
                    <path className="ld-mark" d="M2 11 L10 18 L26 2" />
                  </svg>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ld-draft p-6 sm:p-8">
            <h3 className="font-heading text-xl font-black text-foreground">{fit.notForTitle}</h3>
            <ul className="mt-5 space-y-4">
              {fit.notFor.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-muted-foreground">
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1.5 h-3.5 w-3.5 shrink-0">
                    <path className="ld-mark" d="M3 3 L17 17 M17 3 L3 17" />
                  </svg>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-12">
          <img src={pub(portrait)} alt={hero.name} width={200} height={200} loading="lazy" decoding="async" className="h-36 w-36 rounded-full border border-border object-cover sm:h-44 sm:w-44" />
          <div className="max-w-2xl">
            <p className="cor-overline-he">{fit.whoLabel}</p>
            <p className="mt-4 font-heading text-2xl font-black leading-snug text-foreground sm:text-3xl">{fit.whoTitle}</p>
            <p className="cor-body-lg mt-4 text-foreground">{fit.whoBody}</p>
            <Link to="/about" hrefLang="he" className="ld-link mt-4 inline-block">{fit.whoLink}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="ld-section border-t border-foreground/10">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHead label={faqEn.label} />
        <h2 id="faq-title" className="cor-title mt-4 max-w-2xl text-foreground">{faqEn.title}</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="space-y-8">
            {faqEn.surfaced.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-heading text-xl font-black leading-snug text-foreground">{q}</h3>
                <p className="mt-3 leading-relaxed text-foreground">{a}</p>
              </div>
            ))}
          </div>
          <Accordion type="single" collapsible className="w-full border-t border-border">
            {[...faqEn.rest, { q: "What if it doesn't work?", a: "I refund the payment in full. The exact terms are in the proposal, under the price." }].map(({ q, a }, i) => (
              <AccordionItem key={q} value={`item-${i}`} className="border-b border-border">
                <AccordionTrigger className="gap-4 py-5 text-start text-base font-bold text-foreground hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="pb-5 pt-1 leading-relaxed text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function CalendarPlaceholder() {
  return (
    <div className="flex h-[700px] flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-border px-6 text-center">
      <p className="text-muted-foreground">{book.loading}</p>
      <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="ld-link">
        {book.openCalendar}
      </a>
    </div>
  );
}

function Book() {
  const [near, setNear] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="book" aria-labelledby="book-title" className="ld-section ld-desk scroll-mt-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <SectionHead label={book.label} />
          <h2 id="book-title" className="cor-title mt-4 text-foreground">{book.title}</h2>
        </div>
        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="font-heading text-lg font-black text-foreground">{book.stepsTitle}</p>
            <ol className="mt-5 space-y-5 border-s border-foreground/15 ps-5">
              {book.steps.map((step, i) => (
                <li key={step}>
                  <p className="text-xs font-bold tracking-[0.08em] text-muted-foreground">{book.stop} {i + 1}</p>
                  <p className="mt-1 leading-relaxed text-foreground">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-8 ld-plain p-5">
              <p className="text-xs font-bold tracking-[0.08em] text-primary">{book.questionLabel}</p>
              <p className="mt-2 text-lg font-bold leading-snug text-foreground">{book.question}</p>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">{offer.spots}</p>
          </div>
          <div ref={anchor} className="order-1 lg:order-2">
            <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-foreground" />
              {book.whatsappLead}
              <a href={whatsappUrl("en")} {...ext} onClick={onCta("whatsapp_en_book")} className="ld-link">
                WhatsApp {WHATSAPP_DISPLAY}
                <span className="sr-only"> (opens WhatsApp)</span>
              </a>
            </p>
            {near ? (
              <Suspense fallback={<CalendarPlaceholder />}>
                <BookingSection visible surface="book_section_en" lang="en" />
              </Suspense>
            ) : (
              <CalendarPlaceholder />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const LandingEn = () => {
  useDocumentMeta({ title: meta.title, description: meta.description, path: "/en" });
  useHomeLanguage("en");

  return (
    <div data-page="landing-en" dir="ltr" lang="en" className="ld-paper min-h-screen overflow-x-hidden text-foreground">
      <SiteHeader lang="en" />
      <main>
        <Hero />
        <Why />
        <Offer />
        <Day31 />
        <Proof />
        <Fit />
        <Faq />
        <Book />
      </main>
      <SiteFooter lang="en" />
      <StickyMobileCTA lang="en" />
    </div>
  );
};

export default LandingEn;
