import { Reveal } from "./Reveal";
import { preRegistration as pre } from "@/data/preRegistration";

/**
 * The measurement commitment, published before the results exist.
 *
 * This is the one proof-adjacent thing on the site that needed nobody's
 * permission: it is Erez's own commitment rather than a claim about a client,
 * so it has no consent gate and no source gate to wait behind.
 *
 * The framing has to stay exact. A pre-registration is not evidence that the
 * method works; it is a commitment to report what happens, including the case
 * where it does not. The heading and the closing line both say so, because a
 * reader who takes this as a result has been misled by the layout even if every
 * sentence is true.
 *
 * The failure threshold is the load-bearing part. It is rendered at the same
 * weight as everything else and with its consequence attached: the only thing
 * that makes a threshold cost something is that it was fixed in advance.
 */
const ROWS = [pre.window, pre.measures, pre.cohort, pre.reporting] as const;

const PreRegistration = () => {
  return (
    <section
      id="pre-registration"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="pre-registration-title"
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="cor-overline-he">התחייבות שנרשמה מראש</p>
          <h2
            id="pre-registration-title"
            className="cor-title mt-2 text-foreground"
          >
            מה התחייבתי למדוד, לפני שאני יודע את התוצאה.
          </h2>
          <p className="cor-body-lg mt-4 text-foreground/80">
            זו לא הוכחה שהשיטה עובדת. זו התחייבות לפרסם מה קרה, כולל המקרה שבו
            היא לא עבדה.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <dl className="divide-y divide-border border-y border-border">
            {ROWS.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="text-[11px] font-semibold tracking-[0.16em] text-primary">
                  {row.label}
                </dt>
                <dd className="text-sm leading-relaxed text-foreground/85">
                  {"items" in row ? (
                    <ul className="space-y-1">
                      {row.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* The threshold sits apart, at full weight. It is the part a reader
            would most want softened, and softening it would empty the section
            of the only thing that costs anything to say. */}
        <Reveal delay={0.1} className="mt-8">
          <div className="border-s-2 border-accent ps-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-accent">
              {pre.failureThreshold.label}
            </p>
            <p className="cor-body-lg mt-2 text-foreground">
              {pre.failureThreshold.value}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default PreRegistration;
