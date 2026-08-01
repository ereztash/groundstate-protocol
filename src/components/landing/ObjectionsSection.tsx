import { Reveal, RevealItem, RevealStagger } from "./Reveal";
import { surfacedObjections } from "@/data/faq";

/**
 * The two heavy objections, in the open.
 *
 * Both already existed in FAQSection, which is an accordion: closed by default,
 * so the answer reached only readers who went looking. "Can I not just use GPT"
 * and "how are you different from a coach" are not curiosities a reader looks
 * up, they are the reasons a reader leaves. An objection answered only on
 * request is an objection that mostly goes unanswered.
 *
 * The text is read from src/data/faq.ts rather than copied, so this section, the
 * accordion and the FAQPage JSON-LD in index.html stay one answer. That file's
 * header records what happened the last time two surfaces held the same FAQ
 * separately: Google was served answers the site had already retracted.
 */

const ObjectionsSection = () => {
  const objections = surfacedObjections();

  return (
    <section
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="objections-title"
    >
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <p className="cor-overline-he">מה שאתה כנראה חושב עכשיו</p>
          <h2 id="objections-title" className="cor-title mt-2 text-foreground">
            שתי השאלות שעוצרות אנשים כאן.
          </h2>
        </Reveal>

        <RevealStagger className="mt-10 space-y-8" as="div">
          {objections.map((item) => (
            <RevealItem key={item.q} as="div" className="border-t border-border pt-6">
              <h3 className="cor-subheading text-foreground">{item.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                {item.a}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
};

export default ObjectionsSection;
