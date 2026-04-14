import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";

type Session = {
  day: string;
  title: string;
  desc: string;
  marker: string;
};

const sessions: Session[] = [
  {
    day: "יום 1–3",
    title: "פגישה 1 · אבחון",
    desc: "מיפוי דיסציפלינות, איתור החפיר, ניסוח ראשון של בידול.",
    marker: "Kickoff",
  },
  {
    day: "יום 8",
    title: "פגישה 2 · הנדסת הצעה",
    desc: "מוצר, מבנה, תמחור. הראשון של הצעה שאפשר לתמחר.",
    marker: "Value",
  },
  {
    day: "יום 15–20",
    title: "פגישה 3 · ICP ומילון כאב",
    desc: "פרופיל לקוח, ניסוח 3 פניות, הכנה לבדיקת שוק אמיתית.",
    marker: "Signal",
  },
  {
    day: "יום 22–30",
    title: "פגישה 4 · אות שוק",
    desc: "שלוש פניות נשלחו. ניתוח תשובות. החלטת המשכיות Integration 60.",
    marker: "Close",
  },
];

const SprintTimelineSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 40%"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      dir="rtl"
      className="relative py-24 md:py-32"
      aria-labelledby="sprint-title"
    >
      <div className="mx-auto max-w-4xl px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="cor-overline text-primary">הלוח · 30 ימים</p>
          <h2 id="sprint-title" className="cor-title mt-3 text-foreground">
            ארבע פגישות שמוציאות את הכוח שלך מהסתתר
          </h2>
          <p className="cor-body-lg mt-5 text-muted-foreground">
            מרגע ההתחלה עד אות השוק הראשון — 30 ימים, נעול בלוח, בלי פגישות "לבדוק איפה אנחנו עומדים".
          </p>
        </Reveal>

        <div ref={containerRef} className="relative pr-12 md:pr-16">
          {/* Rail — static + animated fill */}
          <div className="pointer-events-none absolute right-4 top-0 bottom-0 w-px bg-border/40 md:right-6" />
          <motion.div
            className="pointer-events-none absolute right-4 top-0 w-px origin-top bg-gradient-to-b from-primary via-cor-insight to-cor-opportunity md:right-6"
            style={{ height: railHeight }}
          />

          <ol className="space-y-10 md:space-y-14">
            {sessions.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0, 0, 0.2, 1] }}
                className="relative"
              >
                {/* Node marker on rail */}
                <div className="absolute -right-[2.25rem] top-1 md:-right-[2.75rem]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-primary/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                </div>

                <div className="group rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="cor-overline rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-primary">
                      {s.day}
                    </span>
                    <span className="cor-overline text-muted-foreground">
                      {s.marker}
                    </span>
                  </div>
                  <h3 className="cor-subheading mt-3 text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default SprintTimelineSection;
