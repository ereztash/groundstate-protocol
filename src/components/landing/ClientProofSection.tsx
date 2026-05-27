import { Reveal } from "./Reveal";
import VideoTestimonial from "./VideoTestimonial";

/**
 * Client testimonial section.
 *
 * To upgrade with real attribution (recommended for trust):
 *   1. Get explicit permission from the client to publish her name + business.
 *   2. Optionally get a small portrait (square, 200x200+) and drop it
 *      at /public/clients/<name>.jpg.
 *   3. Replace the placeholder fields below.
 *
 * Research basis: testimonials with name + title + specific outcome
 * convert significantly better than anonymous quotes.
 */
type Testimonial = {
  quote: string;
  attribution: string;
  /** Optional secondary credential / outcome line under the name. */
  outcome?: string;
  /** Optional LinkedIn URL; renders the name as a verification link. */
  linkedin?: string;
  /** Optional photo path; falls back to initials if absent. */
  photo?: string;
  initials?: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "המבניות והחיבור מצד אחד ל-AI ומצד שני לסקרנות, היכולת להיות סקרנית ולהוסיף ערך על מה שאני מביאה — זה מה שנתן לי ביטחון.",
    // TODO: replace with real name + business once client approves attribution
    attribution: "לקוחה ראשונה שהשלימה את הרצף",
    outcome: "עסקה של ₪5,500 נסגרה אחרי השלב הרביעי, מתוך 10 הפניות שיצאו בליווי.",
    initials: "ל",
  },
  {
    quote:
      "ארז פשוט מקצוען! כבר בפגישה הראשונה הוא הצליח להעלות תובנות שלא הייתי מגיעה אליהן בלעדיו. ארז רגיש, חכם, מתוחכם ובעל ידע רב ונרחב. מרגישים כמה הוא מסור ומחויב, ובאמת בא להוביל לשינוי והתפתחות של הלקוח. אני ממליצה.",
    attribution: "נועם אורן",
    linkedin: "https://www.linkedin.com/in/noam-oren-836668395/",
    initials: "נא",
  },
];

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
            <h2
              id="client-proof-title"
              className="cor-title mt-2 text-foreground"
            >
              חודש אחד. ארבעה שלבים. עסקה של ₪5,500.
            </h2>
          </div>

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
