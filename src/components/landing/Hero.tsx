import type { MouseEvent } from "react";
import { trackCtaClick } from "@/lib/analytics";
import { fullPackage, outreachCount } from "@/data/sprint-stages";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import DraftStack from "./DraftStack";

const portrait = `${import.meta.env.BASE_URL}portrait.webp`;

/**
 * The hero, rebuilt 2026-09-29 around one job: get a fitting reader to a dated
 * call with the price already on the table.
 *
 * Three decisions carry it:
 *
 * - Nothing here animates from invisible. The previous hero faded every element
 *   in from opacity 0, and main.tsx re-rendered the prerendered DOM with
 *   createRoot, which restarted the fade after the bundle ran: on a mid-range
 *   phone the headline first painted at ~5.5s. The copy now paints in its final
 *   state from the static HTML; only the decorative DraftStack draws in.
 *
 * - The CTA is a real link to #book. Before hydration it still works, which on
 *   a slow phone is most of the first five seconds. With JS it routes through
 *   the provider so the lead records the hero as its source.
 *
 * - The price is stated here, not thirteen screens down. The first call works
 *   when the person in it has already seen the number; a visitor who leaves on
 *   seeing it was not going to buy after a free call either.
 *
 * The headline is unchanged. It is the strongest sentence on the site and the
 * prerender spec pins it.
 */
const Hero = () => {
  const { requestForm } = useDiagnosticForm();

  const onCta = (e: MouseEvent<HTMLAnchorElement>) => {
    trackCtaClick("hero_book");
    e.preventDefault();
    requestForm("hero");
  };

  return (
    <section
      dir="rtl"
      id="hero"
      aria-labelledby="hero-title"
      className="ld-paper relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <div>
          <p className="cor-overline-he">ליווי עסקי לעצמאים · 30 יום</p>

          <h1 id="hero-title" className="cor-display mt-5 text-foreground">
            עוד גרסה של ״מי אני״. ועוד אחת. אף אחת לא מחזיקה חודש.
          </h1>

          <p
            id="hero-subtitle"
            className="cor-body-lg mt-6 max-w-xl text-foreground/80"
          >
            בארבע פגישות בחודש, מה שאת כבר יודעת הופך לארבעה מסמכים: משפט אחד
            שמחזיק, הצעת ערך, מוצר עם מחיר, ו-{outreachCount} פניות לאנשים ששמם
            ידוע לך.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#book"
              onClick={onCta}
              aria-describedby="hero-cta-note"
              className="ld-cta w-full sm:w-auto"
            >
              לתיאום שיחת התאמה
            </a>
            <p id="hero-cta-note" className="text-sm text-muted-foreground">
              20 דקות, ללא עלות. בוחרים מועד ביומן.
            </p>
          </div>

          {/* Price and shape, stated flat. */}
          <dl className="mt-9 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-foreground/15 pt-5 text-sm">
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">כל התוכנית</dt>
              <dd className="cor-price font-heading text-2xl font-black text-foreground">
                {fullPackage.priceLabel}
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">פגישות</dt>
              <dd className="font-bold text-foreground">4, אחת בשבוע</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">בסוף</dt>
              <dd className="font-bold text-foreground">4 מסמכים שלך</dd>
            </div>
          </dl>

          {/* Byline: who is behind the page, signed the way an author signs. */}
          <div className="mt-7 flex items-center gap-3">
            <img
              src={portrait}
              alt="תמונת פורטרט: גבר במעיל כהה וחולצה לבנה, מבט ישיר למצלמה, רקע ירוק זית."
              width={56}
              height={56}
              loading="eager"
              decoding="async"
              className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
            />
            <p className="text-sm leading-snug">
              <span className="block font-bold text-foreground">ארז טל-שיר</span>
              <span className="text-muted-foreground">
                עובד סוציאלי בהכשרה, יועץ עסקי לעצמאים
              </span>
            </p>
          </div>
        </div>

        <DraftStack />
      </div>
    </section>
  );
};

export default Hero;
