import { InlineWidget } from "react-calendly";
import { CALENDLY_URL, CALENDLY_PAGE_SETTINGS } from "@/lib/calendly";
import { Reveal } from "./Reveal";

/**
 * Booking section.
 *
 * Copy research basis:
 *  - Implementation intentions (Gollwitzer 1999, APA): specifying WHEN and
 *    WHERE people will act ~2x increases follow-through vs vague intent.
 *  - Action-specificity in CTAs (Levav & Fitzsimons 2006): concrete action
 *    beats abstract benefit framing on commitment tasks.
 *  - Peak-end rule (Kahneman et al. 1993): final page touchpoint anchors the
 *    visitor's memory of the site; keep it concrete and calm.
 */
const BookingSection = () => {
  return (
    <section
      id="booking"
      dir="rtl"
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="booking-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-opportunity" />
      <div className="pointer-events-none absolute inset-x-0 top-0 hairline" />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="cor-overline text-cor-opportunity">
            שיחת אבחון · 20 דקות · ללא עלות
          </p>
          <h2 id="booking-title" className="cor-title mt-3 text-foreground">
            אם זה נכון — 30 הימים הבאים שלך נראים אחרת
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            בחר חלון של 20 דקות בשבוע הקרוב. אני אשאל שלוש שאלות שמכריעות אם הספרינט מתאים לך — ואם לא, אני אומר ישר.
          </p>

          {/* Implementation-intentions prompt (Gollwitzer 1999).
              Telling the user WHEN/WHERE they'll take the action increases
              follow-through in >90 field studies (Gollwitzer & Sheeran 2006 meta). */}
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-border/60 bg-card/40 p-4 text-right backdrop-blur-sm">
            <p className="cor-overline text-primary">לפני שאתה קובע</p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-foreground/85">
              <li>· בחר זמן בו תהיה ליד מחשב, לא בנסיעה.</li>
              <li>· פתח מראש את האתר/הלינקדאין שלך.</li>
              <li>· הקדש 5 דקות אחרי השיחה לכתיבת מה החלטת.</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div
            dir="ltr"
            className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-[0_30px_80px_-30px_hsl(var(--cor-opportunity)/0.3)]"
          >
            <InlineWidget
              url={CALENDLY_URL}
              pageSettings={CALENDLY_PAGE_SETTINGS}
              styles={{ height: "720px", minWidth: "320px" }}
            />
          </div>
        </Reveal>

        <Reveal
          delay={0.2}
          className="mt-8 text-center text-xs text-muted-foreground"
        >
          לא נפתח אצלך? פתח ישירות ב-
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noreferrer"
            className="mx-1 font-mono text-primary underline-offset-4 hover:underline"
          >
            Calendly
          </a>
          .
        </Reveal>
      </div>
    </section>
  );
};

export default BookingSection;
