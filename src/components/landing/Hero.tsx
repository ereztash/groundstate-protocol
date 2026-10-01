import type { MouseEvent } from "react";
import { trackCtaClick } from "@/lib/analytics";
import { outreachCount, program } from "@/data/sprint-stages";
import { videoTestimonial } from "@/lib/clients";
import { LINKEDIN_FOLLOWERS, LINKEDIN_URL, whatsappUrl } from "@/lib/contact";
import { LinkedInIcon } from "@/components/brand/SocialIcons";
import { useDiagnosticForm } from "./DiagnosticFormProvider";

const portrait = `${import.meta.env.BASE_URL}portrait.webp`;

/**
 * The hero, v4 (2026-10-01): the offer first, on paper.
 *
 * The brand test (pre-registered, 30.9) put the charcoal hero in front of
 * people from the target group. All three rated the look 1 of 5, none could say
 * after five seconds what was offered or to whom, and one wrote that the lines
 * of the signal field pulled her focus. They did recognise it, every time; it
 * was distinctive and it pushed them away. So this version gives up the
 * charcoal and the field and keeps one job: say what is sold, to whom, and for
 * how much, before anything else.
 *
 * - The headline is the target group's most frequent pain, in their own words
 *   (the graph's VoC swipe-file, pattern 1, 10 of 12 clients: "I know my craft,
 *   I don't know how to sell it"). The previous headline used pattern 2 ("who
 *   am I", 6 of 12), which readers remembered but could not turn into an offer.
 * - The line under it states the offer outright. Graph heuristic H21, as ruled
 *   on 1.10: the gate needs the customer's pain and an explicit offer; pain
 *   alone earns recognition without understanding.
 * - Next to the price, the two things a cold reader lacks: the signed guarantee
 *   in one sentence, and one client's verdict in her own words (a value claim
 *   is only credible in the client's language, per the VoC node).
 *
 * - Two outside channels (2026-10-01): WhatsApp in the line under the CTA,
 *   because it is the channel Israeli small-business readers expect (four of
 *   eight competitor pages float it), and the LinkedIn following under the
 *   byline, because a stranger's question is whether other people already
 *   read this man. The calendar stays the first path.
 *
 * Unchanged from earlier versions, for the reasons recorded there: nothing
 * animates from invisible, the CTA is a real link to #book, and the price is on
 * the first screen. The headline's last full stop is the brand's copper point.
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
      className="relative pt-24 pb-14 md:pt-32 md:pb-20"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:gap-14">
        <div>
          <p className="cor-overline-he !text-base">ליווי עסקי לעצמאים · 30 יום</p>

          <h1 id="hero-title" className="cor-display mt-5 text-foreground">
            יודעים לעשות את העבודה. לא יודעים איך למכור אותה
            <span className="cor-point">.</span>
          </h1>

          <p
            id="hero-subtitle"
            className="cor-body-lg mt-6 max-w-xl font-medium text-foreground"
          >
            בארבע פגישות בחודש, מה שאתם כבר יודעים נארז כמוצר אחד עם מחיר,
            ויוצא ל-{outreachCount} אנשים ששמם ידוע לכם.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#book"
              onClick={onCta}
              aria-describedby="hero-cta-note"
              className="ld-cta w-full shrink-0 sm:w-auto sm:whitespace-nowrap"
            >
              לתיאום שיחת התאמה
            </a>
            <p id="hero-cta-note" className="text-sm text-muted-foreground">
              30 דקות, ללא עלות. בוחרים מועד ביומן, או{" "}
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick("whatsapp_hero")}
                className="ld-link"
              >
                כותבים לי בוואטסאפ
                <span className="sr-only"> (נפתח בוואטסאפ)</span>
              </a>
              .
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
          </dl>
        </div>

        {/* What a stranger needs before paying someone they do not know: a
            guarantee they can hold him to, a person who already paid him, and
            the face of the person they would be paying. */}
        <div role="group" aria-label="ערבות והמלצה" className="ld-sheet grid gap-6 p-6 sm:p-7 md:mt-10">
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-primary">ערבות חתומה</p>
            <p className="mt-2 leading-relaxed text-foreground">
              אם בסוף מפגש 4 אין בידיכם יחידת מכר (מוצר, משך זמן ומחיר קבוע)
              ו-{outreachCount} פניות שיצאו איתה בפועל לקהל היעד שהגדרנו, אני
              מחזיר את התשלום במלואו.{" "}
              <a href="#price" className="ld-link">לנוסח המלא</a>
            </p>
          </div>

          <figure className="border-t border-border pt-5">
            <blockquote className="text-lg font-medium leading-snug text-foreground">
              ״{videoTestimonial.pullQuote}״
            </blockquote>
            <figcaption className="mt-2 text-sm text-muted-foreground">
              <a
                href={videoTestimonial.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-primary"
              >
                {videoTestimonial.attribution}
                <span className="sr-only"> (נפתח בלינקדאין)</span>
              </a>
            </figcaption>
          </figure>

          {/* Byline: who is behind the page, signed the way an author signs. */}
          <div className="flex items-center gap-3 border-t border-border pt-5">
            <img
              src={portrait}
              alt="תמונת פורטרט: גבר במעיל כהה וחולצה לבנה, מבט ישיר למצלמה, רקע ירוק זית."
              width={64}
              height={64}
              loading="eager"
              decoding="async"
              className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
            />
            <div className="text-sm leading-snug">
              <p className="font-bold text-foreground">ארז טל-שיר</p>
              <p className="text-muted-foreground">
                עובד סוציאלי טכנולוגי, יועץ עסקי לעצמאים
              </p>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick("linkedin_hero")}
                className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-primary"
              >
                <LinkedInIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
                {LINKEDIN_FOLLOWERS.he}
                <span className="sr-only"> (נפתח בלינקדאין)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
