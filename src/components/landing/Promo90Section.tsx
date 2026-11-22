import { trackCtaClick } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/contact";
import { isPromo90Live, promo90 } from "@/data/promo90";
import SectionHead from "./SectionHead";

/**
 * The 90-day accompaniment, for the visitor who arrives from the Black Friday
 * ad (2026-11-22). Everything it says is in `src/data/promo90.ts`, with the
 * source and with what is deliberately left out (instalments, cancellation,
 * refund: not decided).
 *
 * It sits right after the 30-day proposal, as a second sheet, so the ₪12,000
 * it is compared with can be read off the ₪4,000 just above it. The CTA is
 * WhatsApp, the same door the ad opens.
 *
 * Gone after 30.11 at midnight without anyone touching it: see
 * `isPromo90Live`.
 */
const Promo90Section = () => {
  if (!isPromo90Live()) return null;

  return (
    <section
      id="offer-90"
      dir="rtl"
      aria-labelledby="offer-90-title"
      className="ld-section ld-desk scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <SectionHead label={promo90.occasion} />
          <h2 id="offer-90-title" className="cor-title mt-4 text-foreground">
            {promo90.name}
            <span className="cor-point">.</span>
          </h2>
          <p className="cor-body-lg mt-5 text-foreground">
            {promo90.meetings}. מתחילים מאנשים שכבר נעזרו בכם, ומגיעים להצעת
            שירות אחת עם מחיר, שמציעים ללקוחות.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12">
          {promo90.steps.map((s, i) => (
            <li key={s.title} className="ld-plain p-6">
              <p className="text-xs font-bold text-muted-foreground">{i + 1}</p>
              <h3 className="mt-2 font-heading text-xl font-black leading-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 leading-relaxed text-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="ld-sheet mt-8 p-6 sm:p-10 md:mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-foreground/15 pb-4">
            <h3 className="font-heading text-xl font-black text-foreground sm:text-2xl">
              {promo90.sheetTitle}
            </h3>
            <p className="text-xs font-bold text-muted-foreground">ארז טל-שיר</p>
          </div>

          <div className="mt-6 grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:gap-14">
            <div>
              <ul className="space-y-3 text-foreground">
                <li className="ld-line">
                  <span>{promo90.meetings}</span>
                  <span className="ld-line__leader" aria-hidden="true" />
                  <span className="text-sm text-muted-foreground">כלול</span>
                </li>
                <li className="ld-line">
                  <span>{promo90.compareBasis}</span>
                  <span className="ld-line__leader" aria-hidden="true" />
                  <s className="cor-price text-sm text-muted-foreground">
                    {promo90.compareLabel}
                  </s>
                </li>
              </ul>

              <div className="mt-8 flex items-end justify-between gap-4 border-t-2 border-foreground pt-4">
                <span className="font-bold text-foreground">סה״כ</span>
                <span className="text-end">
                  <span className="ld-price">{promo90.priceLabel}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {promo90.priceNote}, {promo90.deadline}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:pt-1">
              <a
                href={whatsappUrl("he", "offer90")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick("whatsapp_offer90")}
                className="ld-cta w-full"
              >
                {promo90.cta}
                <span className="sr-only"> (נפתח בוואטסאפ)</span>
              </a>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {promo90.ctaNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promo90Section;
