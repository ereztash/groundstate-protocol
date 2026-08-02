import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./Reveal";
import { activeGuarantee } from "@/data/guarantee";
import { faq as items, type QA } from "@/data/faq";

/**
 * The guarantee answer only appears when a variant is live. Until then the
 * question is dropped rather than answered with a promise nobody approved.
 */
function guaranteeItem(): QA | null {
  const g = activeGuarantee();
  if (!g) return null;
  return {
    q: "יש אחריות?",
    a: `${g.headline} ${g.signalsLabel}: ${g.signals.join("; ")}. ${g.signalsNote} ${g.excludedLabel}: ${g.excluded.join(" ")} ${g.documentation}`,
  };
}


const allItems: readonly QA[] = (() => {
  const g = guaranteeItem();
  return g ? [...items.slice(0, 5), g, ...items.slice(5)] : items;
})();

const FAQSection = () => {
  return (
    <section
      id="faq"
      dir="rtl"
      className="relative py-20 md:py-28"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto max-w-2xl px-6">
        <Reveal className="mb-10">
          <p className="cor-overline-he">
            התנגדויות
          </p>
          <h2 id="faq-title" className="cor-title mt-2 text-foreground">
            שאלות
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {allItems.map(({ q, a }, i) => (
              <AccordionItem
                key={q}
                value={`item-${i}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="gap-4 py-5 text-right text-base font-medium text-foreground hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-1 text-sm leading-relaxed text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
};

export default FAQSection;
