import type { MouseEvent } from "react";
import { trackCtaClick } from "@/lib/analytics";
import { outreachCount, program } from "@/data/sprint-stages";
import { useDiagnosticForm } from "./DiagnosticFormProvider";
import SignalField from "./SignalField";

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
 *   state from the static HTML; only the decorative SignalField settles in.
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
 * prerender spec pins it. Its last full stop is the brand's copper point
 * (cor-brand, «הנקודה»), the same point the field beside it settles on.
 *
 * Charcoal, 2026-09-30: the hero is the first of the page's SYS bands, the
 * surface the brand keeps for diagnosis. The field sits in the page flow on a
 * phone (a band above the text) and bleeds off the left edge from md up,
 * behind the content in the section's own stacking context (`isolate`). On a
 * phone the band sits above the text, not under it: see the note at the field.
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
      className="dark isolate relative overflow-hidden bg-background pt-20 pb-14 text-foreground md:pt-32 md:pb-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <div>
          {/* First in the column on purpose. On a phone the field is a band in
              the flow, and anything below the headline moves when the webfonts
              swap in and the text rewraps: placed under the price it was the
              page's one large layout shift (CLS 0.28 in Lighthouse mobile, 0.06
              before it). Above the text nothing can push it. From md up it is
              absolute to the section, so its place in the DOM does not matter. */}
          <SignalField className="-mx-5 mb-6 block h-24 min-[380px]:h-[150px] w-[calc(100%+2.5rem)] sm:-mx-6 sm:w-[calc(100%+3rem)] md:absolute md:inset-y-0 md:left-0 md:-z-10 md:mx-0 md:mb-0 md:h-full md:w-[46%]" />

          {/* The offer in one line, at a size a five-second glance reads: the
              headline beside it is the pain, not the product, so this line is
              what tells a stranger what is sold and to whom. */}
          <p className="cor-overline-he !text-[15px] sm:!text-base">ליווי עסקי לעצמאים · 30 יום</p>

          {/* Three lines reserved on a phone, for the same reason as the
              paragraph below: at 412–430px the headline is two lines in the
              fallback serif and three in Frank Ruhl Libre (measured 73 ↔ 110px
              while the fonts load). */}
          <h1 id="hero-title" className="cor-display mt-5 min-h-[3lh] text-foreground sm:min-h-0">
            עוד גרסה של ״מי אני״. ועוד אחת. אף אחת לא מחזיקה חודש
            <span className="cor-point">.</span>
          </h1>

          {/* Four lines reserved on a phone. Google Fonts ships Heebo's Hebrew
              and Latin as separate files; when the Hebrew one lands first the
              digits are still in the fallback face and this paragraph wraps to
              four lines, then back to three, and the CTA below jumps twice
              (measured at 390px: 87 → 116 → 87px). The reserved line absorbs
              it. From sm up the paragraph is wide enough not to rewrap. */}
          <p
            id="hero-subtitle"
            className="cor-body-lg mt-6 min-h-[4lh] max-w-xl text-foreground/80 sm:min-h-0"
          >
            בארבע פגישות בחודש, מה שאתם כבר יודעים הופך לארבעה מסמכים: משפט
            אחד שמחזיק, הצעת ערך, מוצר עם מחיר, ו-{outreachCount} פניות לאנשים
            ששמם ידוע לכם.
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
                {program.priceLabel}
              </dd>
              <dd className="text-muted-foreground">{program.installmentsLabel}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">פגישות</dt>
              <dd className="font-bold text-foreground">4, אחת בשבוע</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-muted-foreground">בסוף</dt>
              <dd className="font-bold text-foreground">4 מסמכים שלכם</dd>
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
                עובד סוציאלי טכנולוגי, יועץ עסקי לעצמאים
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
