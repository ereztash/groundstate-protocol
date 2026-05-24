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
  outcome: string;
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
                  <p className="text-sm font-semibold text-foreground">
                    {t.attribution}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {t.outcome}
                  </p>
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
